/* ============================================================
   MinJee Hahm — Portfolio Scripts
   Vanilla JS, no dependencies
   ============================================================ */

(function () {
  'use strict';

  // --- Scroll-triggered fade-in animations ---
  var observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -40px 0px'
  };

  var fadeObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        fadeObserver.unobserve(entry.target);
      }
    });
  }, observerOptions);

  document.querySelectorAll('.fade-in, .fade-in-stagger').forEach(function (el) {
    fadeObserver.observe(el);
  });

  // --- Sticky nav background on scroll ---
  var nav = document.querySelector('.site-nav');
  var scrollThreshold = 60;

  function handleNavScroll() {
    if (window.scrollY > scrollThreshold) {
      nav.classList.add('is-scrolled');
    } else {
      nav.classList.remove('is-scrolled');
    }
  }

  window.addEventListener('scroll', handleNavScroll, { passive: true });
  handleNavScroll();

  // --- Mobile nav toggle ---
  var navToggle = document.querySelector('.nav-toggle');
  var navLinks = document.querySelector('.nav-links');

  if (navToggle && navLinks) {
    navToggle.addEventListener('click', function () {
      navToggle.classList.toggle('is-active');
      navLinks.classList.toggle('is-open');
      document.body.style.overflow = navLinks.classList.contains('is-open') ? 'hidden' : '';

      var expanded = navToggle.getAttribute('aria-expanded') === 'true';
      navToggle.setAttribute('aria-expanded', !expanded);
    });

    navLinks.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        navToggle.classList.remove('is-active');
        navLinks.classList.remove('is-open');
        document.body.style.overflow = '';
        navToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // --- Active nav link highlighting ---
  var sections = document.querySelectorAll('section[id]');
  var navAnchors = document.querySelectorAll('.nav-links a[href^="#"]');

  var sectionObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        var id = entry.target.getAttribute('id');
        navAnchors.forEach(function (a) {
          a.style.color = '';
        });
        var activeLink = document.querySelector('.nav-links a[href="#' + id + '"]');
        if (activeLink) {
          activeLink.style.color = 'var(--color-text)';
        }
      }
    });
  }, { threshold: 0.3, rootMargin: '-80px 0px -50% 0px' });

  sections.forEach(function (section) {
    sectionObserver.observe(section);
  });

  // --- Current year in footer ---
  var yearEl = document.querySelector('.footer-year');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

  // --- Passcode modal for protected case studies ---
  var PASSCODE_HASH = 'f24beb7de6d29ad33c807d73b2fefc452020c9294af5df445ef295e838bbfc0d';
  var modal = document.getElementById('passcode-modal');
  var modalForm = document.getElementById('passcode-form');
  var modalInput = document.getElementById('passcode-input');
  var modalError = document.getElementById('passcode-error');
  var modalClose = document.getElementById('modal-close');
  var pendingHref = null;

  function hashPasscode(value) {
    var encoder = new TextEncoder();
    return crypto.subtle.digest('SHA-256', encoder.encode(value)).then(function (buffer) {
      var hashArray = Array.from(new Uint8Array(buffer));
      return hashArray.map(function (b) { return b.toString(16).padStart(2, '0'); }).join('');
    });
  }

  if (modal) {
    // Intercept clicks on protected project cards
    document.querySelectorAll('a.project-card[href="case-study-meta.html"]').forEach(function (card) {
      card.addEventListener('click', function (e) {
        if (sessionStorage.getItem('cs-unlocked') === '1') return;
        e.preventDefault();
        pendingHref = card.getAttribute('href');
        modal.classList.add('is-open');
        modal.setAttribute('aria-hidden', 'false');
        modalError.style.display = 'none';
        modalInput.value = '';
        setTimeout(function () { modalInput.focus(); }, 100);
      });
    });

    modalForm.addEventListener('submit', function (e) {
      e.preventDefault();
      hashPasscode(modalInput.value).then(function (hash) {
        if (hash === PASSCODE_HASH) {
          sessionStorage.setItem('cs-unlocked', '1');
          modal.classList.remove('is-open');
          modal.setAttribute('aria-hidden', 'true');
          if (pendingHref) window.location.href = pendingHref;
        } else {
          modalError.style.display = 'block';
          modalInput.value = '';
          modalInput.focus();
        }
      });
    });

    modalClose.addEventListener('click', function () {
      modal.classList.remove('is-open');
      modal.setAttribute('aria-hidden', 'true');
    });

    modal.addEventListener('click', function (e) {
      if (e.target === modal) {
        modal.classList.remove('is-open');
        modal.setAttribute('aria-hidden', 'true');
      }
    });
  }

  // --- Hero particle sphere animation ---
  var canvas = document.getElementById('hero-canvas');
  if (canvas) {
    var ctx = canvas.getContext('2d');
    var dpr = window.devicePixelRatio || 1;

    function resizeCanvas() {
      var rect = canvas.parentElement.getBoundingClientRect();
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      canvas.style.width = rect.width + 'px';
      canvas.style.height = rect.height + 'px';
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Generate points: main sphere + latitude/longitude grid lines
    var spherePoints = [];
    var goldenAngle = Math.PI * (3 - Math.sqrt(5));

    // Fibonacci-distributed surface points
    var numSurface = 3000;
    for (var i = 0; i < numSurface; i++) {
      var y = 1 - (i / (numSurface - 1)) * 2;
      var radiusAtY = Math.sqrt(1 - y * y);
      var theta = goldenAngle * i;
      spherePoints.push({
        x: Math.cos(theta) * radiusAtY,
        y: y,
        z: Math.sin(theta) * radiusAtY,
        type: 'surface'
      });
    }

    // Latitude rings
    var latRings = 18;
    var pointsPerRing = 120;
    for (var ring = 1; ring < latRings; ring++) {
      var phi = (ring / latRings) * Math.PI;
      var rY = Math.cos(phi);
      var rR = Math.sin(phi);
      for (var j = 0; j < pointsPerRing; j++) {
        var theta = (j / pointsPerRing) * Math.PI * 2;
        spherePoints.push({
          x: Math.cos(theta) * rR,
          y: rY,
          z: Math.sin(theta) * rR,
          type: 'grid'
        });
      }
    }

    // Longitude meridians
    var lonLines = 24;
    var pointsPerLine = 120;
    for (var line = 0; line < lonLines; line++) {
      var theta = (line / lonLines) * Math.PI * 2;
      for (var j = 0; j < pointsPerLine; j++) {
        var phi = (j / pointsPerLine) * Math.PI;
        spherePoints.push({
          x: Math.sin(phi) * Math.cos(theta),
          y: Math.cos(phi),
          z: Math.sin(phi) * Math.sin(theta),
          type: 'grid'
        });
      }
    }

    var time = 0;

    // Color gradient: warm rose → accent purple → cool blue
    var gradientStops = [
      [200, 140, 100],   // warm gold/rose
      [124, 58, 237],    // accent purple (#7c3aed)
      [80, 120, 235]     // cool blue
    ];

    function lerpColor(t) {
      // Map t (0–1) across 3 stops
      var seg = t * 2; // 0–2 range across 3 stops
      var idx = Math.min(Math.floor(seg), 1);
      var frac = seg - idx;
      var a = gradientStops[idx];
      var b = gradientStops[idx + 1];
      return [
        Math.round(a[0] + (b[0] - a[0]) * frac),
        Math.round(a[1] + (b[1] - a[1]) * frac),
        Math.round(a[2] + (b[2] - a[2]) * frac)
      ];
    }

    function animate() {
      var w = canvas.width / dpr;
      var h = canvas.height / dpr;
      ctx.clearRect(0, 0, w, h);

      time += 0.004;
      var rotY = time * 0.8;
      var rotX = Math.sin(time * 0.6) * 0.4 + Math.cos(time * 0.25) * 0.15;
      var rotZ = Math.cos(time * 0.45) * 0.2 + Math.sin(time * 0.35) * 0.1;

      // Position sphere on the right
      var centerX = w * 0.72;
      var centerY = h * 0.5;
      var baseRadius = Math.min(w, h) * 0.28;

      var cosY = Math.cos(rotY), sinY = Math.sin(rotY);
      var cosX = Math.cos(rotX), sinX = Math.sin(rotX);
      var cosZ = Math.cos(rotZ), sinZ = Math.sin(rotZ);

      for (var i = 0; i < spherePoints.length; i++) {
        var p = spherePoints[i];

        // Aggressive multi-layer organic distortion
        var d1 = Math.sin(p.y * 3 + time * 2.5) * Math.cos(p.x * 2.5 + time * 1.8);
        var d2 = Math.sin(p.z * 4 + time * 3) * Math.cos(p.y * 5 - time * 1.5);
        var d3 = Math.cos(p.x * 6 + p.z * 4 + time * 1.2) * Math.sin(p.y * 3 - time * 2);
        var d4 = Math.sin((p.x + p.y + p.z) * 3 + time * 2) * 0.5;
        var d5 = Math.cos(p.x * 8 + time * 0.7) * Math.sin(p.z * 7 - time * 1.1);
        var pulse = 1 + 0.06 * Math.sin(time * 1.5);
        var distort = pulse + 0.18 * d1 + 0.12 * d2 + 0.08 * d3 + 0.06 * d4 + 0.04 * d5;

        var px = p.x * distort;
        var py = p.y * distort;
        var pz = p.z * distort;

        // Rotate Y
        var x1 = px * cosY - pz * sinY;
        var z1 = px * sinY + pz * cosY;
        // Rotate X
        var y1 = py * cosX - z1 * sinX;
        var z2 = py * sinX + z1 * cosX;
        // Rotate Z
        var x2 = x1 * cosZ - y1 * sinZ;
        var y2 = x1 * sinZ + y1 * cosZ;

        var scale = 1 / (1 + z2 * 0.25);
        var screenX = centerX + x2 * baseRadius * scale;
        var screenY = centerY + y2 * baseRadius * scale;

        var depth = (z2 + 1) / 2;

        // Gradient based on vertical position + time shift
        var gradientT = (p.y + 1) / 2;
        gradientT = (gradientT + Math.sin(time * 0.5) * 0.3 + 0.3) % 1;
        var col = lerpColor(gradientT);

        // Sweeping shimmer hotspot
        var shimmerX = Math.cos(time * 1.2) * 0.6;
        var shimmerY = Math.sin(time * 0.9) * 0.5;
        var shimmerZ = Math.cos(time * 0.7) * 0.4;
        var shimmerDist = Math.sqrt(
          (p.x - shimmerX) * (p.x - shimmerX) +
          (p.y - shimmerY) * (p.y - shimmerY) +
          (p.z - shimmerZ) * (p.z - shimmerZ)
        );
        var shimmerBoost = Math.max(0, 1 - shimmerDist * 2.5) * 0.45;

        if (p.type === 'grid') {
          var alpha = 0.06 + depth * 0.22 + shimmerBoost * 0.5;
          var dotSize = 0.5;
        } else {
          var alpha = 0.12 + depth * 0.55 + shimmerBoost;
          var dotSize = 0.5;
        }

        // Brighten color toward white near shimmer hotspot
        var sr = Math.min(255, col[0] + Math.round(shimmerBoost * 180));
        var sg = Math.min(255, col[1] + Math.round(shimmerBoost * 180));
        var sb = Math.min(255, col[2] + Math.round(shimmerBoost * 180));

        ctx.beginPath();
        ctx.arc(screenX, screenY, dotSize * scale, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(' + sr + ',' + sg + ',' + sb + ',' + alpha + ')';
        ctx.fill();
      }

      requestAnimationFrame(animate);
    }

    animate();
  }

})();
