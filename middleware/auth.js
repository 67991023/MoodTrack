const jwt = require('jsonwebtoken'); //imports jsonwebtoken library for creating and verifying JSON Web Tokens
const User = require('../models/User.js'); //got error when chat user.js to User
const protect = async (req, res, next) => {
    try {
        const token = req.cookies.token; //get token from cookies
        //extracts the JWT from the token cookie in the request.
        if (!token) {
            return res.status(401).redirect('/login'); //if no token return 401
        }
        //a67b3c9d2e5f8g1h4i7j0k3l6m9n2o5p8q1r4s7t0u3v6w9x2y5z8
        const decoded = jwt.verify(token, process.env.JWT_SECRET); //verify JWT using JWT_SECRET. If JWT is valid, it decodes the token payload.
        req.user = await User.findById(decoded.id).select('-password'); //Uses the user ID from the decoded token to fetch the user from the database. The '.select('-password')' excludes the password field for security.
        next();
        } catch (error) {
            console.error(error);
            res.status(401).redirect('/login');
    }
};

module.exports = { protect }; //exports the protect middleware function for use in route handlers.
/*
MongoDB Connection String

Key: MONGO_URI
Value: Your MongoDB connection string
Example format: mongodb+srv://username:password@cluster0.mongodb.net/moodtracker?retryWrites=true&w=majority

JWT Secret Key

Key: JWT_SECRET
Value: A secure random string
Example: a67b3c9d2e5f8g1h4i7j0k3l6m9n2o5p8q1r4s7t0u3v6w9x2y5z8

Node Environment

Key: NODE_ENV
Value: production
Port (Optional for Vercel but good practice)

Key: PORT
Value: 3000
 */