document.addEventListener('DOMContentLoaded', () => {
  // Sidebar Toggle for Mobile
  const sidebarToggle = document.getElementById('sidebarToggle');
  const sidebar = document.getElementById('sidebar');
  
  if (sidebarToggle && sidebar) {
    sidebarToggle.addEventListener('click', () => {
      sidebar.classList.toggle('show');
    });
  }

  // Sidebar Submenu Toggle
  const menuItems = document.querySelectorAll('.menu-item.has-submenu');
  menuItems.forEach(item => {
    const title = item.querySelector('.menu-title');
    title.addEventListener('click', () => {
      const isActive = item.classList.contains('active');
      // Close all
      menuItems.forEach(i => i.classList.remove('active'));
      // Open clicked if it wasn't active
      if (!isActive) item.classList.add('active');
    });
  });

  // Dynamic Email Population logic
  const emailList = document.getElementById('dynamicEmailList');
  if (emailList) {
    const type = emailList.getAttribute('data-type'); // Admin or Client
    let emails = [];
    
    if (type === 'admin') {
      emails = [
        { initial: 'S', name: 'Sarah Jenkins', subject: 'Course Material Request', time: '10 mins ago' },
        { initial: 'M', name: 'Maria Garcia', subject: 'Instructor Payment Issue', time: '1 hour ago' },
        { initial: 'J', name: 'James Doe', subject: 'Unable to login to portal', time: '3 hours ago' },
        { initial: 'T', name: 'Technical Support', subject: 'Server Maintenance Notice', time: 'Yesterday' }
      ];
    } else {
      emails = [
        { initial: 'S', name: 'System', subject: 'Level 2 Course Unlocked!', time: '20 mins ago' },
        { initial: 'K', name: 'Kenji Sato', subject: 'Feedback on your speaking task', time: '2 hours ago' },
        { initial: 'A', name: 'Admin', subject: 'Weekly Challenge Started', time: '5 hours ago' },
        { initial: 'C', name: 'Certifications', subject: 'Your A1 Certificate is ready', time: '1 day ago' }
      ];
    }
    
    emailList.innerHTML = '';
    emails.forEach(email => {
      const li = document.createElement('li');
      li.className = 'email-item';
      li.innerHTML = `
        <div class="email-avatar">${email.initial}</div>
        <div class="email-content">
          <h4>${email.name}</h4>
          <p>${email.subject}</p>
        </div>
        <div class="email-time">${email.time}</div>
      `;
      emailList.appendChild(li);
    });
  }

  // Progress Ring Animation
  const progressCircle = document.querySelector('.progress-value');
  if (progressCircle) {
    const targetValue = parseInt(progressCircle.getAttribute('data-value')) || 0;
    // Circumference is 440
    setTimeout(() => {
      const offset = 440 - (440 * targetValue) / 100;
      progressCircle.style.strokeDashoffset = offset;
    }, 500);
  }

  // Simple Bar Chart Animation Placeholder
  const bars = document.querySelectorAll('.chart-bar');
  if (bars.length > 0) {
    setTimeout(() => {
      bars.forEach(bar => {
        const height = bar.getAttribute('data-height');
        bar.style.height = height + '%';
      });
    }, 300);
  }
});
