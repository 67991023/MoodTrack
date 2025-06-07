/*
const mongoose = require('mongoose')
const AffirmationSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  content: {
    type: String,
    required: true
  },
  favorite: {
    type: Boolean,
    default: false
  },
  date:{
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Affirmation', AffirmationSchema);
*/
const mongoose = require('mongoose');

const AffirmationSchema = new mongoose.Schema({
  text: {
    type: String,
    required: [true, 'Please add affirmation text'],
    maxlength: [200, 'Affirmation cannot be more than 200 characters']
  },
  category: {
    type: String,
    enum: ['Confidence', 'Gratitude', 'Mindfulness', 'Personal Growth', 'Relationships', 'General'],
    default: 'General'
  },
  active: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Affirmation = mongoose.model('Affirmation', AffirmationSchema);
module.exports = Affirmation;