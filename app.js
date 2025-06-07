//main application file
const express = require('express'); //import express.js
const mongoose = require('mongoose'); //import mongoose for Object data modeling
const path = require('path'); //import path for file path manipulation
const dotenv = require('dotenv'); //import dotenv package loads environment variables from a .env file into process.env
const cookieParser = require('cookie-parser'); //import cookie-parser for parsing cookies

dotenv.config(); //Load environment variables
const app = express(); //Initialize express that represents web server

//Middleware
app.use(express.json()); //parses incoming requests with JSON payloads
app.use(express.urlencoded({ extended: true })); //Adds middleware that parses incoming requests with URL-encoded payloads
app.use(cookieParser()); //add the cookie-parser to parse Cookie header and populate req.cookies with an object keyed by cookie names.
app.use(express.static(path.join(__dirname, 'public'))); //serves static files from 'public' directory.
//'__dirname' is the current directory where the script is running.

app.set('view engine', 'ejs'); //set embedded javascript as the template engine for rendering dynamic HTML pages.
app.set('views', path.join(__dirname, 'views'));

mongoose.connect(process.env.MONGO_URI) //connect to database
.then(() => console.log('Connected to MongoDB')) //if connected, log to console
.catch((err) => console.log('Database connection error:', err)); //if not connected, log the error to console

//routes
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

//start server
const PORT = process.env.PORT || 3000; //set port to environment variable or default to 3000
app.listen(PORT, () => console.log(`Server running on port ${PORT}`)); //starts express server on the port 3000