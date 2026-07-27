document.addEventListener('DOMContentLoaded', () => {
  // GSAP Entrance
  if (typeof gsap !== 'undefined') {
    gsap.from(".auth-container", {
      y: 50,
      opacity: 0,
      duration: 1,
      ease: "power3.out",
      delay: 0.2
    });
  }

  // Toggle Password Visibility
  const togglePwd = document.querySelector('.toggle-pwd');
  if (togglePwd) {
    togglePwd.addEventListener('click', function() {
      const input = this.previousElementSibling;
      if (input.type === 'password') {
        input.type = 'text';
        this.classList.remove('fa-eye-slash');
        this.classList.add('fa-eye');
      } else {
        input.type = 'password';
        this.classList.remove('fa-eye');
        this.classList.add('fa-eye-slash');
      }
    });
  }

  // Form Validations
  const loginForm = document.getElementById('loginForm');
  if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      let isValid = true;
      
      const email = document.getElementById('email');
      const password = document.getElementById('password');
      const role = document.getElementById('role');

      // Simple Email Validation
      if (!email.value || !/^\S+@\S+\.\S+$/.test(email.value)) {
        setError(email, 'Please enter a valid email address');
        isValid = false;
      } else {
        clearError(email);
      }

      // Password Validation
      if (!password.value || password.value.length < 6) {
        setError(password, 'Password must be at least 6 characters');
        isValid = false;
      } else {
        clearError(password);
      }

      if (isValid) {
        const emailVal = email.value.trim();
        let nameVal = localStorage.getItem('userName_' + emailVal) || localStorage.getItem('userName');
        if (!nameVal || localStorage.getItem('userEmail') !== emailVal) {
          const prefix = emailVal.split('@')[0];
          nameVal = prefix
            .replace(/[._-]/g, ' ')
            .split(' ')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
          if (role && role.value === 'Admin' && nameVal.toLowerCase() === 'admin') {
            nameVal = 'System Admin';
          }
        }
        localStorage.setItem('userEmail', emailVal);
        localStorage.setItem('userName', nameVal);
        if (role) {
          localStorage.setItem('userRole', role.value);
        }

        // Redirect based on role
        if (role && role.value === 'Admin') {
          window.location.href = 'AdminDashboard.html';
        } else {
          window.location.href = 'ClientDashboard.html';
        }
      }
    });
  }

  const signupForm = document.getElementById('signupForm');
  if (signupForm) {
    signupForm.addEventListener('submit', (e) => {
      e.preventDefault();
      let isValid = true;
      
      const name = document.getElementById('fullname');
      const email = document.getElementById('email');
      const password = document.getElementById('password');

      if (!name.value.trim()) {
        setError(name, 'Full name is required');
        isValid = false;
      } else {
        clearError(name);
      }

      if (!email.value || !/^\S+@\S+\.\S+$/.test(email.value)) {
        setError(email, 'Please enter a valid email address');
        isValid = false;
      } else {
        clearError(email);
      }

      if (!password.value || password.value.length < 6) {
        setError(password, 'Password must be at least 6 characters');
        isValid = false;
      } else {
        clearError(password);
      }

      if (isValid) {
        const nameVal = name.value.trim();
        const emailVal = email.value.trim();
        localStorage.setItem('userName_' + emailVal, nameVal);
        localStorage.setItem('userName', nameVal);
        localStorage.setItem('userEmail', emailVal);
        // Simulation of account creation, then redirect to login
        window.location.href = 'Login.html';
      }
    });
  }

  function setError(element, message) {
    const formGroup = element.closest('.form-group');
    formGroup.classList.add('has-error');
    const errorDisplay = formGroup.querySelector('.error-msg');
    if (errorDisplay) {
      errorDisplay.innerText = message;
    }
  }

  function clearError(element) {
    const formGroup = element.closest('.form-group');
    formGroup.classList.remove('has-error');
  }
});
