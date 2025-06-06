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