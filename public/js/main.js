/**
 * MoodTrack - Main JavaScript
 */

document.addEventListener('DOMContentLoaded', function() {
  // Mobile menu toggle
  const menuToggle = document.getElementById('menu-toggle');
  if (menuToggle) {
    menuToggle.addEventListener('click', function() {
      document.body.classList.toggle('menu-open');
    });
  }

  // Close menu when clicking outside
  document.addEventListener('click', function(event) {
    if (document.body.classList.contains('menu-open') && 
        !event.target.closest('.main-nav') && 
        !event.target.closest('#menu-toggle')) {
      document.body.classList.remove('menu-open');
    }
  });

  // Flash message close buttons
  const flashCloseButtons = document.querySelectorAll('.flash-close');
  flashCloseButtons.forEach(button => {
    button.addEventListener('click', function() {
      this.parentElement.style.opacity = '0';
      setTimeout(() => {
        this.parentElement.style.display = 'none';
      }, 300);
    });
  });

  // Auto dismiss flash messages after 5 seconds
  const flashMessages = document.querySelectorAll('.flash-message');
  flashMessages.forEach(message => {
    setTimeout(() => {
      message.style.opacity = '0';
      setTimeout(() => {
        message.style.display = 'none';
      }, 300);
    }, 5000);
  });

  // Smooth scroll for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });

  // Mood tracking form enhancement
  const moodForm = document.querySelector('.mood-form');
  if (moodForm) {
    const moodButtons = document.querySelectorAll('.mood-button');
    const moodInput = document.querySelector('input[name="mood"]');
    
    moodButtons.forEach(button => {
      button.addEventListener('click', function() {
        // Remove active class from all buttons
        moodButtons.forEach(btn => btn.classList.remove('active'));
        
        // Add active class to clicked button
        this.classList.add('active');
        
        // Update hidden input value
        if (moodInput) {
          moodInput.value = this.dataset.value;
        }
      });
    });
  }

  // Chart initialization for dashboard
  const moodChartEl = document.getElementById('moodChart');
  if (moodChartEl && window.Chart) {
    initMoodChart(moodChartEl);
  }

  // Form validation
  const forms = document.querySelectorAll('form[data-validate]');
  forms.forEach(form => {
    form.addEventListener('submit', function(event) {
      const requiredFields = form.querySelectorAll('[required]');
      let isValid = true;
      
      requiredFields.forEach(field => {
        if (!field.value.trim()) {
          isValid = false;
          field.classList.add('error');
          
          // Create or update error message
          let errorMsg = field.parentElement.querySelector('.error-message');
          if (!errorMsg) {
            errorMsg = document.createElement('div');
            errorMsg.className = 'error-message';
            field.parentElement.appendChild(errorMsg);
          }
          errorMsg.textContent = 'This field is required';
        } else {
          field.classList.remove('error');
          const errorMsg = field.parentElement.querySelector('.error-message');
          if (errorMsg) {
            errorMsg.remove();
          }
        }
      });
      
      if (!isValid) {
        event.preventDefault();
      }
    });
  });
});

// Initialize mood chart (if Chart.js is available)
function initMoodChart(canvas) {
  // Sample data - replace with actual data from backend
  const chartData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [{
      label: 'Mood Level',
      data: [4, 3, 5, 2, 3, 4, 5],
      backgroundColor: 'rgba(74, 144, 226, 0.2)',
      borderColor: 'rgba(74, 144, 226, 1)',
      borderWidth: 2,
      tension: 0.4
    }]
  };

  new Chart(canvas, {
    type: 'line',
    data: chartData,
    options: {
      scales: {
        y: {
          beginAtZero: true,
          max: 5,
          ticks: {
            stepSize: 1,
            callback: function(value) {
              const labels = ['', 'Terrible', 'Bad', 'Neutral', 'Good', 'Great'];
              return labels[value] || '';
            }
          }
        }
      },
      plugins: {
        legend: {
          display: false
        }
      }
    }
  });
}

// Add animation on scroll
const animateOnScroll = function() {
  const elements = document.querySelectorAll('.animate-on-scroll');
  
  elements.forEach(element => {
    const elementPosition = element.getBoundingClientRect().top;
    const screenPosition = window.innerHeight / 1.3;
    
    if (elementPosition < screenPosition) {
      element.classList.add('animated');
    }
  });
};

window.addEventListener('scroll', animateOnScroll);
// Run once on page load
document.addEventListener('DOMContentLoaded', animateOnScroll);