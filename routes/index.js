const express = require('express');
const router = express.Router();

// Helper function to get current date and time
function getCurrentDateTime() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const seconds = String(now.getSeconds()).padStart(2, '0');
  
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

// Home page
router.get('/', (req, res) => {
  res.render('index', { 
    title: 'MoodTrack - Home',
    currentTime: getCurrentDateTime(),
    path: '/',
    user: process.env.USER_LOGIN || '67991023' 
  });
});

// Dashboard page
router.get('/dashboard', (req, res) => {
  res.render('dashboard', { 
    title: 'MoodTrack - Dashboard',
    currentTime: getCurrentDateTime(),
    path: '/dashboard',
    user: process.env.USER_LOGIN || '67991023',
    moodDates: ['Jun 15', 'Jun 16', 'Jun 17', 'Jun 18', 'Jun 19', 'Jun 20'],
    moodRatings: [7, 5, 8, 6, 9, 7],
    averageMood: '7.0',
    todaysMood: null,
    factorCounts: {
      'Exercise': 4,
      'Work': 7,
      'Socializing': 3,
      'Nutrition': 2
    }
  });
});

// About page
router.get('/about', (req, res) => {
  res.render('about', { 
    title: 'MoodTrack - About',
    currentTime: getCurrentDateTime(),
    path: '/about'
  });
});

module.exports = router;