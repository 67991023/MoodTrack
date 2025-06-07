/*
const mongoose = require('mongoose');
const MoodSchema = new mongoose.Schema({ //creates new mongoose schema for mood model
    user: { //Defines a 'user' field that stores a reference to a User document
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    rating: { //Defines a 'rating' field that stores a number between 1 and 10
        type: Number,
        required: true,
        min: 1,
        max: 10
    },
    notes: { 
        type: String
    },
    factors: [{ //defines factors as an array, each string represents a factor that affected the user's mood.
        type: String
    }],
    date: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Mood', MoodSchema); //exports the Mood model
*/
const mongoose = require('mongoose');

const MoodSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  },
  mood: {
    type: String,
    required: [true, 'Please select a mood'],
    enum: ['Happy', 'Sad', 'Angry', 'Anxious', 'Calm', 'Energetic', 'Tired']
  },
  intensity: {
    type: Number,
    required: [true, 'Please rate the intensity of your mood'],
    min: 1,
    max: 10
  },
  activities: {
    type: [String],
    default: []
  },
  note: {
    type: String,
    maxlength: 500
  }
}, {
  timestamps: true
});

// Virtual for formatted date
MoodSchema.virtual('formattedDate').get(function() {
  return this.date.toISOString().split('T')[0];
});

const Mood = mongoose.model('Mood', MoodSchema);
module.exports = Mood;