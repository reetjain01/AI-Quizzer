// controllers/mailController.js
const nodemailer = require("nodemailer");
const Groq = require("groq-sdk");
const User = require("../models/User");
const Quiz = require("../models/Quiz");

// Ethereal email service for testing
const transporter = nodemailer.createTransport({
  host: "smtp.ethereal.email",
  port: 587,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// console.log('GROQ_API_KEY:', process.env.GROQ_API_KEY);

const groq = new Groq({apiKey:"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"});

// Send suggestions based on incorrect quiz responses
const sendSuggestions = async (req, res) => {
  const { quizId, responses } = req.body;
  const userId = req.user.userId; // Assuming userId is extracted from the JWT token

  try {
    // Fetch user's email from the database
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const originalQuiz = await Quiz.findById(quizId);
    const wrongQuestions = [];

    // Identify incorrect responses and collect corresponding questions
    responses.forEach((response) => {
      const question = originalQuiz.questions.find(
        (q) => q._id.toString() === response.questionId.toString()
      );
      if (question && question.correctAns !== response.userResponse) {
        wrongQuestions.push(question.statement);
      }
    });

    // Request suggestions from Groq AI based on identified wrong questions
    const suggestionsRequest = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: "Generate suggestions for incorrect quiz responses",
        },
        { role: "user", content: `Questions I got wrong: ${wrongQuestions}` },
      ],
      model: "llama3-8b-8192",
      temperature: 0,
      stream: false,
      response_format: { type: "json_object" },
    });

    const suggestions = suggestionsRequest.choices[0].message.content;

    // Prepare email content with suggestions
    const formattedSuggestions = `
      Suggestions based on your quiz responses:\n\n
      1. ${suggestions["1"]}\n
      2. ${suggestions["2"]}\n
    `;

    // Send email
    const info = await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: user.email,
      subject: "Quiz Suggestions",
      text: formattedSuggestions,
    });

    return res
      .status(200)
      .json({
        message: "Suggestions sent successfully",
        messageId: info.messageId,
      });
  } catch (error) {
    console.error("Error sending suggestions:", error);
    return res
      .status(500)
      .json({ message: "Failed to send suggestions", error });
  }
};

module.exports = { sendSuggestions };
