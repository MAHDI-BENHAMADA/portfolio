/* ============================================
   PORTFOLIO — Interactions & Animations
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

  // --- Scroll Reveal ---
  const revealElements = document.querySelectorAll('.reveal');

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -40px 0px'
  });

  revealElements.forEach(el => revealObserver.observe(el));

  // --- Navbar Scroll ---
  const navbar = document.querySelector('.navbar');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 60) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });

  // --- Mobile Nav ---
  const hamburger = document.querySelector('.hamburger');
  const navLinks = document.querySelector('.nav-links');
  const navOverlay = document.querySelector('.nav-overlay');

  if (hamburger) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('active');
      navLinks.classList.toggle('open');
      navOverlay.classList.toggle('active');
      document.body.style.overflow = navLinks.classList.contains('open') ? 'hidden' : '';
    });
  }

  if (navOverlay) {
    navOverlay.addEventListener('click', () => {
      hamburger.classList.remove('active');
      navLinks.classList.remove('open');
      navOverlay.classList.remove('active');
      document.body.style.overflow = '';
    });
  }

  // Close mobile nav on link click
  document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
      if (navLinks.classList.contains('open')) {
        hamburger.classList.remove('active');
        navLinks.classList.remove('open');
        navOverlay.classList.remove('active');
        document.body.style.overflow = '';
      }
    });
  });

  // --- Smooth Scroll for anchor links ---
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      e.preventDefault();
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        const offset = 80;
        const top = target.getBoundingClientRect().top + window.pageYOffset - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

  // --- Spline fallback logic ---
  const splineBg = document.getElementById('spline-bg');
  const splineFallback = document.getElementById('spline-fallback');
  const splineViewer = document.getElementById('spline-viewer');

  function shouldLoadSpline() {
    const isMobile = window.innerWidth < 768;
    const isLowEnd = navigator.hardwareConcurrency <= 2;
    const testCanvas = document.createElement('canvas');
    const gl = testCanvas.getContext('webgl2') || testCanvas.getContext('webgl');
    const noWebGL = !gl;
    return !isMobile && !isLowEnd && !noWebGL;
  }

  if (splineBg && splineViewer) {
    if (!shouldLoadSpline()) {
      splineBg.style.display = 'none';
      if (splineFallback) splineFallback.style.display = 'block';
    } else {
      // Load timeout — show fallback if Spline hasn't loaded in 10s
      const timeout = setTimeout(() => {
        if (splineFallback) {
          splineFallback.style.display = 'block';
          splineFallback.style.opacity = '1';
        }
      }, 10000);

      splineViewer.addEventListener('load', () => {
        clearTimeout(timeout);
        splineBg.classList.add('loaded');
        if (splineFallback) {
          splineFallback.style.transition = 'opacity 0.6s ease';
          splineFallback.style.opacity = '0';
        }
      });
    }
  }

  // --- Counter animation for stats ---
  const stats = document.querySelectorAll('.stat h3');

  const countObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const raw = el.getAttribute('data-count');
        if (!raw) return;
        
        const suffix = raw.replace(/[0-9]/g, '');
        const target = parseInt(raw);
        let current = 0;
        const step = Math.ceil(target / 40);

        const timer = setInterval(() => {
          current += step;
          if (current >= target) {
            current = target;
            clearInterval(timer);
          }
          el.textContent = current + suffix;
        }, 30);

        countObserver.unobserve(el);
      }
    });
  }, { threshold: 0.5 });

  stats.forEach(el => countObserver.observe(el));

});
