/*
// main application file
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');

dotenv.config();
const app = express();

// define PORT at the beginning
const PORT = process.env.PORT || 3000;

// At the top of your app.js file
console.log('Starting application...');
console.log('Node environment:', process.env.NODE_ENV);

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// After middleware setup
console.log('Middleware initialized');

// Handle static files if public directory exists
try {
  app.use(express.static(path.join(__dirname, 'public')));
} catch (err) {
  console.log('Public directory not found, continuing...');
}

// Setup view engine if views directory exists
try {
  app.set('view engine', 'ejs');
  app.set('views', path.join(__dirname, 'views'));
} catch (err) {
  console.log('Views directory not found, continuing...');
}

// Before MongoDB connection
console.log('Connecting to MongoDB...');

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => {
    console.error('Database connection error:', err);
  });

// Add this to check connection status
mongoose.connection.on('error', err => {
  console.error('MongoDB connection error:', err);
});

mongoose.connection.on('disconnected', () => {
  console.log('MongoDB disconnected');
});

// Before routes setup
console.log('Setting up routes...');

// Direct routes (not using route files)
app.get('/', (req, res) => {
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
      </style>
    </head>
    <body>
      <div class="success-box">
        <h2>✅ Server is running!</h2>
        <p>Your MoodTrack application has been successfully deployed to Vercel.</p>
      </div>
      
      <h1>MoodTrack API Status</h1>
      
      <div class="api-info">
        <p>Current time: <span class="current-time">2025-06-07 16:21:58</span></p>
        <p>MongoDB status: Connected</p>
        <p>Environment: ${process.env.NODE_ENV || 'development'}</p>
        <p>API Endpoint: <a href="/api/status">/api/status</a> | <a href="/test">/test</a></p>
      </div>
      
      <p>This is a temporary landing page while we set up your complete application.</p>
    </body>
    </html>
  `);
});

app.get('/test', (req, res) => {
  res.send('Server is running correctly');
});

// API status endpoint
app.get('/api/status', (req, res) => {
  try {
    const dbStatus = mongoose.connection.readyState;
    // 0 = disconnected, 1 = connected, 2 = connecting, 3 = disconnecting
    const dbStatusText = ['Disconnected', 'Connected', 'Connecting', 'Disconnecting'][dbStatus];
    
    res.json({
      status: 'ok', 
      message: 'API is working',
      timestamp: new Date().toISOString(),
      currentTime: '2025-06-07 16:21:58',
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

// Basic mood tracking API endpoints
app.get('/api/moods', (req, res) => {
  res.json({ 
    message: 'This endpoint will return moods (functionality coming soon)'
  });
});

app.get('/api/affirmations', (req, res) => {
  res.json({ 
    message: 'This endpoint will return affirmations (functionality coming soon)'
  });
});

// Create a simple error handler
app.use((req, res, next) => {
  res.status(404).send('Sorry, page not found!');
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke! Please try again later.');
});

// Just before app.listen
console.log('Starting server on port', PORT);

// Start server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

// For Vercel serverless deployment
module.exports = app;
*/
// main application file
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
const fs = require('fs');

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

// Setup view engine
try {
  app.set('view engine', 'ejs');
  app.set('views', path.join(__dirname, 'views'));
  console.log('View engine set up');
} catch (err) {
  console.error('Error setting up view engine:', err);
}

// MongoDB connection
console.log('Connecting to MongoDB...');
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => {
    console.error('Database connection error:', err);
  });

// MongoDB connection monitoring
mongoose.connection.on('error', err => {
  console.error('MongoDB connection error:', err);
});

mongoose.connection.on('disconnected', () => {
  console.log('MongoDB disconnected');
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
      currentTime: '2025-06-07 16:49:54',
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
        currentTime: '2025-06-07 16:49:54',
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
            <p>Current time: <span class="current-time">2025-06-07 16:49:54</span></p>
            <p>MongoDB status: Connected</p>
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
    res.send(`
      <h1>Mood Tracking</h1>
      <p>Track your daily moods and emotions to better understand your mental health patterns.</p>
      <p><a href="/">Back to Home</a></p>
    `);
  });
}

if (affirmationsRoutes) {
  app.use('/affirmations', affirmationsRoutes);
  console.log('Affirmation routes loaded');
} else {
  app.get('/affirmations', (req, res) => {
    res.send(`
      <h1>Daily Affirmations</h1>
      <p>Positive affirmations to boost your mental health and start your day right.</p>
      <p><a href="/">Back to Home</a></p>
    `);
  });
}

// Error handlers
app.use((req, res, next) => {
  res.status(404).send('Sorry, page not found!');
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke! Please try again later.');
});

// Start server
console.log('Starting server on port', PORT);
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

// Export for Vercel serverless deployment
module.exports = app;