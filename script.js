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
window.addEventListener('scroll', () => {
  if (window.scrollY > 40) {
    navbar.classList.add('bg-white/95', 'dark:bg-surface-dark/95', 'backdrop-blur-md', 'shadow-sm', 'border-b', 'border-gray-200', 'dark:border-gray-800');
  } else {
    navbar.classList.remove('bg-white/95', 'dark:bg-surface-dark/95', 'backdrop-blur-md', 'shadow-sm', 'border-b', 'border-gray-200', 'dark:border-gray-800');
  }
});

// ——— Sticky mobile CTA ———
const stickyCta = document.getElementById('sticky-cta');
window.addEventListener('scroll', () => {
  if (window.scrollY > 400) {
    stickyCta.classList.remove('translate-y-full');
  } else {
    stickyCta.classList.add('translate-y-full');
  }
});

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

// ——— Form submissions ———
function handleSignup(event, formId) {
  event.preventDefault();
  const form = document.getElementById(`${formId}-form`);
  const success = document.getElementById(`${formId}-success`);
  if (form && success) {
    form.style.display = 'none';
    success.classList.remove('hidden');
    success.classList.add('flex');
    // Increment waitlist count (demo)
    const countEl = document.getElementById('waitlist-hero-count');
    if (countEl) countEl.textContent = parseInt(countEl.textContent) + 1;
  }
}

function handleQuickSignup() {
  const email = document.getElementById('final-email');
  if (!email.value || !email.value.includes('@')) {
    email.focus();
    email.classList.add('ring-2', 'ring-white/80');
    setTimeout(() => email.classList.remove('ring-2', 'ring-white/80'), 1500);
    return;
  }
  email.parentElement.innerHTML = `
    <div class="flex-1 flex items-center gap-3 px-4 py-3">
      <span class="material-icons text-white">check_circle</span>
      <span class="text-white font-semibold text-sm">You're on the list! Check your email. 🎉</span>
    </div>
  `;
}

// ——— Waitlist count live increment (demo) ———
setInterval(() => {
  const el = document.getElementById('waitlist-hero-count');
  if (el && Math.random() > 0.7) {
    el.textContent = parseInt(el.textContent) + 1;
  }
}, 8000);
