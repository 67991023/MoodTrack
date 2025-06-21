/**
 * MoodTrack - Core JavaScript Functions
 * Version: 1.0.0
 * Last updated: 2025-06-21
 */

// Execute when DOM is fully loaded
document.addEventListener('DOMContentLoaded', function() {
  // =========================================================
  // Navigation & UI Controls
  // =========================================================
  
  // Mobile menu toggle functionality
  const menuToggle = document.getElementById('menu-toggle');
  if (menuToggle) {
    menuToggle.addEventListener('click', function() {
      const nav = document.querySelector('.main-nav');
      nav.classList.toggle('active');
      
      // Update aria-expanded attribute for accessibility
      const expanded = nav.classList.contains('active');
      menuToggle.setAttribute('aria-expanded', expanded);
    });
    
    // Close mobile menu when clicking outside
    document.addEventListener('click', function(event) {
      const nav = document.querySelector('.main-nav');
      if (nav && nav.classList.contains('active') && 
          !event.target.closest('.main-nav') && 
          !event.target.closest('#menu-toggle')) {
        nav.classList.remove('active');
        menuToggle.setAttribute('aria-expanded', 'false');
      }
    });
  }
  
  // =========================================================
  // Flash Messages Handling
  // =========================================================
  
  // Flash message close buttons
  const closeButtons = document.querySelectorAll('.flash-close');
  closeButtons.forEach(button => {
    button.addEventListener('click', function() {
      const flashMessage = this.closest('.flash-message');
      flashMessage.classList.add('fade-out');
      setTimeout(() => {
        flashMessage.remove();
      }, 500);
    });
  });
  
  // Auto-hide flash messages after 5 seconds
  const flashMessages = document.querySelectorAll('.flash-message');
  flashMessages.forEach(message => {
    setTimeout(() => {
      if (message && document.body.contains(message)) {
        message.classList.add('fade-out');
        setTimeout(() => {
          if (message && document.body.contains(message)) {
            message.remove();
          }
        }, 500);
      }
    }, 5000);
  });
  
  // =========================================================
  // Form Handling & Validation
  // =========================================================
  
  // Form submission loading states
  const forms = document.querySelectorAll('form');
  forms.forEach(form => {
    form.addEventListener('submit', function() {
      const submitButton = this.querySelector('button[type="submit"]');
      if (submitButton && !form.hasAttribute('data-no-loading')) {
        // Save original text
        submitButton.setAttribute('data-original-text', submitButton.innerHTML);
        
        // Show loading state
        submitButton.disabled = true;
        submitButton.innerHTML = '<span class="spinner"></span> Saving...';
        
        // Add a class to the form
        form.classList.add('form-submitting');
        
        // Restore on page unload or after timeout
        window.addEventListener('beforeunload', function() {
          submitButton.disabled = false;
          submitButton.innerHTML = submitButton.getAttribute('data-original-text');
          form.classList.remove('form-submitting');
        });
        
        // Safety timeout to re-enable button if submission takes too long
        setTimeout(() => {
          if (document.body.contains(submitButton) && submitButton.disabled) {
            submitButton.disabled = false;
            submitButton.innerHTML = submitButton.getAttribute('data-original-text');
            form.classList.remove('form-submitting');
          }
        }, 8000);
      }
    });
  });
  
  // Range input value display
  const rangeInputs = document.querySelectorAll('input[type="range"]');
  rangeInputs.forEach(input => {
    const valueDisplay = document.querySelector(`#${input.id}-value`) || 
                         input.parentNode.querySelector('.intensity-value');
                         
    if (valueDisplay) {
      // Update value display on load
      valueDisplay.textContent = input.value;
      
      // Update on change
      input.addEventListener('input', function() {
        valueDisplay.textContent = this.value;
      });
    }
  });
  
  // =========================================================
  // Scroll Animations
  // =========================================================
  
  // Initialize animations for elements with data-appear attribute
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('appear-active');
          
          // Unobserve after animation is triggered
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.15,
      rootMargin: '0px 0px -50px 0px'
    });
    
    document.querySelectorAll('[data-appear]').forEach(element => {
      observer.observe(element);
    });
  } else {
    // Fallback for browsers that don't support IntersectionObserver
    document.querySelectorAll('[data-appear]').forEach(element => {
      element.classList.add('appear-active');
    });
  }
  
  // =========================================================
  // Dark Mode Functionality
  // =========================================================
  
  // Initialize dark mode if supported
  const darkModeSupported = window.matchMedia('(prefers-color-scheme)').media !== 'not all';
  
  if (darkModeSupported) {
    // Create dark mode toggle if it doesn't exist
    if (!document.querySelector('.dark-mode-toggle')) {
      const header = document.querySelector('.header-container');
      if (header) {
        const darkModeToggle = document.createElement('button');
        darkModeToggle.classList.add('dark-mode-toggle');
        darkModeToggle.setAttribute('aria-label', 'Toggle dark mode');
        darkModeToggle.innerHTML = '<span class="icon-moon"></span>';
        header.appendChild(darkModeToggle);
      }
    }
    
    // Get toggle button
    const darkModeToggle = document.querySelector('.dark-mode-toggle');
    if (darkModeToggle) {
      // Check user preference
      const prefersDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
      const savedMode = localStorage.getItem('darkMode');
      const isDark = savedMode === 'true' || (savedMode === null && prefersDarkMode);
      
      // Apply initial mode
      if (isDark) {
        document.body.classList.add('dark-mode');
        darkModeToggle.innerHTML = '<span class="icon-sun"></span>';
      }
      
      // Toggle dark mode
      darkModeToggle.addEventListener('click', function() {
        document.body.classList.toggle('dark-mode');
        const isDarkMode = document.body.classList.contains('dark-mode');
        
        // Save preference
        localStorage.setItem('darkMode', isDarkMode);
        
        // Update icon
        this.innerHTML = isDarkMode ? 
          '<span class="icon-sun"></span>' : '<span class="icon-moon"></span>';
      });
      
      // Handle system preference change
      window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', event => {
        if (localStorage.getItem('darkMode') === null) {
          // Only auto-switch if user hasn't set a preference
          if (event.matches) {
            document.body.classList.add('dark-mode');
            if (darkModeToggle) {
              darkModeToggle.innerHTML = '<span class="icon-sun"></span>';
            }
          } else {
            document.body.classList.remove('dark-mode');
            if (darkModeToggle) {
              darkModeToggle.innerHTML = '<span class="icon-moon"></span>';
            }
          }
        }
      });
    }
  }
  
  // =========================================================
  // Dashboard Functionality
  // =========================================================
  
  // Add export buttons to dashboard
  const isDashboard = window.location.pathname.includes('/dashboard');
  if (isDashboard) {
    const dashboardHeader = document.querySelector('.page-header');
    if (dashboardHeader && !dashboardHeader.querySelector('.export-buttons')) {
      const exportContainer = document.createElement('div');
      exportContainer.className = 'export-buttons';
      
      const exportCSVBtn = document.createElement('button');
      exportCSVBtn.className = 'btn secondary';
      exportCSVBtn.textContent = 'Export CSV';
      exportCSVBtn.addEventListener('click', () => {
        // Get chart data for export
        const chartDataElement = document.getElementById('moodChartData');
        if (!chartDataElement) return;
        
        let moodDates = [];
        let moodRatings = [];
        
        try {
          const datesStr = chartDataElement.getAttribute('data-dates');
          const ratingsStr = chartDataElement.getAttribute('data-ratings');
          
          if (datesStr) {
            moodDates = JSON.parse(decodeURIComponent(datesStr));
          }
          
          if (ratingsStr) {
            moodRatings = JSON.parse(decodeURIComponent(ratingsStr));
          }
          
          // Create export data
          const exportData = moodDates.map((date, index) => ({
            date: date,
            rating: moodRatings[index] || 'N/A'
          }));
          
          exportMoodData(exportData, 'csv');
        } catch (error) {
          console.error('Error exporting data:', error);
          alert('Unable to export data. Please try again later.');
        }
      });
      
      exportContainer.appendChild(exportCSVBtn);
      dashboardHeader.appendChild(exportContainer);
    }
  }
  
  // =========================================================
  // Onboarding for First-Time Users
  // =========================================================
  
  // Check for first-time visitors
  const isHomepage = window.location.pathname === '/' || window.location.pathname === '/index.html';
  const hasVisitedBefore = localStorage.getItem('hasVisitedBefore');
  
  if (isHomepage && !hasVisitedBefore) {
    // Set flag
    localStorage.setItem('hasVisitedBefore', 'true');
    
    // Show intro highlight for key elements
    const keyElements = [
      { selector: '.hero', message: 'Welcome to MoodTrack! Your personal mood tracking companion.' },
      { selector: '.feature:nth-child(1)', message: 'Record your daily moods to track emotional patterns.' },
      { selector: '.feature:nth-child(2)', message: 'Get daily positive affirmations to boost your mindset.' },
      { selector: '.feature:nth-child(3)', message: 'View insights about your emotional wellbeing.' }
    ];
    
    // Add highlight class with delay
    keyElements.forEach((element, index) => {
      const el = document.querySelector(element.selector);
      if (el) {
        setTimeout(() => {
          el.setAttribute('data-intro', element.message);
          el.classList.add('intro-highlight');
          
          // Remove highlight after delay
          setTimeout(() => {
            el.classList.remove('intro-highlight');
          }, 3000);
        }, index * 1000);
      }
    });
  }
});

/**
 * Export mood data to CSV or JSON file
 * @param {Array} data - Array of mood data objects
 * @param {string} format - 'csv' or 'json'
 */
function exportMoodData(data, format = 'csv') {
  if (!data || !Array.isArray(data) || data.length === 0) {
    alert('No data available to export.');
    return;
  }
  
  let content, filename, mimetype;
  const dateStr = new Date().toISOString().slice(0, 10);
  
  if (format === 'json') {
    content = JSON.stringify(data, null, 2);
    filename = `moodtrack-export-${dateStr}.json`;
    mimetype = 'application/json';
  } else {
    // Convert to CSV
    const headers = Object.keys(data[0]).join(',');
    const rows = data.map(row => {
      return Object.values(row).map(value => {
        // Wrap string values in quotes and handle commas
        return typeof value === 'string' ? `"${value.replace(/"/g, '""')}"` : value;
      }).join(',');
    });
    content = [headers, ...rows].join('\n');
    filename = `moodtrack-export-${dateStr}.csv`;
    mimetype = 'text/csv';
  }
  
  // Create download link
  const blob = new Blob([content], { type: mimetype });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  
  // Trigger download
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}