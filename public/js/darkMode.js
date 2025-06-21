/**
 * MoodTrack - Dark Mode Handler
 * Version: 1.0.0
 * Last updated: 2025-06-21
 */

document.addEventListener('DOMContentLoaded', function() {
  initializeDarkMode();
});

/**
 * Initialize dark mode functionality
 * Creates a toggle button if it doesn't exist
 * Applies user preferences or system preferences
 */
function initializeDarkMode() {
  // Check if dark mode is supported by the browser
  const darkModeSupported = window.matchMedia('(prefers-color-scheme)').media !== 'not all';
  
  if (!darkModeSupported) {
    console.log('Dark mode not supported by browser');
    return;
  }
  
  // Create dark mode toggle if it doesn't exist
  const existingToggle = document.querySelector('.dark-mode-toggle');
  if (!existingToggle) {
    createDarkModeToggle();
  }
  
  // Get toggle button (either existing or newly created)
  const darkModeToggle = document.querySelector('.dark-mode-toggle');
  if (!darkModeToggle) {
    console.error('Could not find or create dark mode toggle');
    return;
  }
  
  // Apply initial theme
  applyTheme();
  
  // Add toggle functionality
  darkModeToggle.addEventListener('click', toggleDarkMode);
  
  // Listen for system preference changes
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', handleSystemPreferenceChange);
}

/**
 * Creates a dark mode toggle button in the header
 */
function createDarkModeToggle() {
  const header = document.querySelector('.header-container');
  if (!header) {
    console.error('Header not found, cannot create dark mode toggle');
    return;
  }
  
  const darkModeToggle = document.createElement('button');
  darkModeToggle.classList.add('dark-mode-toggle');
  darkModeToggle.setAttribute('type', 'button');
  darkModeToggle.setAttribute('aria-label', 'Toggle dark mode');
  
  // Determine initial icon based on current mode
  const isDark = isDarkMode();
  darkModeToggle.innerHTML = isDark ? 
    '<span class="icon-sun" aria-hidden="true"></span>' : 
    '<span class="icon-moon" aria-hidden="true"></span>';
  
  // Add toggle to the header
  header.appendChild(darkModeToggle);
}

/**
 * Toggles between light and dark mode
 */
function toggleDarkMode() {
  const isDark = document.body.classList.toggle('dark-mode');
  
  // Save user preference
  localStorage.setItem('darkMode', isDark);
  
  // Update toggle button icon
  updateToggleIcon(isDark);
  
  // Announce mode change for screen readers
  announceThemeChange(isDark);
}

/**
 * Updates the toggle button icon based on current mode
 * @param {boolean} isDark - Whether dark mode is active
 */
function updateToggleIcon(isDark) {
  const darkModeToggle = document.querySelector('.dark-mode-toggle');
  if (darkModeToggle) {
    darkModeToggle.innerHTML = isDark ? 
      '<span class="icon-sun" aria-hidden="true"></span>' : 
      '<span class="icon-moon" aria-hidden="true"></span>';
  }
}

/**
 * Applies the appropriate theme based on user preference or system preference
 */
function applyTheme() {
  const isDark = isDarkMode();
  
  if (isDark) {
    document.body.classList.add('dark-mode');
  } else {
    document.body.classList.remove('dark-mode');
  }
  
  // Update toggle button icon
  updateToggleIcon(isDark);
}

/**
 * Determines if dark mode should be active
 * @returns {boolean} - Whether dark mode should be active
 */
function isDarkMode() {
  const savedMode = localStorage.getItem('darkMode');
  
  // If user has set a preference, use that
  if (savedMode !== null) {
    return savedMode === 'true';
  }
  
  // Otherwise, use system preference
  return window.matchMedia('(prefers-color-scheme: dark)').matches;
}

/**
 * Handle system preference change
 * @param {MediaQueryListEvent} event - Media query change event
 */
function handleSystemPreferenceChange(event) {
  // Only auto-switch if user hasn't set a preference
  if (localStorage.getItem('darkMode') === null) {
    if (event.matches) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
    
    // Update toggle button icon
    updateToggleIcon(event.matches);
  }
}

/**
 * Announces theme change for screen readers
 * @param {boolean} isDark - Whether dark mode is active
 */
function announceThemeChange(isDark) {
  // Create an alert for screen readers
  const announcement = document.createElement('div');
  announcement.setAttribute('role', 'status');
  announcement.setAttribute('aria-live', 'polite');
  announcement.className = 'sr-only';
  announcement.textContent = isDark ? 'Dark mode enabled' : 'Light mode enabled';
  
  // Add to DOM, then remove after announcement
  document.body.appendChild(announcement);
  setTimeout(() => {
    document.body.removeChild(announcement);
  }, 1000);
}