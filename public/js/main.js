// MoodTrack Main JavaScript

document.addEventListener('DOMContentLoaded', function() {
  console.log('MoodTrack application loaded');
  
  // Appearance animation for elements with data-appear attribute
  const appearElements = document.querySelectorAll('[data-appear]');
  
  if (appearElements.length > 0) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('appear-active');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });
    
    appearElements.forEach((element, index) => {
      observer.observe(element);
      // Add staggered delay based on element position
      const delay = index * 200;
      element.style.transitionDelay = `${delay}ms`;
    });
  }
  
  // Add date picker default value
  const datePicker = document.getElementById('date');
  if (datePicker) {
    const today = new Date().toISOString().split('T')[0];
    datePicker.value = today;
  }
  
  // Intensity slider value display
  const intensitySlider = document.getElementById('intensity');
  const intensityValue = document.querySelector('.intensity-value');
  
  if (intensitySlider && intensityValue) {
    intensitySlider.addEventListener('input', function() {
      intensityValue.textContent = this.value;
    });
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
  });
  
  // Category filtering for affirmations
  const categoryButtons = document.querySelectorAll('.category-card');
  const affirmationItems = document.querySelectorAll('.affirmation-item');
  
  if (categoryButtons.length > 0 && affirmationItems.length > 0) {
    categoryButtons.forEach(button => {
      button.addEventListener('click', function(e) {
        e.preventDefault();
        
        // Remove active class from all buttons
        categoryButtons.forEach(btn => btn.classList.remove('active'));
        
        // Add active class to clicked button
        this.classList.add('active');
        
        const selectedCategory = this.dataset.category;
        
        // Filter affirmations
        affirmationItems.forEach(item => {
          if (selectedCategory === 'all' || item.dataset.category === selectedCategory) {
            item.style.display = 'block';
          } else {
            item.style.display = 'none';
          }
        });
      });
    });
  }
  
  // Share button functionality
  const shareBtn = document.querySelector('.share-btn');
  if (shareBtn) {
    shareBtn.addEventListener('click', function() {
      const affirmation = document.querySelector('.affirmation-card p').textContent;
      
      // Check if Web Share API is available
      if (navigator.share) {
        navigator.share({
          title: 'Today\'s Affirmation from MoodTrack',
          text: affirmation + ' #MoodTrack',
          url: window.location.href
        }).catch(error => {
          console.log('Error sharing:', error);
        });
      } else {
        // Fallback
        const textArea = document.createElement('textarea');
        textArea.value = affirmation + ' #MoodTrack';
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        
        alert('Affirmation copied to clipboard!');
      }
    });
  }
  
  // Save buttons
  const saveButtons = document.querySelectorAll('.save-btn');
  saveButtons.forEach(button => {
    button.addEventListener('click', function() {
      this.innerHTML = 'Saved ✓';
      this.classList.add('saved');
      this.disabled = true;
      
      // Reset after 2 seconds
      setTimeout(() => {
        this.innerHTML = 'Save';
        this.classList.remove('saved');
        this.disabled = false;
      }, 2000);
    });
  });
  
  // Delete confirmation for mood entries
  const deleteBtn = document.querySelector('.delete-btn');
  if (deleteBtn) {
    deleteBtn.addEventListener('click', function() {
      if (confirm('Are you sure you want to delete this mood entry? This action cannot be undone.')) {
        // In a real app, this would make a DELETE request to the server
        alert('Entry deleted.');
        window.location.href = '/moods';
      }
    });
  }
});