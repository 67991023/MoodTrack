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