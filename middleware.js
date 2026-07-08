import { next } from '@vercel/edge';

/*
 * Server-side passcode gate (Vercel Edge Middleware).
 *
 * Runs on Vercel's edge BEFORE any file is served, so it cannot be bypassed
 * from the browser (unlike the old sessionStorage check). Protects the work
 * page, every case study, and all case-study media in /img. The public
 * homepage and its assets are allowlisted below.
 *
 * Requires a project env var AUTH_SECRET (any long random string) used to
 * sign the session cookie. Without it, protected content fails closed.
 */

export const config = {
  // Run on everything except Vercel's internal routes.
  matcher: '/((?!_vercel/).*)',
};

// SHA-256 of the current passcode (same hash the client used before).
const PASSCODE_SHA256 = 'f24beb7de6d29ad33c807d73b2fefc452020c9294af5df445ef295e838bbfc0d';

const COOKIE_NAME = 'cs_auth';
const MAX_AGE_SEC = 5 * 24 * 60 * 60; // 5 days
const AUTH_PATH = '/__auth';

// Public paths — served without a passcode. Everything else is gated.
const PUBLIC_EXACT = new Set([
  '/',
  '/index.html',
  '/404.html',
  '/favicon.ico',
  '/favicon.png',
  '/robots.txt',
  // Homepage images referenced by index.html + css/style.css:
  '/img/FutureConference_Speaker.JPG',
  '/img/Profile-card_back.jpg',
  '/img/Teens are on mobile.jpg',
  '/img/header_bg.png',
  '/img/arrow.png',
  '/img/cashtree.png',
  '/img/grafolio.jpg',
  '/img/icon.png',
  '/img/minjeehahm_bg.png',
  '/img/naver.jpg',
  '/img/prf_01.png',
  '/img/skplanet.jpg',
]);

const PUBLIC_PREFIXES = [
  '/css/',
  '/js/',
  '/fonts/',
  '/img/ico_', // social + skill icons (all public chrome)
  '/img/Abstract_bg_', // decorative backgrounds
];

const enc = new TextEncoder();

function toHex(buf) {
  return Array.from(new Uint8Array(buf))
    .map(function (b) { return b.toString(16).padStart(2, '0'); })
    .join('');
}

async function sha256Hex(msg) {
  return toHex(await crypto.subtle.digest('SHA-256', enc.encode(msg)));
}

async function hmacHex(secret, msg) {
  const key = await crypto.subtle.importKey(
    'raw', enc.encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']
  );
  return toHex(await crypto.subtle.sign('HMAC', key, enc.encode(msg)));
}

// Constant-time string compare to avoid leaking timing on the hash/signature.
function safeEqual(a, b) {
  if (typeof a !== 'string' || typeof b !== 'string' || a.length !== b.length) return false;
  let r = 0;
  for (let i = 0; i < a.length; i++) r |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return r === 0;
}

// Token = "<expiryMs>.<hmac(secret, expiryMs)>"
async function makeToken(secret) {
  const exp = String(Date.now() + MAX_AGE_SEC * 1000);
  return exp + '.' + (await hmacHex(secret, exp));
}

async function verifyToken(secret, token) {
  if (!token) return false;
  const dot = token.indexOf('.');
  if (dot < 0) return false;
  const exp = token.slice(0, dot);
  const sig = token.slice(dot + 1);
  if (!/^\d+$/.test(exp)) return false;
  if (Number(exp) < Date.now()) return false;
  return safeEqual(sig, await hmacHex(secret, exp));
}

function isPublic(pathname) {
  let p = pathname;
  try { p = decodeURIComponent(pathname); } catch (e) { /* keep raw */ }
  if (PUBLIC_EXACT.has(p)) return true;
  for (let i = 0; i < PUBLIC_PREFIXES.length; i++) {
    if (p.indexOf(PUBLIC_PREFIXES[i]) === 0) return true;
  }
  return false;
}

function readCookie(request, name) {
  const raw = request.headers.get('cookie') || '';
  const parts = raw.split(';');
  for (let i = 0; i < parts.length; i++) {
    const idx = parts[i].indexOf('=');
    if (idx < 0) continue;
    if (parts[i].slice(0, idx).trim() === name) return parts[i].slice(idx + 1).trim();
  }
  return null;
}

function setCookieHeader(value) {
  return COOKIE_NAME + '=' + value + '; Path=/; Max-Age=' + MAX_AGE_SEC + '; HttpOnly; Secure; SameSite=Lax';
}

