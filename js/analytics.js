// GA4 custom event: track clicks on outbound links.
// Sends an "outbound_click" event for any link to an external http(s) domain,
// so destinations like Behance and Google Slides are tracked automatically —
// including links added in the future.
(function () {
  // Friendly labels for known destinations (matched on bare domain).
  var NAMED = {
    'behance.net': 'Behance',
    'docs.google.com': 'Google Slides',
    'linkedin.com': 'LinkedIn',
    'dribbble.com': 'Dribbble',
    'tiktok.com': 'TikTok',
    'horizon.meta.com': 'Horizon Worlds',
    'creators.instagram.com': 'Instagram Creators',
    'help.instagram.com': 'Instagram Help',
    'about.fb.com': 'Meta Newsroom'
  };

  function bareDomain(host) {
    return (host || '').replace(/^www\./, '');
  }

  document.addEventListener('click', function (e) {
    var link = e.target && e.target.closest ? e.target.closest('a[href]') : null;
    if (!link) return;

    var href = link.href;
    if (!/^https?:\/\//i.test(href)) return; // only absolute http(s) links

    var domain;
    try { domain = bareDomain(new URL(href).hostname); }
    catch (err) { return; }

    // Skip internal links (same site).
    if (!domain || domain === bareDomain(location.hostname)) return;

    if (typeof window.gtag !== 'function') return;

    window.gtag('event', 'outbound_click', {
      destination: NAMED[domain] || domain,
      link_domain: domain,
      link_url: href,
      link_text: (link.textContent || '').trim().slice(0, 100),
      page_path: location.pathname
    });
  }, true);
})();
