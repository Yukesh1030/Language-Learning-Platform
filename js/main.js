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

  // Handle 404 links (links that shouldn't go anywhere valid)
  const deadLinks = document.querySelectorAll('a[href="#"], .footer-col ul li a:not([href$=".html"]), .social-links a');
  deadLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href');
      // If it's literally '#' or empty or a generic path, redirect to 404
      if (!href || href === '#' || (!href.includes('.html') && !href.startsWith('http'))) {
        e.preventDefault();
        window.location.href = '404.html';
      }
    });
  });
});
