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
});
