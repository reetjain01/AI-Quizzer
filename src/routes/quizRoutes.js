const express = require('express');
const authMiddleware = require('../middlewares/authMiddleware'); // Import authMiddleware
const { generateQuiz, submitQuiz, getQuizById, getHintForQuestion } = require('../controllers/quizController');

const quizRouter = express.Router();

// Generate a quiz (protected by authMiddleware)
quizRouter.post('/generate', authMiddleware, generateQuiz);

// Submit quiz responses (protected by authMiddleware)
quizRouter.post('/submit', authMiddleware, submitQuiz);

// Get a specific quiz by ID (protected by authMiddleware)
quizRouter.get('/:id', authMiddleware, getQuizById);

// Get hint for a specific question in a quiz (protected by authMiddleware)
quizRouter.get('/hint/:quizId/:queId', authMiddleware,getHintForQuestion);

module.exports = quizRouter;
