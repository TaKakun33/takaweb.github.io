const navbar = document.getElementById('navbar');

function handleNavbarScroll() {
  navbar.classList.toggle('scrolled', window.scrollY > 40);
}

window.addEventListener('scroll', handleNavbarScroll, { passive: true });
handleNavbarScroll();

const hamburger = document.getElementById('hamburger');
const navLinks  = document.getElementById('nav-links');

hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('open');
  navLinks.classList.toggle('open');
  hamburger.setAttribute('aria-expanded', navLinks.classList.contains('open'));
});

navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('open');
    navLinks.classList.remove('open');
  });
});

const sections   = document.querySelectorAll('section[id]');
const navAnchors = document.querySelectorAll('.nav-link');

function highlightNavOnScroll() {
  let currentId = '';
  sections.forEach(section => {
    if (window.scrollY >= section.offsetTop - 90) currentId = section.id;
  });

  navAnchors.forEach(a => {
    a.style.color = a.getAttribute('href') === `#${currentId}`
      ? '#58a6ff'
      : 'rgba(255,255,255,0.72)';
  });
}

window.addEventListener('scroll', highlightNavOnScroll, { passive: true });

const revealTargets = document.querySelectorAll(
  '.project-card, .skill-card, .stat-item, .section-header, .contact-info, .contact-form-wrap'
);

revealTargets.forEach(el => el.classList.add('reveal'));

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12 }
);

revealTargets.forEach(el => observer.observe(el));

const sendBtn   = document.getElementById('send-btn');
const toast     = document.getElementById('form-toast');
const nameIn    = document.getElementById('name');
const emailIn   = document.getElementById('email');
const messageIn = document.getElementById('message');

const FORMSPREE_ID = 'xojoeall';

sendBtn.addEventListener('click', async () => {
  const name    = nameIn.value.trim();
  const email   = emailIn.value.trim();
  const message = messageIn.value.trim();

  if (!name || !email || !message) {
    showToast('Please fill in all fields.', 'error');
    return;
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    showToast('Please enter a valid email address.', 'error');
    return;
  }

  sendBtn.disabled = true;
  sendBtn.innerHTML = '<i class="ph ph-circle-notch ph-spin"></i> Sending...';

  try {
    const res = await fetch(`https://formspree.io/f/${FORMSPREE_ID}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify({ name, email, message })
    });

    if (res.ok) {
      nameIn.value    = '';
      emailIn.value   = '';
      messageIn.value = '';
      showToast('Message sent! I\'ll reply within 24 hours ✓', 'success');
    } else {
      const data = await res.json();
      const errMsg = data?.errors?.[0]?.message || 'Something went wrong.';
      showToast(errMsg, 'error');
    }
  } catch {
    showToast('Network error. Please try again.', 'error');
  } finally {
    sendBtn.disabled = false;
    sendBtn.innerHTML = '<i class="ph ph-paper-plane-tilt"></i> Send Message';
  }
});

function showToast(msg, type) {
  toast.textContent = msg;
  toast.className   = `form-toast ${type}`;
  setTimeout(() => { toast.textContent = ''; toast.className = 'form-toast'; }, 5000);
}