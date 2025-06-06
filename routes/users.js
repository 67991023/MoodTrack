const express = require('express'); //back end web app framework for building RESTful APIs
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/user.js'); //import user model
// @rou// @route   POST /users/register
// @desc    Register a new user
router.post('/register', async (req, res) => {
    try {
        const { name, email, password } = req.body;
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ error: 'Email already exists' });
        }
        user = new User({ name, email, password });
        await user.save();
        const token = jwt.sign({ userId: user._id }, process.env.SECRET_KEY, { 
          expiresIn: '30d'     
        });
        res.cookie('token', token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          maxAge: 30 * 24 * 60 * 60 * 1000 // 30 days
        });
        res.redirect('/dashboard'); //redirects the user to dashboard pae after successful registration
      } catch (err) {
        console.error(err);
        res.render('register', {error: 'Server error' }) // sending responses back to the client.
      }
    });

// @route POST /users/login
// @desc Login user
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body; //req.body takes the email and password values from the data received in the request and puts them into the email and password variables
    // find user
    const user = await User.findOne({ email });
    if (!user) { // if not fond return an error.
      return res.render('login', { error: 'Invalid credentials' });
    }
    // Check password
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.render('login', {error: 'Invalid credentials' });
    }
    // Generate token and set cookie
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { //create JWT for authenticated user
      expiresIn: '30d'
    });
    res.cookie('token', token, { //sets the authentication cookie
      httpOnly: true, 
      secure: process.env.NODE_ENV === 'production',
      maxAge: 30 * 24 * 60 * 60 * 1000
    });
    res.redirect('/dashboard');
  } catch (err) {
    console.error(err);
    res.render('login', { error: 'Server error' });
  }
});

// @route GET /users/logout
// @desc Logout user
router.get('/logout', (req, res) => { //logs out the user by clearing the token cookie
  res.cookie('token', '', {
    httpOnly: true,
    expires: new Date(0)
  });
  res.redirect('/'); //redirect to home page
});

module.exports = router;