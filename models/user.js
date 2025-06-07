/*
const mongoose = require('mongoose'); // Import mongoose for MongoDB object modeling
const bcrypt = require('bcryptjs'); // Import bcrypt for password hashing
const UserSchema = new mongoose.Schema({ // schema defines the structure of documents in a MongoDB
    name: { //defines a field in the schema
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true // ensures that each email is unique
    },
    password: {
        type: String,
        required: true
    },
    TimeCreated: {
        type: Date,
        default: Date.now // automatically sets the current date and time when a new document is created
    }
});

//async ทำงานโดยต้องรอ task ก่อนหน้าเสร็จ
// Hash password before saving
UserSchema.pre('save', async function (next) { 
    if (!this.isModified('password')) return next();
    const salt = await bcrypt.genSalt(10); // make hash unique even if two users have the same password
    this.password = await bcrypt.hash(this.password, salt);
    next();
})

//Check if entered password matches stored hash 
UserSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password); //Uses bcrypt to compare a plain text password with the stored hash and returns true if they match
};

module.exports = mongoose.model('User', UserSchema); //Creates and exports a Mongoose model named 'User' from the schema
//This model is used to interact with the 'users' collection in MongoDB
*/
const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a name']
  },
  email: {
    type: String,
    required: [true, 'Please add an email'],
    unique: true,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      'Please add a valid email'
    ]
  },
  password: {
    type: String,
    required: [true, 'Please add a password'],
    minlength: 6,
    select: false
  },
  preferences: {
    darkMode: {
      type: Boolean,
      default: false
    },
    notifications: {
      type: Boolean,
      default: true
    }
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const User = mongoose.model('User', UserSchema);
module.exports = User;