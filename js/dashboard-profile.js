// Dynamic User Profile Management for Client and Admin Dashboards
document.addEventListener("DOMContentLoaded", () => {
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
