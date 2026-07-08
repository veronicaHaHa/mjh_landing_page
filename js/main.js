/* ============================================================
   MinJee Hahm — Portfolio Scripts
   Vanilla JS, no dependencies
   ============================================================ */

(function () {
  'use strict';

  // --- Deter casual saving of case-study media (videos/images) ---
  // Friction only — a determined viewer can still capture what they can see.
  // Scoped to the protected pages so the public homepage is unaffected.
  if (/case-study|work\.html/.test(location.pathname)) {
    var blockMedia = function (e) {
      if (e.target && e.target.matches && e.target.matches('img, video')) e.preventDefault();
    };
    document.addEventListener('contextmenu', blockMedia);
    document.addEventListener('dragstart', blockMedia);
  }

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

  // --- Passcode modal for selected work ---
  // Passcode is verified server-side by the Vercel Edge Middleware (see /middleware.js);
  // this modal just posts the entry to /__auth. No secret lives in the client anymore.
  var modal = document.getElementById('passcode-modal');
  var modalForm = document.getElementById('passcode-form');
  var modalInput = document.getElementById('passcode-input');
  var modalError = document.getElementById('passcode-error');
  var modalTitle = document.getElementById('modal-title');
  var modalDesc = document.querySelector('.modal-desc');
  var modalClose = document.getElementById('modal-close');
  var pendingHref = null;

  if (modal) {
    function showPasscodeModal(e, href) {
      if (href === 'work.html') {
        // Work gate — already unlocked, navigate directly
        if (sessionStorage.getItem('cs-unlocked') === '1') {
          window.location.href = 'work.html';
          return;
        }
      } else if (href) {
        // Resume gate — already unlocked, let default download proceed
        if (sessionStorage.getItem('resume-unlocked') === '1') {
          return;
        }
      }
      e.preventDefault();
      pendingHref = href;
      if (modalTitle) modalTitle.textContent = href === 'work.html' ? 'Selected Work' : 'Download Resume';
      if (modalDesc) modalDesc.textContent = href === 'work.html' ? 'Enter the passcode to view case studies.' : 'Enter the passcode to download the resume.';
      modal.classList.add('is-open');
      modal.setAttribute('aria-hidden', 'false');
      modalError.style.display = 'none';
      modalInput.value = '';
      setTimeout(function () { modalInput.focus(); }, 100);
    }

    // Hero "View Work" button
    var heroViewWorkBtn = document.getElementById('hero-view-work');
    if (heroViewWorkBtn) {
      heroViewWorkBtn.addEventListener('click', function (e) {
        showPasscodeModal(e, 'work.html');
      });
    }

    // Nav + footer "Work" links
    ['nav-work-link', 'footer-work-link'].forEach(function (id) {
      var el = document.getElementById(id);
      if (el) {
        el.addEventListener('click', function (e) {
          showPasscodeModal(e, 'work.html');
        });
      }
    });

    // Protect resume download
    var resumeLink = document.getElementById('resume-link');
    if (resumeLink) {
      resumeLink.addEventListener('click', function (e) {
        showPasscodeModal(e, resumeLink.getAttribute('href'));
      });
    }

    modalForm.addEventListener('submit', function (e) {
      e.preventDefault();
      var submitBtn = modalForm.querySelector('.modal-btn');
      if (submitBtn) submitBtn.disabled = true;
      modalError.style.display = 'none';
      // Verify server-side: sets a signed, HttpOnly session cookie on success.
      fetch('/__auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: 'passcode=' + encodeURIComponent(modalInput.value)
      }).then(function (r) {
        return r.json().catch(function () { return { ok: r.ok }; });
      }).then(function (res) {
        if (submitBtn) submitBtn.disabled = false;
        if (res && res.ok) {
          modal.classList.remove('is-open');
          modal.setAttribute('aria-hidden', 'true');
          // UX hint so repeat clicks this session skip the modal (real gate is the cookie).
          try {
            sessionStorage.setItem('cs-unlocked', '1');
            sessionStorage.setItem('resume-unlocked', '1');
          } catch (err) { /* ignore */ }
          window.location.href = (pendingHref && pendingHref !== 'work.html') ? pendingHref : 'work.html';
        } else {
          modalError.style.display = 'block';
          modalInput.value = '';
          modalInput.focus();
        }
      }).catch(function () {
        if (submitBtn) submitBtn.disabled = false;
        modalError.style.display = 'block';
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

    // Generate particles on sphere surface with physics state
    var particles = [];
    var goldenAngle = Math.PI * (3 - Math.sqrt(5));

    var numSurface = 3000;
    for (var i = 0; i < numSurface; i++) {
      var y = 1 - (i / (numSurface - 1)) * 2;
      var radiusAtY = Math.sqrt(1 - y * y);
      var theta = goldenAngle * i;
      particles.push({
        bx: Math.cos(theta) * radiusAtY,
        by: y,
        bz: Math.sin(theta) * radiusAtY,
        type: 'surface',
        px: 0, py: 0,
        vx: 0, vy: 0,
        phx: Math.random() * Math.PI * 2,
        phy: Math.random() * Math.PI * 2,
        amp: 20 + Math.random() * 55,
        initialized: false
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
        particles.push({
          bx: Math.cos(theta) * rR,
          by: rY,
          bz: Math.sin(theta) * rR,
          type: 'grid',
          px: 0, py: 0,
          vx: 0, vy: 0,
          phx: Math.random() * Math.PI * 2,
          phy: Math.random() * Math.PI * 2,
          amp: 20 + Math.random() * 55,
          initialized: false
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
        particles.push({
          bx: Math.sin(phi) * Math.cos(theta),
          by: Math.cos(phi),
          bz: Math.sin(phi) * Math.sin(theta),
          type: 'grid',
          px: 0, py: 0,
          vx: 0, vy: 0,
          phx: Math.random() * Math.PI * 2,
          phy: Math.random() * Math.PI * 2,
          amp: 20 + Math.random() * 55,
          initialized: false
        });
      }
    }

    var time = 0;

    // Color gradient: rose → pink → warm orange → yellow → green → turquoise → cool blue → indigo → purple → violet
    var gradientStops = [
      [200, 120, 150],   // rose
      [230, 100, 150],   // pink
      [210, 150, 100],   // warm orange
      [220, 200, 80],    // yellow
      [80, 200, 120],    // green
      [60, 200, 180],    // turquoise
      [80, 120, 235],    // cool blue
      [100, 90, 236],    // indigo
      [124, 58, 237],    // purple (#7c3aed)
      [160, 50, 220]     // violet
    ];

    function lerpColor(t) {
      var seg = t * (gradientStops.length - 1);
      var idx = Math.min(Math.floor(seg), gradientStops.length - 2);
      var frac = seg - idx;
      // Smoothstep for smoother transitions
      frac = frac * frac * (3 - 2 * frac);
      var a = gradientStops[idx];
      var b = gradientStops[idx + 1];
      return [
        Math.round(a[0] + (b[0] - a[0]) * frac),
        Math.round(a[1] + (b[1] - a[1]) * frac),
        Math.round(a[2] + (b[2] - a[2]) * frac)
      ];
    }

    // Cursor tracking for particle attraction
    var mouseX = -9999, mouseY = -9999;
    var heroSection = canvas.parentElement;

    heroSection.addEventListener('mousemove', function(e) {
      var rect = canvas.getBoundingClientRect();
      mouseX = e.clientX - rect.left;
      mouseY = e.clientY - rect.top;
    });

    heroSection.addEventListener('mouseleave', function() {
      mouseX = -9999;
      mouseY = -9999;
    });

    heroSection.addEventListener('touchmove', function(e) {
      var rect = canvas.getBoundingClientRect();
      mouseX = e.touches[0].clientX - rect.left;
      mouseY = e.touches[0].clientY - rect.top;
    }, { passive: true });

    heroSection.addEventListener('touchend', function() {
      mouseX = -9999;
      mouseY = -9999;
    });

    function animate() {
      var w = canvas.width / dpr;
      var h = canvas.height / dpr;
      ctx.clearRect(0, 0, w, h);

      time += 0.002;

      var rotY = time * 0.4;
      var rotX = Math.sin(time * 0.3) * 0.4 + Math.cos(time * 0.12) * 0.15;
      var rotZ = Math.cos(time * 0.22) * 0.2 + Math.sin(time * 0.17) * 0.1;

      // Position sphere on the right
      var centerX = w * 0.66;
      var centerY = h * 0.5;
      var baseRadius = Math.min(w, h) * 0.34;

      var cosY = Math.cos(rotY), sinY = Math.sin(rotY);
      var cosX = Math.cos(rotX), sinX = Math.sin(rotX);
      var cosZ = Math.cos(rotZ), sinZ = Math.sin(rotZ);


      var projected = [];
      var influenceRadius = baseRadius * 0.55;
      var influenceRadiusSq = influenceRadius * influenceRadius;
      var springHome = 0.08;
      var springChase = 0.05;
      var damping = 0.75;

      for (var i = 0; i < particles.length; i++) {
        var p = particles[i];

        // Original multi-layer organic distortion
        var d1 = Math.sin(p.by * 3 + time * 2.5) * Math.cos(p.bx * 2.5 + time * 1.8);
        var d2 = Math.sin(p.bz * 4 + time * 3) * Math.cos(p.by * 5 - time * 1.5);
        var d3 = Math.cos(p.bx * 6 + p.bz * 4 + time * 1.2) * Math.sin(p.by * 3 - time * 2);
        var d4 = Math.sin((p.bx + p.by + p.bz) * 3 + time * 2) * 0.5;
        var d5 = Math.cos(p.bx * 8 + time * 0.7) * Math.sin(p.bz * 7 - time * 1.1);
        var pulse = 1 + 0.06 * Math.sin(time * 1.5);
        var distort = pulse + 0.18 * d1 + 0.12 * d2 + 0.08 * d3 + 0.06 * d4 + 0.04 * d5;

        var px = p.bx * distort;
        var py = p.by * distort;
        var pz = p.bz * distort;

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

        // Gradient based on vertical position, slowly cycling over time
        var gradientT = ((p.by + 1) / 2 + time * 0.03) % 1;
        var col = lerpColor(gradientT);

        // Sweeping shimmer hotspot
        var shimmerX = Math.cos(time * 1.2) * 0.6;
        var shimmerY = Math.sin(time * 0.9) * 0.5;
        var shimmerZ = Math.cos(time * 0.7) * 0.4;
        var shimmerDist = Math.sqrt(
          (p.bx - shimmerX) * (p.bx - shimmerX) +
          (p.by - shimmerY) * (p.by - shimmerY) +
          (p.bz - shimmerZ) * (p.bz - shimmerZ)
        );
        var shimmerBoost = Math.max(0, 1 - shimmerDist * 2.5) * 0.45;

        // Physics: initialize on first frame, then spring toward cursor or home
        if (!p.initialized) {
          p.px = screenX;
          p.py = screenY;
          p.initialized = true;
        }

        var cdx = mouseX - p.px;
        var cdy = mouseY - p.py;
        var cdistSq = cdx * cdx + cdy * cdy;

        if (mouseX > -999 && cdistSq < influenceRadiusSq) {
          var strength = 1 - Math.sqrt(cdistSq) / influenceRadius;
          var liveOx = Math.sin(time * 1.3 + p.phx) * p.amp;
          var liveOy = Math.cos(time * 1.0 + p.phy) * p.amp;
          p.vx += (mouseX + liveOx - p.px) * springChase * strength;
          p.vy += (mouseY + liveOy - p.py) * springChase * strength;
        } else {
          p.vx += (screenX - p.px) * springHome;
          p.vy += (screenY - p.py) * springHome;
        }

        p.vx *= damping;
        p.vy *= damping;
        p.px += p.vx;
        p.py += p.vy;

        var alpha, dotSize;
        if (p.type === 'grid') {
          alpha = (0.06 + depth * 0.22 + shimmerBoost * 0.5) * 0.25;
          dotSize = 0.8;
        } else {
          alpha = (0.12 + depth * 0.55 + shimmerBoost) * 0.3;
          dotSize = 0.8;
        }

        // Brighten color toward white near shimmer hotspot
        var sr = Math.min(255, col[0] + Math.round(shimmerBoost * 180));
        var sg = Math.min(255, col[1] + Math.round(shimmerBoost * 180));
        var sb = Math.min(255, col[2] + Math.round(shimmerBoost * 180));

        ctx.beginPath();
        ctx.arc(p.px, p.py, dotSize * scale, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(' + sr + ',' + sg + ',' + sb + ',' + alpha + ')';
        ctx.fill();

        if (p.type !== 'grid' && z2 > -0.2) {
          projected.push({ sx: p.px, sy: p.py, depth: depth, col: col });
        }

      }

      // Draw proximity-triggered connection lines
      var maxDist = baseRadius * 0.35;
      var maxDistSq = maxDist * maxDist;
      for (var i = 0; i < projected.length; i++) {
        for (var j = i + 1; j < projected.length; j++) {
          var dx = projected[i].sx - projected[j].sx;
          var dy = projected[i].sy - projected[j].sy;
          var distSq = dx * dx + dy * dy;
          if (distSq < maxDistSq) {
            var dist = Math.sqrt(distSq);
            var lineAlpha = (1 - dist / maxDist) * 0.08 * Math.min(projected[i].depth, projected[j].depth);
            var mc = projected[i].depth > projected[j].depth ? projected[i].col : projected[j].col;
            ctx.beginPath();
            ctx.moveTo(projected[i].sx, projected[i].sy);
            ctx.lineTo(projected[j].sx, projected[j].sy);
            ctx.strokeStyle = 'rgba(' + mc[0] + ',' + mc[1] + ',' + mc[2] + ',' + lineAlpha + ')';
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }

      requestAnimationFrame(animate);
    }

    animate();
  }

  // --- Flippable profile card (About) ---
  var aboutFlip = document.getElementById('about-flip');
  if (aboutFlip) {
    function toggleFlip() {
      var flipped = aboutFlip.classList.toggle('is-flipped');
      aboutFlip.setAttribute('aria-pressed', flipped ? 'true' : 'false');
    }
    aboutFlip.addEventListener('click', toggleFlip);
    aboutFlip.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ' || e.key === 'Spacebar') {
        e.preventDefault();
        toggleFlip();
      }
    });
  }

})();
