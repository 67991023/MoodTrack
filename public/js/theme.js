/**
 * MoodTrack Theme Management
 * Handles theme switching, preference saving, and system preference detection
 */

document.addEventListener('DOMContentLoaded', function() {
  // Theme constants
  const THEMES = {
    LIGHT: 'light',
    DARK: 'dark'
  };
  
  const STORAGE_KEY = 'theme';
  const TRANSITION_CLASS = 'theme-transition';
  
  // DOM Elements
  const themeToggle = document.getElementById('theme-toggle');
  const themeToggleText = document.getElementById('theme-toggle-text');
  const themeToggleIcon = themeToggle ? themeToggle.querySelector('i') : null;
  const html = document.documentElement;
  
  /**
   * Initialize theme from storage or system preference
   */
  function initializeTheme() {
    const savedTheme = localStorage.getItem(STORAGE_KEY);
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const theme = savedTheme || (prefersDark ? THEMES.DARK : THEMES.LIGHT);
    
    setTheme(theme, false);
  }
  
  function toggleTheme() {
    const currentTheme = html.getAttribute('data-theme');
    const newTheme = currentTheme === THEMES.DARK ? THEMES.LIGHT : THEMES.DARK;
    setTheme(newTheme, true);
  }
  
  /**
   * Apply theme to document and save preference
   * @param {string} theme - Theme to apply ('light' or 'dark')
   * @param {boolean} withTransition - Whether to animate the transition
   */
  function setTheme(theme, withTransition = true) {
    // Add transition class if needed
    if (withTransition) {
      html.classList.add(TRANSITION_CLASS);
      
      // Remove transition class after animation completes
      setTimeout(() => {
        html.classList.remove(TRANSITION_CLASS);
      }, 300);
    }
    
    // Apply theme attribute
    html.setAttribute('data-theme', theme);
    
    // Save preference
    localStorage.setItem(STORAGE_KEY, theme);
    
    // Update meta theme-color for browser UI
    const metaThemeColor = document.querySelector('meta[name="theme-color"]');
    if (metaThemeColor) {
      metaThemeColor.setAttribute('content', 
        theme === THEMES.DARK ? '#121212' : '#4a8072');
    }
    
    // Update toggle button appearance
    updateThemeToggleAppearance(theme);
  }
  
  /**
   * Update theme toggle button text and icon
   * @param {string} theme - Current theme
   */
  function updateThemeToggleAppearance(theme) {
    if (!themeToggleText || !themeToggleIcon) return;
    
    if (theme === THEMES.DARK) {
      themeToggleText.textContent = 'Light Mode';
      themeToggleIcon.className = 'fas fa-sun';
    } else {
      themeToggleText.textContent = 'Dark Mode';
      themeToggleIcon.className = 'fas fa-moon';
    }
  }

  /**
 * Apply theme to document and save preference
 * @param {string} theme - Theme to apply ('light' or 'dark')
 * @param {boolean} withTransition - Whether to animate the transition
 */
function setTheme(theme, withTransition = true) {
  // Add transition class if needed
  if (withTransition) {
    html.classList.add(TRANSITION_CLASS);
    
    // Remove transition class after animation completes
    setTimeout(() => {
      html.classList.remove(TRANSITION_CLASS);
    }, 300);
  }
  
  // Apply theme attribute
  html.setAttribute('data-theme', theme);
  
  // Force a repaint to ensure theme changes apply
  document.body.style.display = 'none';
  document.body.offsetHeight; // Trigger a reflow
  document.body.style.display = '';
  
  // Save preference
  localStorage.setItem(STORAGE_KEY, theme);
  
  // Update meta theme-color for browser UI
  const metaThemeColor = document.querySelector('meta[name="theme-color"]');
  if (metaThemeColor) {
    metaThemeColor.setAttribute('content', 
      theme === THEMES.DARK ? '#0c130d' : '#4a8072');
  }
  
  // Update toggle button appearance
  updateThemeToggleAppearance(theme);
}
  
  // Set up event listeners
  if (themeToggle) {
    themeToggle.addEventListener('click', toggleTheme);
  }
  
  // Listen for system preference changes
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', event => {
    // Only auto-switch if user hasn't set a preference
    if (!localStorage.getItem(STORAGE_KEY)) {
      setTheme(event.matches ? THEMES.DARK : THEMES.LIGHT);
    }
  });
  
  // Initialize theme (this may be redundant due to the preload script, but ensures consistency)
  initializeTheme();
});