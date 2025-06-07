/*
const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth.js');
const Affirmation = require('../models/Affirmation.js');

// @route   GET /affirmations
// @desc    Get all user affirmations
router.get('/', protect, async (req, res) => {
  try {
    const affirmations = await Affirmation.find({ user: req.user.id }).sort({ date: -1 });
    res.render('affirmations/index', { affirmations });
  } catch (err) {
    console.error(err);
    res.status(500).render('error', { message: 'Server Error' });
  }
});

// @route   GET /affirmations/new
// @desc    Show affirmation creation form
router.get('/new', protect, (req, res) => {
  res.render('affirmations/new');
});

// @route   POST /affirmations
// @desc    Create new affirmation
router.post('/', protect, async (req, res) => {
  try {
    const { content } = req.body;
    
    const newAffirmation = new Affirmation({
      user: req.user.id,
      content
    });
    
    await newAffirmation.save();
    res.redirect('/affirmations');
  } catch (err) {
    console.error(err);
    res.status(500).render('error', { message: 'Server Error' });
  }
});

// @route   PUT /affirmations/:id/favorite
// @desc    Toggle favorite status
router.put('/:id/favorite', protect, async (req, res) => {
  try {
    // Find affirmation
    const affirmation = await Affirmation.findById(req.params.id);
    
    if (!affirmation) {
      return res.status(404).json({ message: 'Affirmation not found' });
    }
    
    // Check user owns this affirmation
    if (affirmation.user.toString() !== req.user.id) {
      return res.status(401).json({ message: 'User not authorized' });
    }
    
    // Toggle favorite status
    affirmation.favorite = !affirmation.favorite;
    await affirmation.save();
    
    res.json(affirmation);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
});

// @route   GET /affirmations/random
// @desc    Get random affirmation
router.get('/random', protect, async (req, res) => {
  try {
    const count = await Affirmation.countDocuments({ user: req.user.id });
    const random = Math.floor(Math.random() * count);
    const affirmation = await Affirmation.findOne({ user: req.user.id }).skip(random);
    
    res.json(affirmation);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
});

module.exports = router;
*/
const express = require('express');
const router = express.Router();

// List of affirmations
router.get('/', (req, res) => {
  const affirmations = [
    "I am capable of achieving my goals.",
    "Every day is a new opportunity.",
    "I trust my intuition and inner wisdom.",
    "I am worthy of love and respect.",
    "I embrace challenges as opportunities for growth."
  ];
  
  res.render('affirmations/index', { 
    title: 'Daily Affirmations',
    currentTime: '2025-06-07 16:49:54',
    affirmations: affirmations,
    todaysAffirmation: affirmations[new Date().getDate() % affirmations.length]
  });
});

// Today's affirmation
router.get('/today', (req, res) => {
  const affirmations = [
    "I am capable of achieving my goals.",
    "Every day is a new opportunity.",
    "I trust my intuition and inner wisdom.",
    "I am worthy of love and respect.",
    "I embrace challenges as opportunities for growth."
  ];
  
  res.render('affirmations/today', { 
    title: "Today's Affirmation",
    currentTime: '2025-06-07 16:49:54',
    affirmation: affirmations[new Date().getDate() % affirmations.length]
  });
});

module.exports = router;