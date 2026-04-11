/* ==========================================
   IRONFORGE - app.js
   Interactive features & animations
   ========================================== */

// ---- Navbar Scroll Effect ----
const nav = document.getElementById('mainNav');
window.addEventListener('scroll', () => {
  if (window.scrollY > 60) {
    nav.classList.add('scrolled');
  } else {
    nav.classList.remove('scrolled');
  }
});

// ---- Active Nav Link Highlight ----
const sections = document.querySelectorAll('section[id], footer[id]');
const navLinks = document.querySelectorAll('.navbar-nav .nav-link');

const observerOptions = {
  root: null,
  rootMargin: '-40% 0px -40% 0px',
  threshold: 0
};

const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      navLinks.forEach(link => {
        link.style.color = '';
        link.classList.remove('active-link');
        if (link.getAttribute('href') === '#' + entry.target.id) {
          link.classList.add('active-link');
          link.style.color = 'var(--fire) !important';
        }
      });
    }
  });
}, observerOptions);

sections.forEach(section => sectionObserver.observe(section));

// ---- Navbar collapse on mobile link click ----
document.querySelectorAll('.navbar-nav .nav-link').forEach(link => {
  link.addEventListener('click', () => {
    const collapse = document.querySelector('#navbarNav');
    if (collapse && collapse.classList.contains('show')) {
      const bsCollapse = bootstrap.Collapse.getOrCreateInstance(collapse);
      bsCollapse.hide();
    }
  });
});

// ---- Stats Counter Animation ----
function animateCounters() {
  const counters = document.querySelectorAll('.stat-num');
  counters.forEach(counter => {
    const target = parseInt(counter.dataset.target);
    const duration = 2000;
    const step = target / (duration / 16);
    let current = 0;

    const timer = setInterval(() => {
      current += step;
      if (current >= target) {
        counter.textContent = target.toLocaleString();
        clearInterval(timer);
      } else {
        counter.textContent = Math.floor(current).toLocaleString();
      }
    }, 16);
  });
}

// Trigger counter when stats bar is visible
const statsBar = document.querySelector('.stats-bar');
let statsAnimated = false;
const statsObserver = new IntersectionObserver((entries) => {
  if (entries[0].isIntersecting && !statsAnimated) {
    statsAnimated = true;
    animateCounters();
  }
}, { threshold: 0.5 });

if (statsBar) statsObserver.observe(statsBar);

// ---- Workout Plan Filters ----
const filterBtns = document.querySelectorAll('.filter-btn');
const workoutItems = document.querySelectorAll('.workout-item');

filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    const filter = btn.dataset.filter;
    workoutItems.forEach(item => {
      if (filter === 'all' || item.dataset.cat === filter) {
        item.classList.remove('hidden');
        item.style.animation = 'fadeInUp 0.4s ease both';
      } else {
        item.classList.add('hidden');
      }
    });
  });
});

// ---- Membership Billing Toggle ----
const billingToggle = document.getElementById('billingToggle');
const priceNums = document.querySelectorAll('.price-num');
const priceLabel = document.querySelector('.price-period');

billingToggle && billingToggle.addEventListener('change', () => {
  const isAnnual = billingToggle.checked;
  priceNums.forEach(num => {
    const monthly = parseInt(num.dataset.monthly);
    const annual = parseInt(num.dataset.annual);
    const target = isAnnual ? annual : monthly;
    animatePrice(num, parseInt(num.textContent.replace(/,/g, '')), target);
  });
});

function animatePrice(el, from, to) {
  const duration = 600;
  const step = (to - from) / (duration / 16);
  let current = from;
  const timer = setInterval(() => {
    current += step;
    const done = step > 0 ? current >= to : current <= to;
    if (done) {
      el.textContent = to.toLocaleString();
      clearInterval(timer);
    } else {
      el.textContent = Math.floor(current).toLocaleString();
    }
  }, 16);
}

// ---- Workout Modal Population ----
const workoutModal = document.getElementById('workoutModal');
workoutModal && workoutModal.addEventListener('show.bs.modal', (e) => {
  const btn = e.relatedTarget;
  document.getElementById('modalPlanName').textContent = btn.dataset.plan;
  document.getElementById('modalDuration').textContent = btn.dataset.duration;
  document.getElementById('modalLevel').textContent = btn.dataset.level;
  document.getElementById('modalKcal').textContent = btn.dataset.kcal + ' kcal';
  document.getElementById('modalDesc').textContent = btn.dataset.desc;
});

// ---- Contact Form Submission ----
const contactForm = document.getElementById('contactForm');
const formSuccess = document.getElementById('formSuccess');

contactForm && contactForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const btn = contactForm.querySelector('button[type="submit"]');
  btn.disabled = true;
  btn.innerHTML = '<i class="fas fa-spinner fa-spin me-2"></i> Sending...';

  setTimeout(() => {
    btn.innerHTML = '<i class="fas fa-check me-2"></i> Message Sent!';
    formSuccess.classList.remove('d-none');
    contactForm.reset();
    setTimeout(() => {
      btn.disabled = false;
      btn.innerHTML = 'Send Message <i class="fas fa-arrow-right ms-2"></i>';
      formSuccess.classList.add('d-none');
    }, 4000);
  }, 1800);
});

// ---- Newsletter Subscribe ----
window.handleNewsletter = function(btn) {
  const input = btn.previousElementSibling;
  const email = input.value.trim();
  if (!email || !email.includes('@')) {
    input.style.borderColor = 'var(--fire)';
    input.placeholder = 'Please enter a valid email';
    setTimeout(() => {
      input.style.borderColor = '';
      input.placeholder = 'Enter your email';
    }, 2000);
    return;
  }
  btn.textContent = '✓ Subscribed!';
  btn.style.background = '#16a34a';
  input.value = '';
  setTimeout(() => {
    btn.textContent = 'Subscribe';
    btn.style.background = '';
  }, 3000);
};

// ---- Back to Top ----
const backToTopBtn = document.getElementById('backToTop');
window.addEventListener('scroll', () => {
  if (window.scrollY > 400) {
    backToTopBtn.classList.add('visible');
  } else {
    backToTopBtn.classList.remove('visible');
  }
});

window.scrollToTop = function() {
  window.scrollTo({ top: 0, behavior: 'smooth' });
};

// ---- Scroll Reveal Animation ----
const revealElements = document.querySelectorAll(
  '.trainer-card, .workout-card, .pricing-card, .feature-chip, .contact-item'
);

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      entry.target.style.animation = `fadeInUp 0.5s ease ${i * 0.08}s both`;
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -60px 0px' });

revealElements.forEach(el => revealObserver.observe(el));

// Inject keyframes dynamically
const style = document.createElement('style');
style.textContent = `
  @keyframes fadeInUp {
    from { opacity: 0; transform: translateY(30px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  .navbar-nav .nav-link.active-link {
    color: var(--fire) !important;
  }
`;
document.head.appendChild(style);

// ---- Smooth scroll for all anchor links ----
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', (e) => {
    const target = document.querySelector(anchor.getAttribute('href'));
    if (target) {
      e.preventDefault();
      const offset = 70;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});

console.log('%c IRONFORGE ELITE FITNESS ', 'background:#FF4500;color:#fff;font-size:18px;font-weight:bold;padding:8px;border-radius:4px;');
console.log('%c Website loaded successfully ✓', 'color:#FF4500;font-size:12px;');
