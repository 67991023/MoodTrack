/*
const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth.js'); //import protect middleware for authentication

const Mood = require('../models/Mood.js');

// @route   GET /moods
// @desc    Get all user moods
router.get('/', protect, async (req, res) => { //Defines a protected route for getting all moods. The protect middleware ensures only authenticated users can access this route.
    try {
        const moods = await Mood.find({ user: req.user.id }).sort({ date: -1 }); //sort the mood entries by date in descending order
        res.render('moods/index', { moods });
        } catch (err) {
            console.error(err);
            res.status(500).render('error', { message: 'Server Error' });
        }
    });

// @route   GET /moods/analytics
// @desc    Show mood analytics
router.get('/analytics', protect, async (req, res) => {
  try {
    // Get all user moods sorted by date
    const moods = await Mood.find({ user: req.user.id }).sort({ date: 1 });
    
    // Calculate average mood
    const totalRating = moods.reduce((sum, mood) => sum + mood.rating, 0);
    const averageMood = moods.length > 0 ? (totalRating / moods.length).toFixed(1) : 0;
    
    // Get dates and ratings for chart
    const moodDates = moods.map(mood => new Date(mood.date).toLocaleDateString());
    const moodRatings = moods.map(mood => mood.rating);
    
    // Count mood factors frequency
    const factorCounts = {};
    moods.forEach(mood => {
      mood.factors.forEach(factor => {
        factorCounts[factor] = (factorCounts[factor] || 0) + 1;
      });
    });
    
    res.render('moods/analytics', {
      averageMood,
      moodDates,
      moodRatings,
      factorCounts
    });
  } catch (err) {
    console.error(err);
    res.status(500).render('error', { message: 'Server Error' });
  }
});

module.exports = router;
*/
const express = require('express');
const router = express.Router();

// List all moods
router.get('/', (req, res) => {
  res.render('moods/index', { 
    title: 'Your Mood History',
    currentTime: '2025-06-07 16:49:54',
    moods: [
      { date: '2025-06-07', mood: 'Happy', intensity: 8, note: 'Had a great day!' },
      { date: '2025-06-06', mood: 'Anxious', intensity: 6, note: 'Work deadline approaching' },
      { date: '2025-06-05', mood: 'Calm', intensity: 7, note: 'Meditated in the morning' }
    ]
  });
});

// Form to create a new mood entry
router.get('/new', (req, res) => {
  res.render('moods/new', { 
    title: 'Record New Mood',
    currentTime: '2025-06-07 16:49:54',
    moodOptions: ['Happy', 'Sad', 'Angry', 'Anxious', 'Calm', 'Energetic', 'Tired']
  });
});

// Create a new mood entry
router.post('/', (req, res) => {
  console.log('New mood submission:', req.body);
  // In a real app, this would save to the database
  res.redirect('/moods');
});

// View a single mood entry
router.get('/:id', (req, res) => {
  res.render('moods/view', {
    title: 'View Mood Entry',
    currentTime: '2025-06-07 16:49:54',
    mood: {
      id: req.params.id,
      date: '2025-06-07',
      mood: 'Happy',
      intensity: 8,
      note: 'Had a great day!'
    }
  });
});

module.exports = router;