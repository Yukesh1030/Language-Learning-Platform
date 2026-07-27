// Mobile Menu Toggle
document.addEventListener('DOMContentLoaded', () => {
  const hamburger = document.querySelector('.hamburger');
  const navLinks = document.querySelector('.nav-links');

  if (hamburger) {
    hamburger.addEventListener('click', () => {
      navLinks.classList.toggle('active');
    });
  }

  // Initialize AOS
  if (typeof AOS !== 'undefined') {
    AOS.init({
      duration: 800,
      once: false,
      offset: 100
    });
  }

  // GSAP Loader Transition
  if (typeof gsap !== 'undefined') {
    const loader = document.querySelector('.loader');
    if (loader) {
      window.addEventListener('load', () => {
        gsap.to(loader, {
          y: '-100%',
          duration: 0.8,
          ease: 'power3.inOut',
          onComplete: () => {
            loader.style.display = 'none';
          }
        });
      });
    }
  }

  // Universal 404 Redirection for Project Links (Except Navbar, Footer, Login, Signup, Dashboards, and 404 Page itself)
  if (!window.location.pathname.includes('404') && !document.querySelector('.error-page')) {
    const allLinksAndButtons = document.querySelectorAll('a, button');
    allLinksAndButtons.forEach(el => {
      // Exclude links inside navbar, footer, or navigation headers
      if (el.closest('nav') || el.closest('header') || el.closest('footer') || el.closest('.nav-links') || el.closest('.navbar') || el.closest('#sidebar')) {
        return;
      }
      // Exclude hamburger menu toggle buttons
      if (el.classList.contains('hamburger') || el.closest('.hamburger') || el.id === 'open-sidebar' || el.id === 'close-sidebar') {
        return;
      }
      // Exclude form submit buttons or buttons inside forms (handled by form validation below)
      if (el.getAttribute('type') === 'submit' || el.closest('form')) {
        return;
      }

      el.addEventListener('click', (e) => {
        const href = el.getAttribute('href');
        // If it is inside nav/footer it was already excluded above. For any other link/button on page:
        e.preventDefault();
        window.location.href = '404.html';
      });
    });
  }

  // Input Field Validation & 404 Redirection for public pages
  const allForms = document.querySelectorAll('form');
  allForms.forEach(form => {
    // Skip login and signup forms if ever present
    if (form.id === 'loginForm' || form.id === 'signupForm') {
      return;
    }
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      e.stopPropagation();
      let isValid = true;
      const inputs = form.querySelectorAll('input, textarea, select');
      
      inputs.forEach(input => {
        if (input.type === 'checkbox' || input.type === 'radio' || input.type === 'hidden') {
          return;
        }
        const val = input.value.trim();
        if (!val && (input.hasAttribute('required') || input.type === 'text' || input.tagName === 'TEXTAREA')) {
          isValid = false;
          input.style.borderColor = '#ff4d4d';
        } else if (input.type === 'email' || (input.placeholder && input.placeholder.toLowerCase().includes('email')) || (input.id && input.id.toLowerCase().includes('email'))) {
          if (!val || !/^\S+@\S+\.\S+$/.test(val)) {
            isValid = false;
            input.style.borderColor = '#ff4d4d';
          } else {
            input.style.borderColor = '#22c55e';
          }
        } else {
          input.style.borderColor = '#22c55e';
        }
      });

      if (!isValid) {
        alert('Please fill out all required fields with valid information.');
      } else {
        alert('Submitted successfully! Redirecting...');
        window.location.href = '404.html';
      }
    });
  });
});