function json(obj, status, extraHeaders) {
  const headers = { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' };
  if (extraHeaders) Object.assign(headers, extraHeaders);
  return new Response(JSON.stringify(obj), { status: status, headers: headers });
}

export default async function middleware(request) {
  const url = new URL(request.url);
  const pathname = url.pathname;
  const secret = process.env.AUTH_SECRET;

  // --- Login endpoint ---
  if (pathname === AUTH_PATH) {
    if (request.method !== 'POST') return json({ ok: false }, 405);
    if (!secret) return json({ ok: false, error: 'server_misconfigured' }, 500);

    let passcode = '';
    try {
      const ct = request.headers.get('content-type') || '';
      if (ct.indexOf('application/json') === 0) {
        const body = await request.json();
        passcode = String((body && body.passcode) || '');
      } else {
        const text = await request.text();
        passcode = new URLSearchParams(text).get('passcode') || '';
      }
    } catch (e) {
      return json({ ok: false, error: 'bad_request' }, 400);
    }

    const hash = await sha256Hex(passcode);
    if (!safeEqual(hash, PASSCODE_SHA256)) return json({ ok: false }, 401);

    const token = await makeToken(secret);
    return json({ ok: true }, 200, { 'Set-Cookie': setCookieHeader(token) });
  }

  // --- Public assets pass straight through ---
  if (isPublic(pathname)) return next();

  // --- Protected: require a valid signed cookie ---
  if (secret) {
    const token = readCookie(request, COOKIE_NAME);
    if (await verifyToken(secret, token)) return next();
  }

  // Not authorized. Serve a login page for navigations, 401 for assets.
  const accept = request.headers.get('accept') || '';
  if (accept.indexOf('text/html') !== -1) {
    return new Response(loginPage(), {
      status: 401,
      headers: { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'no-store' },
    });
  }
  return new Response('Unauthorized', { status: 401, headers: { 'Cache-Control': 'no-store' } });
}

// Minimal fallback login page (shown on direct hits to a protected URL).
// The main entry point is the on-brand modal on the homepage.
function loginPage() {
  return '<!doctype html><html lang="en"><head><meta charset="utf-8">' +
    '<meta name="viewport" content="width=device-width, initial-scale=1">' +
    '<title>Enter passcode — MinJee Hahm</title>' +
    '<style>' +
    '*{box-sizing:border-box}' +
    'body{margin:0;min-height:100vh;display:flex;align-items:center;justify-content:center;' +
    'background:#0f0f0f;color:#f5f5f5;font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Helvetica,Arial,sans-serif}' +
    '.card{width:100%;max-width:360px;padding:40px 32px;text-align:center}' +
    'h1{font-size:20px;font-weight:600;margin:0 0 8px}' +
    'p{font-size:14px;color:#a0a0a0;margin:0 0 24px;line-height:1.5}' +
    'input{width:100%;padding:12px 14px;border:1px solid #333;border-radius:8px;background:#1a1a1a;' +
    'color:#fff;font-size:15px;margin-bottom:12px}' +
    'input:focus{outline:none;border-color:#666}' +
    'button{width:100%;padding:12px;border:0;border-radius:8px;background:#fff;color:#0f0f0f;' +
    'font-size:15px;font-weight:600;cursor:pointer}' +
    'button:disabled{opacity:.5;cursor:default}' +
    '.err{color:#ff6b6b;font-size:13px;margin-top:12px;display:none}' +
    '.home{display:inline-block;margin-top:20px;color:#888;font-size:13px;text-decoration:none}' +
    '</style></head><body><div class="card">' +
    '<h1>This page is passcode-protected</h1>' +
    '<p>Enter the passcode to view MinJee&rsquo;s case studies.</p>' +
    '<form id="f" autocomplete="off">' +
    '<input id="p" type="password" placeholder="Enter passcode" autofocus>' +
    '<button id="b" type="submit">Unlock</button>' +
    '<div class="err" id="e">Incorrect passcode. Try again.</div>' +
    '</form>' +
    '<a class="home" href="/">&larr; Back to home</a>' +
    '</div><script>' +
    "var f=document.getElementById('f'),p=document.getElementById('p'),b=document.getElementById('b'),e=document.getElementById('e');" +
    "f.addEventListener('submit',function(ev){ev.preventDefault();b.disabled=true;e.style.display='none';" +
    "fetch('/__auth',{method:'POST',headers:{'Content-Type':'application/x-www-form-urlencoded'},body:'passcode='+encodeURIComponent(p.value)})" +
    ".then(function(r){return r.json().catch(function(){return{ok:r.ok}});})" +
    ".then(function(res){b.disabled=false;if(res&&res.ok){location.reload();}else{e.style.display='block';p.value='';p.focus();}})" +
    ".catch(function(){b.disabled=false;e.style.display='block';});});" +
    '</script></body></html>';
}
