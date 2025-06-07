/*
//main application file
const express = require('express'); //import express.js
const mongoose = require('mongoose'); //import mongoose for Object data modeling
const path = require('path'); //import path for file path manipulation
const dotenv = require('dotenv'); //import dotenv package loads environment variables from a .env file into process.env
const cookieParser = require('cookie-parser'); //import cookie-parser for parsing cookies

dotenv.config(); //Load environment variables
const app = express(); //Initialize express that represents web server

// At the top of your app.js file
console.log('Starting application...');
console.log('Node environment:', process.env.NODE_ENV);

// After middleware setup
console.log('Middleware initialized');

// Before MongoDB connection
console.log('Connecting to MongoDB...');

// Before routes setup
console.log('Setting up routes...');

// Just before app.listen
console.log('Starting server on port', PORT);

//Middleware
app.use(express.json()); //parses incoming requests with JSON payloads
app.use(express.urlencoded({ extended: true })); //Adds middleware that parses incoming requests with URL-encoded payloads
app.use(cookieParser()); //add the cookie-parser to parse Cookie header and populate req.cookies with an object keyed by cookie names.
app.use(express.static(path.join(__dirname, 'public'))); //serves static files from 'public' directory.
//'__dirname' is the current directory where the script is running.

app.set('view engine', 'ejs'); //set embedded javascript as the template engine for rendering dynamic HTML pages.
app.set('views', path.join(__dirname, 'views'));

mongoose
    .connect(process.env.MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        serverSelectionTimeoutMS: 5000,
    }) //connect to database
    .then(() => console.log('Connected to MongoDB')) //if connected, log to console
    .catch((err) => {
        console.error('Database connection error:', err);
    }); //if not connected, log the error to console

// Add this to check connection status
mongoose.connection.on('error', err => {
  console.error('MongoDB connection error:', err);
});

mongoose.connection.on('disconnected', () => {
  console.log('MongoDB disconnected');
});

//routes
// Add this at the top of your routes section
app.get('/test', (req, res) => {
  res.send('Server is running correctly');
});

// Add an improved API status endpoint
app.get('/api/status', (req, res) => {
  try {
    const dbStatus = mongoose.connection.readyState;
    // 0 = disconnected, 1 = connected, 2 = connecting, 3 = disconnecting
    const dbStatusText = ['Disconnected', 'Connected', 'Connecting', 'Disconnecting'][dbStatus];
    
    res.json({
      status: 'ok',
      message: 'API is working',
      timestamp: new Date().toISOString(),
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
app.use('/', require('./routes/index')); //Mounts the index router on the root path ('/') (handles routes like homepage and dashboard)
app.use('/moods', require('./routes/moods')); //mounts the moods router (handles mood tracking)
app.use('/affirmations', require('./routes/affirmations')); //mounts the affirmations (handles affirmations-related functionality)

// API status endpoint for testing connectivity
app.get('/api/status', (req, res) => {
  res.json({ 
    status: 'ok', 
    message: 'API is working'
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

//start server
const PORT = process.env.PORT || 3000; //set port to environment variable or default to 3000
app.listen(PORT, () => console.log(`Server running on port ${PORT}`)); //starts express server on the port 3000
// */
//main application file
const express = require('express'); //import express.js
const mongoose = require('mongoose'); //import mongoose for Object data modeling
const path = require('path'); //import path for file path manipulation
const dotenv = require('dotenv'); //import dotenv package loads environment variables from a .env file into process.env
const cookieParser = require('cookie-parser'); //import cookie-parser for parsing cookies

dotenv.config(); //Load environment variables
const app = express(); //Initialize express that represents web server

//define PORT at the beginning
const PORT = process.env.PORT || 3000;

// At the top of your app.js file
console.log('Starting application...');
console.log('Node environment:', process.env.NODE_ENV);

//Middleware
app.use(express.json()); //parses incoming requests with JSON payloads
app.use(express.urlencoded({ extended: true })); //Adds middleware that parses incoming requests with URL-encoded payloads
app.use(cookieParser()); //add the cookie-parser to parse Cookie header and populate req.cookies with an object keyed by cookie names.
app.use(express.static(path.join(__dirname, 'public'))); //serves static files from 'public' directory.
//'__dirname' is the current directory where the script is running.

// After middleware setup
console.log('Middleware initialized');

app.set('view engine', 'ejs'); //set embedded javascript as the template engine for rendering dynamic HTML pages.
app.set('views', path.join(__dirname, 'views'));

// Before MongoDB connection
console.log('Connecting to MongoDB...');

mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 5000,
  }) //connect to database
  .then(() => console.log('Connected to MongoDB')) //if connected, log to console
  .catch((err) => {
    console.error('Database connection error:', err);
  }); //if not connected, log the error to console

// Add this to check connection status
mongoose.connection.on('error', err => {
  console.error('MongoDB connection error:', err);
});

mongoose.connection.on('disconnected', () => {
  console.log('MongoDB disconnected');
});

// Before routes setup
console.log('Setting up routes...');

//routes
// Add this at the top of your routes section
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
      currentTime: '2025-06-07 11:52:32',
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

app.use('/', require('./routes/index')); //Mounts the index router on the root path ('/')
app.use('/moods', require('./routes/moods')); //mounts the moods router
app.use('/affirmations', require('./routes/affirmations')); //mounts the affirmations

// Create a simple error handler
app.use((req, res, next) => {
  res.status(404).send('Sorry, page not found!');
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke! Please try again later.');
});

// Just before app.listen (now PORT is defined before this)
console.log('Starting server on port', PORT);

//start server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`)); //starts express server