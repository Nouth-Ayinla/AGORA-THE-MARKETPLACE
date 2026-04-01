// ——— Dark mode ———
function toggleDark() {
  document.documentElement.classList.toggle('dark');
  localStorage.setItem('theme', document.documentElement.classList.contains('dark') ? 'dark' : 'light');
}
if (localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
  document.documentElement.classList.add('dark');
}

// ——— Navbar scroll effect ———
const navbar = document.getElementById('navbar');
if (navbar) {
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      navbar.classList.add('bg-white/95', 'dark:bg-surface-dark/95', 'backdrop-blur-md', 'shadow-sm', 'border-b', 'border-gray-200', 'dark:border-gray-800');
    } else {
      navbar.classList.remove('bg-white/95', 'dark:bg-surface-dark/95', 'backdrop-blur-md', 'shadow-sm', 'border-b', 'border-gray-200', 'dark:border-gray-800');
    }
  });
}

// ——— Reveal on scroll ———
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.15 });
document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

// ——— Carousel ———
const carouselTrack = document.querySelector('.carousel-track');
const carouselSlides = document.querySelectorAll('.carousel-slide');
const carouselDots = document.querySelectorAll('.carousel-dot');
let slideIndex = 0;

function updateCarousel() {
  if (!carouselTrack || carouselSlides.length === 0) return;
  
  carouselTrack.style.transform = `translateX(-${slideIndex * 100}%)`;
  carouselDots.forEach((dot, i) => {
    dot.classList.toggle('active', i === slideIndex);
    dot.classList.toggle('bg-primary', i === slideIndex);
    dot.classList.toggle('bg-gray-300', i !== slideIndex);
    dot.classList.toggle('dark:bg-gray-600', i !== slideIndex);
  });
}

function nextSlide() {
  slideIndex = (slideIndex + 1) % carouselSlides.length;
  updateCarousel();
}

// Carousel auto-play (every 5 seconds)
if (carouselSlides.length > 0) {
  setInterval(nextSlide, 5000);
  
  // Click handlers for dots
  carouselDots.forEach(dot => {
    dot.addEventListener('click', (e) => {
      slideIndex = parseInt(e.target.dataset.slide);
      updateCarousel();
    });
  });
}

// ——— Counter animation ———
function animateCounter(el, target, duration = 2000) {
  let start = 0;
  const step = target / (duration / 16);
  const timer = setInterval(() => {
    start += step;
    if (start >= target) {
      el.textContent = target.toLocaleString();
      clearInterval(timer);
    } else {
      el.textContent = Math.floor(start).toLocaleString();
    }
  }, 16);
}
const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const el = entry.target;
      animateCounter(el, parseInt(el.dataset.target));
      counterObserver.unobserve(el);
    }
  });
}, { threshold: 0.5 });
document.querySelectorAll('.counter').forEach(el => counterObserver.observe(el));

// ——— FAQ accordion ———
function toggleFaq(btn) {
  const answer = btn.nextElementSibling;
  const chevron = btn.querySelector('.faq-chevron');
  const isOpen = answer.classList.contains('open');

  // Close all
  document.querySelectorAll('.faq-answer').forEach(a => a.classList.remove('open'));
  document.querySelectorAll('.faq-chevron').forEach(c => c.classList.remove('open'));

  if (!isOpen) {
    answer.classList.add('open');
    chevron.classList.add('open');
  }
}

// ——— Waitlist API ———
// ↓ Paste your deployed Google Apps Script Web App URL here
const APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbzYvOSYS90yMhrjwWDVi1UUgseOfKZXKd8B5xDfSRRVtkVTK0qlSGisRcg3_216kQRsbA/exec';

async function submitToWaitlist(data) {
  await fetch(APPS_SCRIPT_URL, {
    method: 'POST',
    mode: 'no-cors',          // avoids CORS preflight — response is opaque but request goes through
    headers: { 'Content-Type': 'text/plain' },
    body: JSON.stringify(data),
  });
  // With no-cors the response is opaque; we treat a resolved promise as success.
}

// ——— Form submissions ———
async function handleSignup(event, formId) {
  event.preventDefault();

  const form    = document.getElementById(`${formId}-form`);
  const success = document.getElementById(`${formId}-success`);
  const btn     = form ? form.querySelector('button[type="submit"]') : null;

  if (!form || !success) return;

  // Collect fields that exist in this particular form
  const data = { source: formId === 'hero' ? 'hero-form' : 'full-form' };

  const nameEl  = document.getElementById(`${formId}-name`);
  const emailEl = document.getElementById(`${formId}-email`);
  const phoneEl = document.getElementById(`${formId}-phone`);
  const uniEl   = document.getElementById(`${formId}-university`);
  const roleEl  = form.querySelector('input[name="role"]:checked');

  if (nameEl)  data.name        = nameEl.value.trim();
  if (emailEl) data.email       = emailEl.value.trim();
  if (phoneEl) data.phone       = phoneEl.value.trim();
  if (uniEl)   data.university  = uniEl.value;
  if (roleEl)  data.role        = roleEl.value;

  // Show loading state
  if (btn) {
    btn.disabled = true;
    btn.innerHTML = '<span class="material-icons animate-spin text-base">autorenew</span> Saving your spot…';
  }

  try {
    await submitToWaitlist(data);
  } catch (err) {
    console.warn('Waitlist submission error:', err);
    // Still show success — data may have been received despite network hiccup
  }

  // Show success state
  form.style.display = 'none';
  success.classList.remove('hidden');
  success.classList.add('flex');

  // Increment live counter
  const countEl = document.getElementById('waitlist-hero-count');
  if (countEl) countEl.textContent = parseInt(countEl.textContent) + 1;
}

async function handleQuickSignup() {
  const emailEl = document.getElementById('final-email');
  const nameEl  = document.getElementById('final-name');

  if (!emailEl.value || !emailEl.value.includes('@')) {
    emailEl.focus();
    emailEl.classList.add('ring-2', 'ring-white/80');
    setTimeout(() => emailEl.classList.remove('ring-2', 'ring-white/80'), 1500);
    return;
  }

  const data = {
    email:  emailEl.value.trim(),
    name:   nameEl ? nameEl.value.trim() : '',
    source: 'final-cta',
  };

  // Replace the input row with a spinner immediately for quick feedback
  const wrapper = emailEl.closest('.bg-white\\/15') || emailEl.parentElement;
  const originalHTML = wrapper.innerHTML;
  wrapper.innerHTML = `
    <div class="flex-1 flex items-center gap-3 px-4 py-3.5">
      <span class="material-icons text-white animate-spin">autorenew</span>
      <span class="text-white font-semibold text-sm">Securing your spot…</span>
    </div>`;

  try {
    await submitToWaitlist(data);
  } catch (err) {
    console.warn('Waitlist submission error:', err);
  }

  wrapper.innerHTML = `
    <div class="flex-1 flex items-center gap-3 px-4 py-3.5">
      <span class="material-icons text-white">check_circle</span>
      <span class="text-white font-semibold text-sm">You're on the list! Check your email. 🎉</span>
    </div>`;

  const countEl = document.getElementById('waitlist-hero-count');
  if (countEl) countEl.textContent = parseInt(countEl.textContent) + 1;
}

// ——— Waitlist count live increment (demo) ———
setInterval(() => {
  const el = document.getElementById('waitlist-hero-count');
  if (el && Math.random() > 0.7) {
    el.textContent = parseInt(el.textContent) + 1;
  }
}, 8000);
