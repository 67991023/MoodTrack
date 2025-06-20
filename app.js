// main application file
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
const fs = require('fs');
const expressLayouts = require('express-ejs-layouts');

// Load environment variables
dotenv.config();
const app = express();

// Define PORT at the beginning
const PORT = process.env.PORT || 3000;

// Application startup logs
console.log('Starting application...');
console.log('Node environment:', process.env.NODE_ENV);

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
console.log('Middleware initialized');

// Handle static files
try {
  app.use(express.static(path.join(__dirname, 'public')));
  console.log('Static files middleware set up');
} catch (err) {
  console.error('Error setting up static files:', err);
}

// Setup view engine with layouts
try {
  app.use(expressLayouts);
  app.set('layout', 'layout/main');
  app.set('view engine', 'ejs');
  app.set('views', path.join(__dirname, 'views'));
  console.log('View engine set up');
} catch (err) {
  console.error('Error setting up view engine:', err);
}

// MongoDB connection - UPDATED
console.log('Connecting to MongoDB Atlas...');

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

// Connect to MongoDB Atlas with fallback
mongoose
  .connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/moodtrack', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 5000 // 5 second timeout for server selection
  })
  .then(() => console.log('Connected to MongoDB Atlas'))
  .catch((err) => {
    console.error('Database connection error:', err);
    
    // Try in-memory MongoDB if Atlas connection fails and we're in development
    if (process.env.NODE_ENV !== 'production') {
      console.log('Attempting to use in-memory MongoDB for development...');
      
      // Note: You would need to install mongodb-memory-server for this to work
      // This is just placeholder code to show the concept
      console.log('Please install mongodb-memory-server or fix your MongoDB connection');
    }
  });

// MongoDB connection monitoring
mongoose.connection.on('error', err => {
  console.error('MongoDB connection error:', err);
});

mongoose.connection.on('disconnected', () => {
  console.log('MongoDB disconnected');
});

mongoose.connection.on('connected', () => {
  console.log('MongoDB reconnected');
});

// Function to safely require route files
function safeRequire(filePath) {
  try {
    console.log(`Attempting to require: ${filePath}`);
    if (fs.existsSync(path.join(__dirname, `${filePath}.js`))) {
      return require(filePath);
    } else {
      console.log(`File not found: ${filePath}.js`);
      return null;
    }
  } catch (error) {
    console.error(`Error requiring ${filePath}:`, error);
    return null;
  }
}

// Load routes
console.log('Setting up routes...');
const indexRoutes = safeRequire('./routes/index');
const moodRoutes = safeRequire('./routes/moods');
const affirmationsRoutes = safeRequire('./routes/affirmations');

// Health check routes
app.get('/test', (req, res) => {
  res.send('Server is running correctly');
});

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
      message: error.message,
      stack: process.env.NODE_ENV === 'production' ? '🥞' : error.stack
    });
  }
});

// Register route handlers
if (indexRoutes) {
  app.use('/', indexRoutes);
  console.log('Index routes loaded');
} else {
  // Fallback for index route
  app.get('/', (req, res) => {
    try {
      res.render('index', { 
        title: 'MoodTrack',
        currentTime: getCurrentDateTime(),
        path: '/',
        user: process.env.USER_LOGIN || '67991023' 
      });
    } catch (err) {
      res.send(`
        <!DOCTYPE html>
        <html>
        <head>
          <title>MoodTrack</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              max-width: 800px;
              margin: 0 auto;
              padding: 20px;
              line-height: 1.6;
            }
            .success-box {
              background-color: #d4edda;
              color: #155724;
              padding: 15px;
              border-radius: 5px;
              margin-bottom: 20px;
            }
            h1 {
              color: #343a40;
            }
            .api-info {
              background-color: #f8f9fa;
              padding: 15px;
              border-radius: 5px;
              border-left: 5px solid #007bff;
            }
            .current-time {
              font-weight: bold;
              color: #007bff;
            }
            .navigation {
              margin: 20px 0;
              display: flex;
              gap: 15px;
            }
            .navigation a {
              padding: 10px 15px;
              background-color: #007bff;
              color: white;
              text-decoration: none;
              border-radius: 5px;
            }
          </style>
        </head>
        <body>
          <div class="success-box">
            <h2>✅ Server is running!</h2>
            <p>Your MoodTrack application has been successfully deployed.</p>
          </div>
          
          <h1>MoodTrack App</h1>
          
          <div class="navigation">
            <a href="/moods">View Moods</a>
            <a href="/affirmations">Daily Affirmations</a>
            <a href="/api/status">API Status</a>
          </div>
          
          <div class="api-info">
            <p>Current time: <span class="current-time">${getCurrentDateTime()}</span></p>
            <p>MongoDB status: ${mongoose.connection.readyState ? 'Connected' : 'Disconnected'}</p>
            <p>Environment: ${process.env.NODE_ENV || 'development'}</p>
            <p>User: ${process.env.USER_LOGIN || '67991023'}</p>
          </div>
        </body>
        </html>
      `);
    }
  });
}

if (moodRoutes) {
  app.use('/moods', moodRoutes);
  console.log('Mood routes loaded');
} else {
  app.get('/moods', (req, res) => {
    res.render('moods/index', { 
      title: 'Mood Tracking',
      currentTime: getCurrentDateTime(),
      path: '/moods',
      moods: []
    });
  });
  
  app.get('/moods/new', (req, res) => {
    res.render('moods/new', { 
      title: 'Record New Mood',
      currentTime: getCurrentDateTime(),
      path: '/moods',
      moodOptions: ['Happy', 'Sad', 'Angry', 'Anxious', 'Calm', 'Energetic', 'Tired']
    });
  });
}

if (affirmationsRoutes) {
  app.use('/affirmations', affirmationsRoutes);
  console.log('Affirmation routes loaded');
} else {
  app.get('/affirmations', (req, res) => {
    res.render('affirmations/index', {
      title: 'Daily Affirmations',
      currentTime: getCurrentDateTime(),
      path: '/affirmations',
      today: getCurrentDateTime().split(' ')[0],
      dailyAffirmation: "I am worthy of love and respect. My feelings are valid and I deserve to take care of myself."
    });
  });
  
  app.get('/dashboard', (req, res) => {
    res.render('dashboard', {
      title: 'Your Wellness Dashboard',
      currentTime: getCurrentDateTime(),
      path: '/dashboard',
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
}

// 404 handler
app.use((req, res, next) => {
  res.status(404).render('error', { 
    title: 'Page Not Found', 
    message: 'The page you requested does not exist.',
    currentTime: getCurrentDateTime(),
    path: req.path
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).render('error', { 
    title: 'Server Error', 
    message: 'Something went wrong on our end. Please try again later.',
    currentTime: getCurrentDateTime(),
    path: req.path,
    error: process.env.NODE_ENV === 'development' ? err : {}
  });
});

// Start server
console.log('Starting server on port', PORT);
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

// Export for Vercel serverless deployment
module.exports = app;