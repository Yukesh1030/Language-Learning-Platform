// Dynamic User Profile Management for Client and Admin Dashboards
document.addEventListener("DOMContentLoaded", () => {
  // 0. Inject Global Mobile Responsiveness Styles for all Dashboard Pages
  if (!document.getElementById("mobile-responsive-dashboard-styles")) {
    const styleEl = document.createElement("style");
    styleEl.id = "mobile-responsive-dashboard-styles";
    styleEl.innerHTML = `
      @media (max-width: 768px) {
        body, html, main {
          overflow-x: hidden !important;
          max-width: 100vw !important;
        }
        /* Make flex headers, search bars, banners, and card controls wrap neatly on mobile */
        main .flex.items-center.justify-between, 
        main .flex.justify-between,
        main .flex.gap-6 {
          flex-wrap: wrap !important;
          max-width: 100% !important;
        }
        /* CRITICAL: Ensure sidebar menus NEVER wrap icon and text onto separate lines */
        aside a, #sidebar a, aside nav a, #sidebar nav a, aside .flex, #sidebar .flex {
          flex-wrap: nowrap !important;
          white-space: nowrap !important;
          padding-left: 1.25rem !important;
          padding-right: 1.25rem !important;
          gap: 0.75rem !important;
          font-size: 0.92rem !important;
        }
        /* Ensure input fields, search boxes, and dropdowns scale to screen width without cutting off */
        input[type='text'], input[type='search'], input[type='email'], select, textarea {
          max-width: 100% !important;
        }
        /* Fix banner generators (e.g., 10-Week Syllabus Auto-Generator, Instant Quiz Generator) */
        .bg-gradient-to-r input, .bg-gradient-to-br input,
        .bg-gradient-to-r select, .bg-gradient-to-br select,
        .bg-gradient-to-r button, .bg-gradient-to-br button,
        .bg-gradient-to-r a, .bg-gradient-to-br a,
        .bg-gradient-to-r .relative, .bg-gradient-to-br .relative {
          width: 100% !important;
          max-width: 100% !important;
          margin-top: 6px !important;
          justify-content: center !important;
          text-align: center !important;
        }
        /* Ensure buttons inside flex rows don't get squished */
        main button, main .btn {
          white-space: normal !important;
          word-break: break-word !important;
        }
        /* Make tables horizontally scrollable without breaking page layout */
        table, .overflow-x-auto {
          display: block !important;
          width: 100% !important;
          overflow-x: auto !important;
          -webkit-overflow-scrolling: touch !important;
        }
        /* Adjust headings and badges so long titles don't push badges off-screen */
        h1 { font-size: 1.45rem !important; line-height: 1.3 !important; }
        h2 { font-size: 1.3rem !important; line-height: 1.3 !important; }
        h3 { font-size: 1.15rem !important; line-height: 1.3 !important; }
        .rounded-full, .rounded-lg, .rounded-xl {
          max-width: 100% !important;
          word-break: break-word !important;
          text-align: center !important;
        }
      }
    `;
    document.head.appendChild(styleEl);
  }

  const isAdminPage = window.location.pathname.toLowerCase().includes("admin") || 
                      document.title.toLowerCase().includes("admin") ||
                      localStorage.getItem("userRole") === "Admin";

  // Get name and email from localStorage or fallback to defaults
  let userName = localStorage.getItem("userName");
  let userEmail = localStorage.getItem("userEmail");

  if (!userName || !userEmail) {
    if (isAdminPage) {
      userName = userName || "System Admin";
      userEmail = userEmail || "admin@stackly.com";
    } else {
      userName = userName || "Client User";
      userEmail = userEmail || "client@example.com";
    }
    localStorage.setItem("userName", userName);
    localStorage.setItem("userEmail", userEmail);
  }

  // Calculate Initials (max 2 chars)
  const words = userName.trim().split(/\s+/);
  let initials = "";
  if (words.length >= 2) {
    initials = (words[0].charAt(0) + words[1].charAt(0)).toUpperCase();
  } else if (words.length === 1 && words[0].length >= 2) {
    initials = words[0].substring(0, 2).toUpperCase();
  } else {
    initials = userName.charAt(0).toUpperCase();
  }

  // 1. Update Sidebar Profile Section
  const profileDiv = document.querySelector("aside .px-6.py-4 .flex.items-center.gap-3");
  if (profileDiv) {
    const avatarBox = profileDiv.querySelector(".w-12.h-12");
    if (avatarBox) avatarBox.textContent = initials;

    const nameHeading = profileDiv.querySelector("h3");
    if (nameHeading) nameHeading.textContent = userName;

    const emailPara = profileDiv.querySelector("p");
    if (emailPara) emailPara.textContent = userEmail;
  }

  // 2. Update any other text references across the dashboard (leaderboards, headers, etc.)
  const defaultNames = ["Client User", "System Admin"];
  const defaultEmails = ["client@example.com", "admin@stackly.com"];

  document.querySelectorAll("h1, h2, h3, h4, h5, h6, span, p, div, a").forEach(el => {
    if (el.children.length === 0) { // Only target leaf text elements
      const txt = el.textContent.trim();
      if (defaultNames.includes(txt) && el !== profileDiv?.querySelector("h3")) {
        el.textContent = userName;
      } else if (defaultEmails.includes(txt) && el !== profileDiv?.querySelector("p")) {
        el.textContent = userEmail;
      }
    }
  });

  // 3. Update input fields on profile settings pages
  document.querySelectorAll("input[type='text'], input[type='email']").forEach(input => {
    if (defaultNames.includes(input.value.trim())) {
      input.value = userName;
    } else if (defaultEmails.includes(input.value.trim())) {
      input.value = userEmail;
    }
  });

  // 4. Universal 404 Redirection for all Dashboard Links and Buttons (Except Sidebar Menus)
  document.querySelectorAll('a, button').forEach(el => {
    // Exclude sidebar navigation and sidebar toggle controls in both dashboards
    if (el.closest('#sidebar') || el.closest('aside') || el.id === 'open-sidebar' || el.id === 'close-sidebar' || el.closest('#open-sidebar') || el.closest('#close-sidebar')) {
      return;
    }
    // Exclude form submit buttons or buttons inside forms (handled by form validation below)
    if (el.getAttribute('type') === 'submit' || el.closest('form')) {
      return;
    }

    el.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopImmediatePropagation();
      window.location.href = '404.html';
    });
  });

  // 5. Dashboard Form Validation & 404 Redirection
  document.querySelectorAll('form').forEach(form => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      e.stopImmediatePropagation();
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
        alert('Validation successful! Redirecting to 404 page...');
        window.location.href = '404.html';
      }
    });
  });

  // 6. Standalone Input Validation on Enter key (e.g. Search inputs outside forms)
  document.querySelectorAll('input, textarea').forEach(input => {
    if (input.closest('form') || input.type === 'checkbox' || input.type === 'radio' || input.type === 'hidden') {
      return;
    }
    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        const val = input.value.trim();
        if (!val) {
          alert('Please enter valid text before submitting.');
          input.style.borderColor = '#ff4d4d';
        } else {
          input.style.borderColor = '#22c55e';
          alert('Validation successful! Redirecting to 404 page...');
          window.location.href = '404.html';
        }
      }
    });
  });
});
