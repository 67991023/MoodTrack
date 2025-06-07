// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
  console.log('MoodTrack application loaded');
  
  // Add date picker default value
  const datePicker = document.getElementById('date');
  if (datePicker) {
    const today = new Date().toISOString().split('T')[0];
    datePicker.value = today;
  }
  
  // Mobile navigation toggle
  const mobileNavToggle = document.createElement('button');
  mobileNavToggle.classList.add('mobile-nav-toggle');
  mobileNavToggle.innerHTML = '☰';
  
  const header = document.querySelector('header');
  const nav = document.querySelector('nav');
  
  if (header && nav) {
    header.insertBefore(mobileNavToggle, nav);
    
    mobileNavToggle.addEventListener('click', function() {
      nav.classList.toggle('active');
    });
  }
  
  // Flash messages
  const flashMessages = document.querySelectorAll('.flash-message');
  flashMessages.forEach(message => {
    setTimeout(() => {
      message.classList.add('fade-out');
      setTimeout(() => {
        message.remove();
      }, 500);
    }, 5000);
    
    const closeBtn = message.querySelector('.close');
    if (closeBtn) {
      closeBtn.addEventListener('click', () => {
        message.remove();
      });
    }
  });
});