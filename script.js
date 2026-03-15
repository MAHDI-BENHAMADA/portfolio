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
    const isLowEnd = navigator.hardwareConcurrency <= 2;
    const testCanvas = document.createElement('canvas');
    const gl = testCanvas.getContext('webgl2') || testCanvas.getContext('webgl');
    const noWebGL = !gl;
    return !isLowEnd && !noWebGL;
  }

  if (splineBg && splineViewer) {
    if (!shouldLoadSpline()) {
      splineBg.style.display = 'none';
      if (splineFallback) splineFallback.style.display = 'block';
    } else {
      // Load timeout — show fallback if Spline hasn't loaded in 5s
      const timeout = setTimeout(() => {
        if (splineFallback) {
          splineFallback.style.display = 'block';
          splineFallback.style.opacity = '1';
        }
      }, 5000);

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

  if (modalCloseBtn) {
    modalCloseBtn.addEventListener('click', closeModal);
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

  // --- Telegram Form Submission ---
  // ⚠️ REPLACE THESE WITH YOUR REAL VALUES:
  // 1. Create a bot: message @BotFather on Telegram → /newbot → copy the token
  // 2. Get your chat ID: message @userinfobot on Telegram → it replies with your ID
  const TELEGRAM_BOT_TOKEN = 'YOUR_BOT_TOKEN_HERE';
  const TELEGRAM_CHAT_ID = 'YOUR_CHAT_ID_HERE';

  if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      // Reset feedback
      formFeedback.textContent = '';
      formFeedback.className = 'form-feedback';

      const name = document.getElementById('contact-name').value.trim();
      const email = document.getElementById('contact-email').value.trim();
      const message = document.getElementById('contact-message').value.trim();

      if (!name || !email || !message) return;

      // Disable button & show loading
      formSubmitBtn.disabled = true;
      formSubmitBtn.classList.add('loading');
      const originalText = formSubmitBtn.innerHTML;
      formSubmitBtn.innerHTML = `
        Sending...
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2v4"/><path d="M12 18v4"/><path d="m4.93 4.93 2.83 2.83"/><path d="m16.24 16.24 2.83 2.83"/><path d="M2 12h4"/><path d="M18 12h4"/><path d="m4.93 19.07 2.83-2.83"/><path d="m16.24 7.76 2.83-2.83"/></svg>
      `;

      // Format message for Telegram
      const text = `📩 New Contact Form Submission\n\n👤 Name: ${name}\n📧 Email: ${email}\n\n💬 Message:\n${message}`;

      try {
        const res = await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            chat_id: TELEGRAM_CHAT_ID,
            text: text,
            parse_mode: 'HTML'
          })
        });

        const data = await res.json();

        if (data.ok) {
          formFeedback.textContent = '✅ Message sent! I\'ll get back to you within 24 hours.';
          formFeedback.className = 'form-feedback success';
          contactForm.reset();

          // Auto-close modal after 2.5s
          setTimeout(() => {
            closeModal();
            // Reset feedback after modal closes
            setTimeout(() => {
              formFeedback.textContent = '';
              formFeedback.className = 'form-feedback';
            }, 400);
          }, 2500);
        } else {
          throw new Error(data.description || 'Failed to send');
        }
      } catch (err) {
        formFeedback.textContent = '❌ Something went wrong. Please try again or email me directly.';
        formFeedback.className = 'form-feedback error';
        console.error('Telegram send error:', err);
      } finally {
        formSubmitBtn.disabled = false;
        formSubmitBtn.classList.remove('loading');
        formSubmitBtn.innerHTML = originalText;
      }
    });
  }

});
