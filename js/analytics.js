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
})();
