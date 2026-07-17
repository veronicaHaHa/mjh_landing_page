// GA4 custom events: outbound clicks, video clicks, and inbound referrals.
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

  // Friendly labels for inbound referrers (document.referrer host).
  var REFERRERS = {
    'foliobin.com': 'Foliobin',
    'linkedin.com': 'LinkedIn',
    'lnkd.in': 'LinkedIn',
    'behance.net': 'Behance',
    'dribbble.com': 'Dribbble',
    'twitter.com': 'X',
    'x.com': 'X',
    't.co': 'X',
    'instagram.com': 'Instagram',
    'l.instagram.com': 'Instagram',
    'facebook.com': 'Facebook',
    'l.facebook.com': 'Facebook',
    'm.facebook.com': 'Facebook',
    'google.com': 'Google',
    'bing.com': 'Bing'
  };

  // Prefer specific URLs when a domain hosts more than one kind of link.
  var NAMED_URLS = [
    {
      test: /docs\.google\.com\/presentation\/d\/1XNQtGw6XLGIw5zUrd4F8SK_VDNWKxXbhn6GOl7ojoug/i,
      label: 'Grab case study'
    }
  ];

  function bareDomain(host) {
    return (host || '').replace(/^www\./, '');
  }

  function destinationLabel(href, domain) {
    for (var i = 0; i < NAMED_URLS.length; i++) {
      if (NAMED_URLS[i].test.test(href)) return NAMED_URLS[i].label;
    }
    return NAMED[domain] || domain;
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
      destination: destinationLabel(href, domain),
      link_domain: domain,
      link_url: href,
      link_text: (link.textContent || '').trim().slice(0, 100),
      page_path: location.pathname
    });
  }, true);

  // Derive a readable name for a video: aria-label, else the file name.
  function videoName(video) {
    var label = (video.getAttribute('aria-label') || '').trim();
    if (label) return label.slice(0, 100);
    var src = video.currentSrc || video.getAttribute('src') || '';
    return decodeURIComponent(src.split('/').pop().replace(/\.[a-z0-9]+$/i, ''));
  }

  // GA4 custom event: track clicks on prototype/demo videos.
  document.addEventListener('click', function (e) {
    var video = e.target && e.target.closest ? e.target.closest('video') : null;
    if (!video) return;
    if (typeof window.gtag !== 'function') return;

    window.gtag('event', 'video_click', {
      video_name: videoName(video),
      video_src: (video.currentSrc || video.getAttribute('src') || '').split('/').pop(),
      page_path: location.pathname
    });
  }, true);

  // GA4 custom event: inbound referral (once per tab session).
  // Complements GA4's automatic session source — useful in Realtime / Events.
  function trackReferralVisit() {
    if (typeof window.gtag !== 'function') return;

    var params = new URLSearchParams(location.search);
    var utmSource = (params.get('utm_source') || '').trim();
    var utmMedium = (params.get('utm_medium') || '').trim();
    var utmCampaign = (params.get('utm_campaign') || '').trim();

    var referrerHost = '';
    try {
      if (document.referrer) referrerHost = bareDomain(new URL(document.referrer).hostname);
    } catch (err) { /* ignore bad referrer */ }

    // Same-site navigations are not referrals.
    if (referrerHost && referrerHost === bareDomain(location.hostname)) return;

    var source = '';
    var medium = '';

    if (utmSource) {
      source = utmSource;
      medium = utmMedium || 'referral';
    } else if (referrerHost) {
      source = REFERRERS[referrerHost] || referrerHost;
      medium = 'referral';
    } else {
      return; // direct / no referrer
    }

    var dedupeKey = 'ga_referral_visit:' + source + ':' + medium + ':' + utmCampaign;
    try {
      if (sessionStorage.getItem(dedupeKey)) return;
      sessionStorage.setItem(dedupeKey, '1');
    } catch (err) { /* private mode — still fire once this load */ }

    window.gtag('event', 'referral_visit', {
      referral_source: source,
      referral_medium: medium,
      referral_campaign: utmCampaign || undefined,
      referrer_host: referrerHost || undefined,
      referrer_url: document.referrer ? document.referrer.slice(0, 200) : undefined,
      page_path: location.pathname
    });
  }

  trackReferralVisit();
})();
