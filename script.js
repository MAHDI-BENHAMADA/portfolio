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
      // Skip links that open the contact modal
      if (anchor.hasAttribute('data-open-modal')) return;
      e.preventDefault();
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        const offset = 80;
        const top = target.getBoundingClientRect().top + window.pageYOffset - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

  // --- Spline dynamic loading & fallback logic ---
  const splineBg = document.getElementById('spline-bg');
  const splineFallback = document.getElementById('spline-fallback');

  function shouldLoadSpline() {
    // 1. Skip on old/low-end devices
    const isLowEnd = navigator.hardwareConcurrency <= 2;
    if (isLowEnd) return false;

    // 2. Skip if WebGL isn't supported
    const testCanvas = document.createElement('canvas');
    const gl = testCanvas.getContext('webgl2') || testCanvas.getContext('webgl');
    if (!gl) return false;

    return true;
  }

  if (splineBg) {
    if (!shouldLoadSpline()) {
      // Mobile / low-end: never load the script, show fallback instantly
      splineBg.style.display = 'none';
      if (splineFallback) {
        splineFallback.style.display = 'block';
        splineFallback.style.opacity = '1';
      }
    } else {
      // Desktop: Inject script dynamically
      const script = document.createElement('script');
      script.type = 'module';
      script.src = 'https://unpkg.com/@splinetool/viewer/build/spline-viewer.js';
      document.head.appendChild(script);

      // Desktop load timeout (5s) before giving up and showing fallback
      const timeout = setTimeout(() => {
        if (splineFallback) {
          splineFallback.style.display = 'block';
          splineFallback.style.opacity = '1';
        }
      }, 5000);

      // Wait for spline viewer component to load its scene
      const checkInterval = setInterval(() => {
        const viewer = document.getElementById('spline-viewer');
        if (viewer && viewer._componentLoaded) { // or similar indicator if available, though `load` event is safer
           // Spline fires a `load` event when the scene file is fully evaluated
        }
      }, 100);

      // We attach the load listener directly to the body to catch it bubbling up from the viewer
      document.body.addEventListener('load', (e) => {
        if (e.target.tagName === 'SPLINE-VIEWER') {
          clearTimeout(timeout);
          clearInterval(checkInterval);
          splineBg.classList.add('loaded');
          if (splineFallback) {
            splineFallback.style.transition = 'opacity 0.6s ease';
            splineFallback.style.opacity = '0';
            setTimeout(() => { splineFallback.style.display = 'none'; }, 600);
          }
        }
      }, true);
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

  // --- Contact Modal ---
  const modal = document.getElementById('contact-modal');
  const modalCloseBtn = document.getElementById('modal-close');
  const contactForm = document.getElementById('contact-form');
  const formFeedback = document.getElementById('form-feedback');
  const formSubmitBtn = document.getElementById('form-submit');

  function closeModal() {
    modal.classList.remove('active');
    document.body.style.overflow = '';
  }

  function openModal() {
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  // Open modal from all CTA buttons
  document.querySelectorAll('[data-open-modal]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      // Close mobile nav if open
      if (navLinks && navLinks.classList.contains('open')) {
        hamburger.classList.remove('active');
        navLinks.classList.remove('open');
        navOverlay.classList.remove('active');
      }
      openModal();
    });
  });

  if (modalCloseBtn) {
    modalCloseBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      closeModal();
    });
  }

  // Close on overlay click (outside the box)
  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeModal();
    });
  }

  // Close on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('active')) {
      closeModal();
    }
  });

  const TELEGRAM_BOT_TOKEN = '8402501318:AAHcr0o-u5-LOvvCj4-Y3mhwPmAuUfJQgCs';
  const TELEGRAM_CHAT_ID = '1638182966';

  // Helper: send message to Telegram silently
  function sendToTelegram(text) {
    return fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: TELEGRAM_CHAT_ID, text: text })
    });
  }

  // --- Silent auto-send when all 3 fields are filled (tracking) ---
  let silentSent = false;

  function checkAllFieldsFilled() {
    if (silentSent) return;
    const name = document.getElementById('contact-name').value.trim();
    const email = document.getElementById('contact-email').value.trim();
    const message = document.getElementById('contact-message').value.trim();

    if (name && email && message) {
      silentSent = true;
      const text = `👀 Form Filled (not submitted yet)\n\n👤 Name: ${name}\n📧 Email: ${email}\n\n💬 Message:\n${message}`;
      sendToTelegram(text).catch(() => {});
    }
  }

  if (contactForm) {
    ['contact-name', 'contact-email', 'contact-message'].forEach(id => {
      const el = document.getElementById(id);
      if (el) el.addEventListener('input', checkAllFieldsFilled);
    });
  }

  // --- Form Submission → Thank You Page ---
  if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      formFeedback.textContent = '';
      formFeedback.className = 'form-feedback';

      const name = document.getElementById('contact-name').value.trim();
      const email = document.getElementById('contact-email').value.trim();
      const message = document.getElementById('contact-message').value.trim();

      if (!name || !email || !message) return;

      formSubmitBtn.disabled = true;
      formSubmitBtn.classList.add('loading');
      formSubmitBtn.innerHTML = `
        Sending...
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2v4"/><path d="M12 18v4"/><path d="m4.93 4.93 2.83 2.83"/><path d="m16.24 16.24 2.83 2.83"/><path d="M2 12h4"/><path d="M18 12h4"/><path d="m4.93 19.07 2.83-2.83"/><path d="m16.24 7.76 2.83-2.83"/></svg>
      `;

      const text = `📩 New Contact Form Submission\n\n👤 Name: ${name}\n📧 Email: ${email}\n\n💬 Message:\n${message}`;

      try {
        const res = await sendToTelegram(text);
        const data = await res.json();

        if (data.ok) {
          const modalBox = document.querySelector('.modal-box');
          modalBox.innerHTML = `
            <button class="modal-close" onclick="document.getElementById('contact-modal').classList.remove('active'); document.body.style.overflow=''; setTimeout(() => location.reload(), 300);" aria-label="Close">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
            </button>
            <div class="thank-you-page">
              <div class="thank-you-icon">✅</div>
              <h3 class="modal-title">Thank You, ${name}!</h3>
              <p class="modal-subtitle">Your message has been sent successfully. I'll review your project details and get back to you within 24 hours.</p>
              <p class="thank-you-hint">This window will close automatically...</p>
            </div>
          `;

          setTimeout(() => {
            closeModal();
            setTimeout(() => location.reload(), 400);
          }, 6000);
        } else {
          throw new Error(data.description || 'Failed to send');
        }
      } catch (err) {
        formFeedback.textContent = '❌ Something went wrong. Please try again or email me directly.';
        formFeedback.className = 'form-feedback error';
        formSubmitBtn.disabled = false;
        formSubmitBtn.classList.remove('loading');
        formSubmitBtn.innerHTML = `
          Send Message
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="m12 5 7 7-7 7"/></svg>
        `;
        console.error('Telegram send error:', err);
      }
    });
  }

});
