// This is a separate file to fix CSS issues without modifying app.js
const fs = require('fs');
const path = require('path');

// Create directory structure
const publicDir = path.join(__dirname, 'public');
const cssDir = path.join(publicDir, 'css');

// Create directories if they don't exist
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir);
  console.log('Created public directory');
}

if (!fs.existsSync(cssDir)) {
  fs.mkdirSync(cssDir);
  console.log('Created css directory');
}

// Define CSS content
const cssContent = `
/* MoodTrack Styling */

/* Base styles */
body {
  font-family: 'Poppins', -apple-system, BlinkMacSystemFont, sans-serif;
  line-height: 1.6;
  color: #333333;
  background-color: #f9f9f9;
  margin: 0;
  padding: 0;
}

/* Container */
.container {
  max-width: 1200px;
  width: 100%;
  margin: 0 auto;
  padding: 0 1rem;
}

/* Header */
.app-header {
  background-color: #ffffff;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  padding: 1rem 0;
}

.header-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.logo {
  font-size: 1.8rem;
  font-weight: bold;
  color: #4a8072;
  text-decoration: none;
}

/* Navigation */
.main-nav ul {
  list-style: none;
  display: flex;
  gap: 1rem;
  margin: 0;
  padding: 0;
}

.main-nav ul li a {
  display: inline-block;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  font-weight: 500;
  color: #333333;
}

.main-nav ul li a:hover {
  background-color: #8fb5a3;
  color: #ffffff;
  text-decoration: none;
}

.main-nav ul li a.active {
  background-color: #4a8072;
  color: #ffffff;
}

/* Page header */
.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #e0e0e0;
}

/* Main content */
main {
  flex: 1;
  padding: 2rem 0;
}

/* Buttons */
.btn {
  display: inline-block;
  padding: 0.5rem 1.5rem;
  border-radius: 8px;
  background-color: #e0e0e0;
  color: #333333;
  font-weight: 600;
  text-align: center;
  cursor: pointer;
  border: none;
}

.btn:hover {
  text-decoration: none;
}

.btn.primary {
  background-color: #4a8072;
  color: white;
}

.btn.primary:hover {
  background-color: #336353;
}

.btn.secondary {
  background-color: #8e5b7d;
  color: white;
}

/* Affirmation Card */
.affirmation-card {
  background-color: #f4bc8c;
  color: #333333;
  border-radius: 8px;
  padding: 2rem 1.5rem;
  text-align: center;
  margin: 1.5rem 0;
  position: relative;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
}

.affirmation-card p {
  font-size: 1.5rem;
  font-style: italic;
  line-height: 1.4;
  margin: 1rem 0 2rem;
}

.affirmation-date {
  position: absolute;
  top: 0.5rem;
  right: 1rem;
  font-size: 0.9rem;
  color: rgba(0, 0, 0, 0.5);
}

.share-btn {
  position: absolute;
  bottom: 1rem;
  right: 1rem;
  font-size: 0.9rem;
  padding: 0.25rem 1rem;
}

/* Category Grid */
.category-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 1rem;
  margin-bottom: 2rem;
}

.category-card {
  background-color: #ffffff;
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  text-decoration: none;
  color: inherit;
  border-top: 3px solid #4a8072;
}

.category-card h3 {
  color: #4a8072;
  margin-bottom: 0.5rem;
}

.category-card p {
  font-size: 0.95rem;
  margin-bottom: 0;
  color: #6c6c6c;
}

/* Footer */
.app-footer {
  background-color: #ffffff;
  padding: 2rem 0 1rem;
  margin-top: 2rem;
  border-top: 1px solid #e0e0e0;
}

.footer-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 2rem;
  margin-bottom: 2rem;
}

.footer-col h3,
.footer-col h4 {
  color: #4a8072;
  margin-bottom: 1rem;
}

.footer-col ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.footer-col ul li {
  margin-bottom: 0.5rem;
}

.footer-bottom {
  padding-top: 1.5rem;
  border-top: 1px solid #e0e0e0;
  text-align: center;
}

.footer-bottom p {
  color: #6c6c6c;
  margin: 0.25rem 0;
  font-size: 0.9rem;
}

/* Mobile menu toggle */
#menu-toggle {
  display: none;
  background: none;
  border: none;
  cursor: pointer;
}

#menu-toggle span {
  display: block;
  width: 25px;
  height: 3px;
  margin: 5px;
  background-color: #4a8072;
}

/* Responsive design */
@media (max-width: 768px) {
  #menu-toggle {
    display: block;
  }
  
  .main-nav {
    display: none;
    width: 100%;
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    background-color: #ffffff;
    box-shadow: 0 5px 10px rgba(0, 0, 0, 0.1);
    padding: 1rem;
    z-index: 100;
  }
  
  .main-nav.active {
    display: block;
  }
  
  .main-nav ul {
    flex-direction: column;
  }
  
  .header-container {
    position: relative;
  }
}
`;

// Write CSS file
const cssFilePath = path.join(cssDir, 'style.css');
fs.writeFileSync(cssFilePath, cssContent);
console.log(`Created CSS file at: ${cssFilePath}`);

