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