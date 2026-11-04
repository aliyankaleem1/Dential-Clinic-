// ===== Scroll Reveal Animation =====
const animateEls = document.querySelectorAll('[data-animate]');
const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
}, { threshold: 0.15 });
animateEls.forEach(el => observer.observe(el));

// ===== Navbar scroll effect =====
window.addEventListener('scroll', () => {
  const navbar = document.getElementById('navbar');
  if (window.scrollY > 60) {
    navbar.style.boxShadow = '0 4px 30px rgba(0,0,0,0.13)';
  } else {
    navbar.style.boxShadow = '0 2px 20px rgba(0,0,0,0.08)';
  }
});

// ===== Hamburger menu (mobile) =====
const hamburger = document.getElementById('hamburger');
const navLinks  = document.querySelector('.nav-links');
hamburger.addEventListener('click', () => {
  navLinks.style.display = navLinks.style.display === 'flex' ? 'none' : 'flex';
  navLinks.style.flexDirection = 'column';
  navLinks.style.position = 'absolute';
  navLinks.style.top = '70px';
  navLinks.style.left = '0';
  navLinks.style.right = '0';
  navLinks.style.background = '#fff';
  navLinks.style.padding = '1rem 2rem';
  navLinks.style.boxShadow = '0 10px 30px rgba(0,0,0,0.1)';
  navLinks.style.zIndex = '999';
});

// ===== Contact Form Submit =====
const form = document.querySelector('.contact-form');
if (form) {
  form.addEventListener('submit', e => {
    e.preventDefault();
    const btn = form.querySelector('button[type="submit"]');
    btn.innerHTML = '<i class="fa fa-check"></i> Appointment Booked!';
    btn.style.background = 'linear-gradient(135deg, #38a169, #48bb78)';
    setTimeout(() => {
      btn.innerHTML = '<i class="fa fa-calendar-check"></i> Book Appointment';
      btn.style.background = '';
      form.reset();
    }, 3000);
  });
}

// ===== Auto add data-animate to all sections =====
document.querySelectorAll('.service-card, .doctor-card, .testimonial-card, .gallery-item, .why-item, .about-img-wrap, .about-text, .why-text, .why-img-wrap').forEach((el, i) => {
  el.setAttribute('data-animate', '');
  el.style.transitionDelay = (i * 0.07) + 's';
  observer.observe(el);
});

