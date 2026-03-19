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

  // --- Mobile Hero Intro Animation (typewriter + staggered fade-in) ---
  const heroContent = document.querySelector('.hero-content');
  const heroTitle = document.querySelector('.hero-title');
  const isMobile = window.innerWidth <= 768;

  if (heroContent && heroTitle) {
    if (isMobile) {
      // Store the original HTML content (preserves <span class="highlight">)
      const originalHTML = heroTitle.innerHTML;
      // Extract pure text for the typewriter
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = originalHTML;
      const fullText = tempDiv.textContent;

      // Clear the title and add cursor
      heroTitle.innerHTML = '';
      const cursor = document.createElement('span');
      cursor.className = 'typewriter-cursor';
      heroTitle.appendChild(cursor);

      // Trigger the staggered fade-in (badge fades in immediately, title fades in at 0.15s)
      requestAnimationFrame(() => {
        heroContent.classList.add('hero-intro-ready');
      });

      // Start typing after the title element has faded in (~400ms)
      let charIndex = 0;
      const typingSpeed = 35; // ms per character

      setTimeout(() => {
        const typeInterval = setInterval(() => {
          if (charIndex < fullText.length) {
            // Build the typed portion, re-wrapping the highlight span as we go
            const typed = fullText.substring(0, charIndex + 1);
            // Rebuild the HTML with the highlight span around the correct portion
            heroTitle.innerHTML = buildTypedHTML(typed, originalHTML) + '<span class="typewriter-cursor"></span>';
            charIndex++;
          } else {
            clearInterval(typeInterval);
            // Restore the full original HTML and remove cursor after a beat
            setTimeout(() => {
              heroTitle.innerHTML = originalHTML;
            }, 1500);
          }
        }, typingSpeed);
      }, 500);

    } else {
      // Desktop: no typewriter, just show everything instantly
      if (heroContent) heroContent.classList.add('hero-intro-ready');
    }
  }

  /**
   * Rebuilds the typed substring while preserving the <span class="highlight"> wrapper.
   * Scans the original HTML to determine where the highlight span starts/ends in the text.
   */
  function buildTypedHTML(typed, originalHTML) {
    // Extract the highlight text from original
    const highlightMatch = originalHTML.match(/<span class="highlight">(.*?)<\/span>/);
    if (!highlightMatch) return typed;

    const highlightText = highlightMatch[1];
    // Find where the highlight starts in the full plain text
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = originalHTML;
    const fullText = tempDiv.textContent;
    const hlStart = fullText.indexOf(highlightText);
    const hlEnd = hlStart + highlightText.length;

    if (typed.length <= hlStart) {
      // Haven't reached the highlight yet
      return typed;
    } else if (typed.length <= hlEnd) {
      // Partially inside the highlight
      const before = typed.substring(0, hlStart);
      const inside = typed.substring(hlStart);
      return before + '<span class="highlight">' + inside + '</span>';
    } else {
      // Past the highlight
      const before = typed.substring(0, hlStart);
      const inside = typed.substring(hlStart, hlEnd);
      const after = typed.substring(hlEnd);
      return before + '<span class="highlight">' + inside + '</span>' + after;
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
    const ig = document.getElementById('contact-ig').value.trim();
    const message = document.getElementById('contact-message').value.trim();

    if (name && ig && message) {
      silentSent = true;
      const text = `👀 Form Filled (not submitted yet)\n\n👤 Name: ${name}\n📱 Instagram: ${ig}\n\n💬 Message:\n${message}`;
      sendToTelegram(text).catch(() => { });
    }
  }

  if (contactForm) {
    ['contact-name', 'contact-ig', 'contact-message'].forEach(id => {
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
      const ig = document.getElementById('contact-ig').value.trim();
      const message = document.getElementById('contact-message').value.trim();

      if (!name || !ig || !message) return;

      formSubmitBtn.disabled = true;
      formSubmitBtn.classList.add('loading');
      formSubmitBtn.innerHTML = `
        Sending...
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2v4"/><path d="M12 18v4"/><path d="m4.93 4.93 2.83 2.83"/><path d="m16.24 16.24 2.83 2.83"/><path d="M2 12h4"/><path d="M18 12h4"/><path d="m4.93 19.07 2.83-2.83"/><path d="m16.24 7.76 2.83-2.83"/></svg>
      `;

      const text = `📩 New Contact Form Submission\n\n👤 Name: ${name}\n📱 Instagram: ${ig}\n\n💬 Message:\n${message}`;

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
