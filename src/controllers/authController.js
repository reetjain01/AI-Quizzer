// controllers/userController.js
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Submission = require('../models/Submission');

// User registration
const register = async (req, res) => {
  const { userName, password, email } = req.body;

  console.log('Incoming request body:', req.body); // Log the request body to debug

  try {
    if (!userName || !password || !email) {
      return res.status(400).json({ message: 'Some user details are missing!' });
    }

    const newUser = await User.create({ userName, password, email });
    const token = jwt.sign({ userId: newUser._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    return res.status(201).json({ message: 'User registered successfully', token });
  } catch (error) {
    console.error('Error registering user:', error);
    return res.status(500).json({ message: 'Server error during registration', error });
  }
};


// User login
const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    if (!email || !password) {
      return res.status(400).json({ message: 'Some user details are missing!' });
    }

    const existingUser = await User.findOne({ email });
    if (!existingUser || !(await existingUser.matchPassword(password))) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ userId: existingUser._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    return res.status(200).json({ message: 'Login successful', token });
  } catch (error) {
    console.error('Error logging in user:', error);
    return res.status(500).json({ message: 'Server error during login', error });
  }
};

// Retrieve past quiz submissions for a user
const retrievePastData = async (req, res) => {
  const userId = req.user.userId; // Assuming the userId is available in req.user from the JWT

  try {
    const pastSubmissions = await Submission.find({ userId }).populate("quizId", "subject maxMarks grade");

    if (!pastSubmissions.length) {
      return res.status(404).json({ message: "No past submissions found" });
    }

    return res.status(200).json({ pastSubmissions });
  } catch (error) {
    console.error("Error retrieving past data:", error);
    return res.status(500).json({ message: "Failed to retrieve past submissions", error });
  }
};

module.exports = { register, login, retrievePastData };
