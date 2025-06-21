/**
 * MoodTrack - Form Validation
 * Version: 1.0.0
 * Last updated: 2025-06-21
 */

document.addEventListener('DOMContentLoaded', function() {
  // Initialize form validation for all forms
  const forms = document.querySelectorAll('form');
  forms.forEach(initializeFormValidation);
});

/**
 * Initialize validation for a form
 * @param {HTMLFormElement} form - The form element to validate
 */
function initializeFormValidation(form) {
  if (!form || form.hasAttribute('data-no-validation')) {
    return;
  }
  
  // Add validation on submit
  form.addEventListener('submit', validateForm);
  
  // Add live validation for fields
  const fields = form.querySelectorAll('input, select, textarea');
  fields.forEach(field => {
    // Skip fields marked as no-validation
    if (field.hasAttribute('data-no-validation')) {
      return;
    }
    
    // Validate on blur (when field loses focus)
    field.addEventListener('blur', function() {
      validateField(this);
    });
    
    // For range inputs, validate on input change
    if (field.type === 'range') {
      field.addEventListener('input', function() {
        validateField(this);
      });
    }
  });
}

/**
 * Validates the entire form on submission
 * @param {Event} event - The submit event
 */
function validateForm(event) {
  let isValid = true;
  const form = event.target;
  
  // Get all fields to validate
  const fields = form.querySelectorAll('input, select, textarea');
  fields.forEach(field => {
    // Skip fields marked as no-validation
    if (field.hasAttribute('data-no-validation')) {
      return;
    }
    
    // Validate each field
    if (!validateField(field)) {
      isValid = false;
    }
  });
  
  // Special validation for mood selections in mood forms
  if (form.classList.contains('mood-form')) {
    const moodSelected = form.querySelector('input[name="mood"]:checked');
    if (!moodSelected) {
      isValid = false;
      
      // Show error for mood section
      const moodSection = form.querySelector('.mood-selection');
      if (moodSection) {
        showError(moodSection, 'Please select a mood');
      }
    }
  }
  
  // Prevent form submission if invalid
  if (!isValid) {
    event.preventDefault();
    
    // Scroll to first error
    const firstError = form.querySelector('.input-error');
    if (firstError) {
      firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }
}

/**
 * Validates a single form field
 * @param {HTMLElement} field - The form field to validate
 * @returns {boolean} - Whether the field is valid
 */
function validateField(field) {
  // Skip validation if disabled or hidden
  if (field.disabled || field.type === 'hidden' || field.style.display === 'none') {
    return true;
  }
  
  // Clear existing errors
  clearError(field);
  
  let isValid = true;
  let errorMessage = '';
  
  // Required field validation
  if (field.hasAttribute('required') && !field.value.trim()) {
    isValid = false;
    errorMessage = field.getAttribute('data-required-message') || 'This field is required';
  }
  
  // Email validation
  if (field.type === 'email' && field.value.trim() && !isValidEmail(field.value)) {
    isValid = false;
    errorMessage = field.getAttribute('data-email-message') || 'Please enter a valid email address';
  }
  
  // Password validation
  if (field.type === 'password' && field.hasAttribute('data-min-length')) {
    const minLength = parseInt(field.getAttribute('data-min-length'), 10);
    if (field.value.length < minLength) {
      isValid = false;
      errorMessage = field.getAttribute('data-length-message') || 
                    `Password must be at least ${minLength} characters`;
    }
  }
  
  // Number validation
  if (field.type === 'number') {
    const value = parseFloat(field.value);
    
    if (field.hasAttribute('min') && value < parseFloat(field.getAttribute('min'))) {
      isValid = false;
      errorMessage = `Value must be at least ${field.getAttribute('min')}`;
    }
    
    if (field.hasAttribute('max') && value > parseFloat(field.getAttribute('max'))) {
      isValid = false;
      errorMessage = `Value must not exceed ${field.getAttribute('max')}`;
    }
  }
  
  // Range validation for mood intensity
  if (field.type === 'range' && field.classList.contains('mood-intensity')) {
    const value = parseInt(field.value, 10);
    if (isNaN(value) || value < 1) {
      isValid = false;
      errorMessage = 'Please select a mood intensity';
    }
  }
  
  // Date validation
  if (field.type === 'date') {
    const date = new Date(field.value);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    // Check if future date (usually not allowed for mood entries)
    if (field.hasAttribute('data-no-future') && date > today) {
      isValid = false;
      errorMessage = 'Future dates are not allowed';
    }
  }
  
  // Custom validation pattern
  if (field.hasAttribute('pattern') && field.value.trim()) {
    const pattern = new RegExp(field.getAttribute('pattern'));
    if (!pattern.test(field.value)) {
      isValid = false;
      errorMessage = field.getAttribute('data-pattern-message') || 'Please match the requested format';
    }
  }
  
  // Show error message if invalid
  if (!isValid) {
    showError(field, errorMessage);
  }
  
  return isValid;
}

/**
 * Displays an error message for a form field
 * @param {HTMLElement} field - The form field with error
 * @param {string} message - The error message to display
 */
function showError(field, message) {
  // Clear existing error first
  clearError(field);
  
  // Create error message element
  const errorDiv = document.createElement('div');
  errorDiv.className = 'input-error';
  errorDiv.textContent = message;
  errorDiv.setAttribute('aria-live', 'polite');
  
  // Apply error styles
  field.classList.add('input-error-field');
  field.setAttribute('aria-invalid', 'true');
  
  // Find the appropriate place to insert the error
  if (field.type === 'radio' || field.type === 'checkbox') {
    // For radio/checkbox, find the container
    const container = field.closest('.radio-group, .checkbox-group, .mood-selection');
    if (container) {
      container.appendChild(errorDiv);
    } else {
      // If no container, insert after the last radio/checkbox in the group
      const group = document.querySelectorAll(`input[name="${field.name}"]`);
      const lastInput = group[group.length - 1];
      lastInput.parentNode.insertBefore(errorDiv, lastInput.nextSibling);
    }
  } else {
    // For other inputs, insert after the field
    field.parentNode.insertBefore(errorDiv, field.nextSibling);
  }
}

/**
 * Clears error message for a form field
 * @param {HTMLElement} field - The form field to clear errors for
 */
function clearError(field) {
  // Remove error class
  field.classList.remove('input-error-field');
  field.removeAttribute('aria-invalid');
  
  // Find and remove error message
  if (field.type === 'radio' || field.type === 'checkbox') {
    // For radio/checkbox groups
    const container = field.closest('.radio-group, .checkbox-group, .mood-selection');
    if (container) {
      const error = container.querySelector('.input-error');
      if (error) {
        error.remove();
      }
    } else {
      // Find by name
      const group = document.querySelectorAll(`input[name="${field.name}"]`);
      const lastInput = group[group.length - 1];
      const error = lastInput.parentNode.querySelector('.input-error');
      if (error) {
        error.remove();
      }
    }
  } else {
    // For other inputs
    const error = field.nextElementSibling;
    if (error && error.classList.contains('input-error')) {
      error.remove();
    }
  }
}

/**
 * Validates an email address
 * @param {string} email - The email address to validate
 * @returns {boolean} - Whether the email is valid
 */
function isValidEmail(email) {
  const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
}