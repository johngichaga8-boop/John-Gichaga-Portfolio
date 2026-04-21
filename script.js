/* ============================================================
   John Gichaga Portfolio — script.js
   Handles: nav scroll, mobile menu, reveal animations,
            skill bars, active nav highlight, contact form
============================================================ */


// ── 1. NAV: Add "scrolled" class after user scrolls ──────────
const nav = document.getElementById('nav');

window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 40);
}, { passive: true });


// ── 2. MOBILE MENU toggle ────────────────────────────────────
const navToggle = document.getElementById('navToggle');
const navLinks  = document.getElementById('navLinks');

navToggle.addEventListener('click', () => {
  navLinks.classList.toggle('open');
  // Animate hamburger → X
  const spans  = navToggle.querySelectorAll('span');
  const isOpen = navLinks.classList.contains('open');
  spans[0].style.transform = isOpen ? 'translateY(7px) rotate(45deg)' : '';
  spans[1].style.opacity   = isOpen ? '0' : '';
  spans[2].style.transform = isOpen ? 'translateY(-7px) rotate(-45deg)' : '';
});

// Close mobile menu when a link is tapped
navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
    const spans = navToggle.querySelectorAll('span');
    spans[0].style.transform = '';
    spans[1].style.opacity   = '';
    spans[2].style.transform = '';
  });
});


// ── 3. SCROLL REVEAL (IntersectionObserver) ──────────────────
const revealEls = document.querySelectorAll('.reveal');

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const delay = entry.target.dataset.delay || 0;
      setTimeout(() => {
        entry.target.classList.add('visible');
      }, delay);
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

// Stagger children inside grid sections
document.querySelectorAll(
  '.skills__grid, .services__grid, .projects__grid, .about__highlights'
).forEach(grid => {
  grid.querySelectorAll('.reveal').forEach((child, i) => {
    child.dataset.delay = i * 80;
  });
});

revealEls.forEach(el => revealObserver.observe(el));


// ── 4. SKILL BAR ANIMATION ───────────────────────────────────
// Bars animate to their --pct value when the skills section enters view
const skillSection  = document.getElementById('skills');
let   skillsAnimated = false;

const skillBarObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting && !skillsAnimated) {
      skillsAnimated = true;
      document.querySelectorAll('.skill-card__fill').forEach((bar, i) => {
        const pct = getComputedStyle(bar).getPropertyValue('--pct').trim();
        bar.style.width = '0%';
        setTimeout(() => {
          bar.style.transition = 'width 1.2s cubic-bezier(0.22, 1, 0.36, 1)';
          bar.style.width = pct;
        }, 200 + i * 80);
      });
    }
  });
}, { threshold: 0.2 });

if (skillSection) skillBarObserver.observe(skillSection);


// ── 5. CONTACT FORM — real Formspree submission ───────────────
const contactForm = document.getElementById('contactForm');
const formSuccess = document.getElementById('formSuccess');
const formError   = document.getElementById('formError');
const submitBtn   = document.getElementById('submitBtn');

if (contactForm) {
  contactForm.addEventListener('submit', async function (e) {
    e.preventDefault(); // prevent default browser redirect

    // Show loading state
    submitBtn.textContent = 'Sending…';
    submitBtn.disabled    = true;
    formError.style.display = 'none';

    try {
      const formData = new FormData(contactForm);

      const response = await fetch(contactForm.action, {
        method:  'POST',
        body:    formData,
        headers: { 'Accept': 'application/json' }
      });

      if (response.ok) {
        // ✅ Success — hide form, show thank-you message
        contactForm.style.display   = 'none';
        formSuccess.style.display   = 'block';
        formSuccess.classList.add('visible');
        formError.style.display     = 'none';
      } else {
        // Server-side error from Formspree
        const data = await response.json().catch(() => ({}));
        console.error('Formspree error:', data);
        throw new Error('Server responded with an error');
      }

    } catch (err) {
      // ❌ Network failure or server error — show fallback
      console.error('Submission failed:', err);
      formError.style.display = 'block';
      submitBtn.textContent   = 'Send Message';
      submitBtn.disabled      = false;
    }
  });
}


// ── 6. ACTIVE NAV LINK highlight on scroll ───────────────────
const sections    = document.querySelectorAll('section[id]');
const navLinkEls  = document.querySelectorAll('.nav__links a');

const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const id = entry.target.getAttribute('id');
      navLinkEls.forEach(a => {
        a.style.color = a.getAttribute('href') === `#${id}`
          ? 'var(--accent)'
          : '';
      });
    }
  });
}, { threshold: 0.4 });

sections.forEach(s => sectionObserver.observe(s));


// ── 7. SMOOTH SCROLL for older browsers ──────────────────────
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});
