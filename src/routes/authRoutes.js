const express = require('express');
const authMiddleware = require('../middlewares/authMiddleware'); // Import authMiddleware
const { register, login, retrievePastData } = require('../controllers/authController');
const { sendSuggestions } = require('../controllers/emailServiceController');
const userRouter = express.Router();

// User registration
userRouter.post('/register', register);

// User login
userRouter.post('/login', login);

// Retrieve past quiz submissions (protected by authMiddleware)
userRouter.get('/retrieve', authMiddleware, retrievePastData);


//Result Mailing Route
userRouter.get("/mail",sendSuggestions);

module.exports = userRouter;
