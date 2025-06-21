// main application file
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
const expressLayouts = require('express-ejs-layouts');

// Load environment variables
dotenv.config();
const app = express();

// Define PORT at the beginning
const PORT = process.env.PORT || 3000;

// Application startup logs
console.log('Starting MoodTrack application...');

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Handle static files
app.use(express.static(path.join(__dirname, 'public')));

// Setup view engine with layouts
app.use(expressLayouts);
app.set('layout', 'layout/main');
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Handle favicon requests to prevent 404 errors
app.get('/favicon.ico', (req, res) => {
  res.status(204).end(); // No content response
});

// Get current date and time in YYYY-MM-DD HH:MM:SS format
const getCurrentDateTime = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const seconds = String(now.getSeconds()).padStart(2, '0');
  
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
};

// Define default sample data for pages
const getSampleMoodData = () => {
  return {
    moodDates: ['Jun 15', 'Jun 16', 'Jun 17', 'Jun 18', 'Jun 19', 'Jun 20', 'Jun 21'],
    moodRatings: [7, 5, 8, 6, 9, 7, 8],
    averageMood: '7.1',
    todaysMood: '8',
    factorCounts: {
      'Exercise': 4,
      'Work': 7,
      'Socializing': 3,
      'Nutrition': 2,
      'Sleep': 5,
      'Meditation': 3
    }
  };
};

// Connect to MongoDB Atlas with fallback
let dbConnected = false;

mongoose
  .connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/moodtrack', {
    // Remove deprecated option
    serverSelectionTimeoutMS: 5000 // 5 second timeout for server selection
  })
  .then(() => {
    console.log('Connected to MongoDB Atlas');
    dbConnected = true;
  })
  .catch((err) => {
    console.error('Database connection error:', err);
    console.log('Continuing without database connection. Using sample data.');
  });

// Home page
app.get('/', (req, res) => {
  res.render('index', { 
    title: 'MoodTrack - Your Emotional Wellness Companion',
    currentTime: getCurrentDateTime(),
    path: '/',
    user: process.env.USER_LOGIN || '67991023'
  });
});

// Dashboard page with sample data
app.get('/dashboard', (req, res) => {
  const sampleData = getSampleMoodData();
  
  res.render('dashboard', {
    title: 'Your Wellness Dashboard - MoodTrack',
    currentTime: getCurrentDateTime(),
    path: '/dashboard',
    user: process.env.USER_LOGIN || '67991023',
    ...sampleData
  });
});

// Moods pages
app.get('/moods', (req, res) => {
  res.render('moods/index', { 
    title: 'Mood Tracking - MoodTrack',
    currentTime: getCurrentDateTime(),
    path: '/moods',
    moods: [],
    user: process.env.USER_LOGIN || '67991023'
  });
});

app.get('/moods/new', (req, res) => {
  res.render('moods/new', { 
    title: 'Record New Mood - MoodTrack',
    currentTime: getCurrentDateTime(),
    path: '/moods',
    moodOptions: ['Happy', 'Sad', 'Angry', 'Anxious', 'Calm', 'Energetic', 'Tired'],
    user: process.env.USER_LOGIN || '67991023'
  });
});

// FIX FOR AFFIRMATIONS PAGE - Add the today variable
app.get('/affirmations', (req, res) => {
  try {
    const now = new Date();
    const today = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
    
    res.render('affirmations/index', {
      title: 'Daily Affirmations - MoodTrack',
      currentTime: getCurrentDateTime(),
      path: '/affirmations',
      today: today, // This fixes the 'today is not defined' error
      user: process.env.USER_LOGIN || '67991023',
      dailyAffirmation: "I am worthy of love and respect. My feelings are valid and I deserve to take care of myself."
    });
  } catch (error) {
    console.error("Error in affirmations route:", error);
    res.status(500).render('error', { 
      title: 'Server Error - MoodTrack', 
      message: 'Something went wrong on our end. Please try again later.',
      currentTime: getCurrentDateTime(),
      path: '/affirmations',
      user: process.env.USER_LOGIN || '67991023'
    });
  }
});

// Health check route
app.get('/api/status', (req, res) => {
  try {
    const dbStatus = mongoose.connection.readyState;
    const dbStatusText = ['Disconnected', 'Connected', 'Connecting', 'Disconnecting'][dbStatus];
    
    res.json({
      status: 'ok', 
      message: 'API is working',
      timestamp: new Date().toISOString(),
      currentTime: getCurrentDateTime(),
      db_status: dbStatusText,
      environment: process.env.NODE_ENV || 'development'
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
});

// 404 handler
app.use((req, res, next) => {
  res.status(404).render('error', { 
    title: 'Page Not Found - MoodTrack', 
    message: 'The page you requested does not exist.',
    currentTime: getCurrentDateTime(),
    path: req.path,
    user: process.env.USER_LOGIN || '67991023'
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).render('error', { 
    title: 'Server Error - MoodTrack', 
    message: 'Something went wrong on our end. Please try again later.',
    currentTime: getCurrentDateTime(),
    path: req.path,
    error: process.env.NODE_ENV === 'development' ? err : {},
    user: process.env.USER_LOGIN || '67991023'
  });
});

// Start server
console.log('Starting server on port', PORT);
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

// Export for Vercel serverless deployment
module.exports = app;