// Create layout directory and file if needed
const viewsDir = path.join(__dirname, 'views');
const layoutDir = path.join(viewsDir, 'layout');

if (!fs.existsSync(viewsDir)) {
  fs.mkdirSync(viewsDir);
  console.log('Created views directory');
}

if (!fs.existsSync(layoutDir)) {
  fs.mkdirSync(layoutDir);
  console.log('Created layout directory');
}

// Define layout file content
const layoutContent = `<!DOCTYPE html>
<html lang="en">
<head>
  <title><%= typeof title !== 'undefined' ? title : 'MoodTrack' %></title>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  
  <!-- Empty favicon to prevent 404 errors -->
  <link rel="icon" href="data:,">
  
  <!-- Fonts -->
  <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap" rel="stylesheet">
  
  <!-- Inline critical CSS (will work even if external CSS fails) -->
  <style>
    body {
      font-family: 'Poppins', -apple-system, BlinkMacSystemFont, sans-serif;
      line-height: 1.6;
      color: #333;
      background-color: #f9f9f9;
      margin: 0;
      padding: 0;
    }
    .container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 1rem;
    }
    .app-header {
      background-color: white;
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
      padding: 1rem 0;
    }
    .header-container {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .logo {
      font-size: 1.8rem;
      font-weight: bold;
      color: #4a8072;
      text-decoration: none;
    }
    .main-nav ul {
      list-style: none;
      display: flex;
      gap: 1rem;
      margin: 0;
      padding: 0;
    }
    .main-nav ul li a {
      padding: 0.5rem 1rem;
      border-radius: 4px;
      color: #333;
      text-decoration: none;
    }
    .main-nav ul li a.active {
      background-color: #4a8072;
      color: white;
    }
    .affirmation-card {
      background-color: #f4bc8c;
      color: #333;
      border-radius: 8px;
      padding: 2rem 1.5rem;
      text-align: center;
      margin: 1.5rem 0;
      position: relative;
    }
    .affirmation-date {
      position: absolute;
      top: 0.5rem;
      right: 1rem;
      font-size: 0.9rem;
      color: rgba(0, 0, 0, 0.5);
    }
  </style>
  
  <!-- External CSS with timestamp to prevent caching -->
  <link rel="stylesheet" href="/css/style.css?v=<%= new Date().getTime() %>">
</head>
<body>
  <header class="app-header">
    <div class="container header-container">
      <a href="/" class="logo">MoodTrack</a>
      <button id="menu-toggle" aria-label="Toggle menu">
        <span></span>
        <span></span>
        <span></span>
      </button>
      <nav class="main-nav">
        <ul>
          <li><a href="/" class="<%= typeof path !== 'undefined' && path === '/' ? 'active' : '' %>">Home</a></li>
          <li><a href="/moods" class="<%= typeof path !== 'undefined' && path && path.startsWith('/moods') ? 'active' : '' %>">Moods</a></li>
          <li><a href="/affirmations" class="<%= typeof path !== 'undefined' && path && path === '/affirmations' ? 'active' : '' %>">Affirmations</a></li>
          <li><a href="/dashboard" class="<%= typeof path !== 'undefined' && path === '/dashboard' ? 'active' : '' %>">Dashboard</a></li>
        </ul>
      </nav>
    </div>
  </header>

  <main>
    <div class="container">
      <%- body %>
    </div>
  </main>

  <footer class="app-footer">
    <div class="container">
      <div class="footer-grid">
        <div class="footer-col">
          <h3>MoodTrack</h3>
          <p>Your daily companion for mental wellbeing</p>
        </div>
        <div class="footer-col">
          <h4>Quick Links</h4>
          <ul>
            <li><a href="/">Home</a></li>
            <li><a href="/moods">Mood Tracking</a></li>
            <li><a href="/affirmations">Daily Affirmations</a></li>
            <li><a href="/dashboard">Dashboard</a></li>
          </ul>
        </div>
        <div class="footer-col">
          <h4>Connect</h4>
          <p>Coming soon!</p>
        </div>
      </div>
      <div class="footer-bottom">
        <p>Current time: <%= typeof currentTime !== 'undefined' ? currentTime : new Date().toISOString() %></p>
        <p>&copy; <%= new Date().getFullYear() %> MoodTrack. All rights reserved.</p>
        <% if (typeof user !== 'undefined') { %>
        <p><small>User: <%= user %></small></p>
        <% } %>
      </div>
    </div>
  </footer>
  
  <!-- Inline JavaScript -->
  <script>
    // Mobile menu toggle
    document.addEventListener('DOMContentLoaded', function() {
      const menuToggle = document.getElementById('menu-toggle');
      if (menuToggle) {
        menuToggle.addEventListener('click', function() {
          document.querySelector('.main-nav').classList.toggle('active');
        });
      }
    });
  </script>
</body>
</html>`;

// Write layout file
const layoutFilePath = path.join(layoutDir, 'main.ejs');
fs.writeFileSync(layoutFilePath, layoutContent);
console.log(`Created layout file at: ${layoutFilePath}`);

console.log('CSS and layout fixes completed successfully!');