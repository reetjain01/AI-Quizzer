const Groq = require("groq-sdk");
const Submission = require("../models/Submission");
const Quiz = require("../models/Quiz")
const Question = require("../models/Question")

const groq = new Groq({
  apiKey: "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",
});


// Generate a quiz using AI
const generateQuiz = async (req, res) => {
  const { grade, subject, difficulty, maxMarks, questions } = req.body;

  try {
    // Limiting the number of questions that can be generated.
    if (questions > 10) {
      return res.status(400).json({ message: "Maximum 10 questions allowed" });
    }

    // Define the schema for quiz generation
    const quizSchema = {
      subject,
      difficulty,
      maxMarks,
      grade,
      questions: Array.from({ length: questions }, () => ({
        statement: "Sample question statement",
        options: ["Option A", "Option B", "Option C", "Option D"],
        correctAns: "Option A", // Default for example
        hint: "Hint for the question",
        marks: Math.floor(Math.random() * 5) + 1,
      })),
    };

    // Request quiz generation from Groq AI
    const chatCompletion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: `Generate a quiz in JSON format with the following details: ${JSON.stringify(
            quizSchema,
            null,
            4
          )}`,
        },
      ],
      model: "llama3-8b-8192",
      temperature: 0,
      response_format: { type: "json_object" },
    });

    const generatedQuiz = chatCompletion.choices[0].message.content;
    console.log("Generated Quiz Response:", generatedQuiz);

    // Ensure the response is parsed correctly
    const quizData = typeof generatedQuiz === 'string' ? JSON.parse(generatedQuiz) : generatedQuiz;

    // Check if questions are defined and an array
    if (!quizData.questions || !Array.isArray(quizData.questions)) {
      return res.status(500).json({ message: "Invalid quiz structure returned", error: quizData });
    }

    // Create Question documents
    const questionIds = await Promise.all(
      quizData.questions.map(async (questionData) => {
        const newQuestion = await Question.create(questionData);
        return newQuestion._id;
      })
    );

    // Create Quiz document with references to Question IDs
    const newQuiz = await Quiz.create({
      subject: quizData.subject,
      difficulty: quizData.difficulty,
      maxMarks: quizData.maxMarks,
      grade: quizData.grade,
      questions: questionIds,
    });

    return res.status(201).json({ message: "Quiz generated successfully", quiz: newQuiz });
  } catch (error) {
    console.error("Error generating quiz:", error);
    return res.status(500).json({ message: "Failed to generate quiz", error: error.message });
  }
};


// Submit quiz responses and calculate score
const submitQuiz = async (req, res) => {
  const { quizId, responses } = req.body;
  const userID = req.user.userId; // Assuming userId is set from JWT middleware

  try {
    const originalQuiz = await Quiz.findById(quizId);
    if (!originalQuiz) {
      return res.status(404).json({ message: "Quiz not found" });
    }

    let totalScore = 0;

    responses.forEach((response) => {
      const question = originalQuiz.questions.find(
        (q) => q._id.toString() === response.questionId.toString()
      );
      if (question && question.correctAns === response.userResponse) {
        totalScore += question.marks;
      }
    });

    const submission = await Submission.create({
      userId: userID, // Use the userId extracted from JWT
      quizId,
      finalScore: totalScore,
    });

    return res.status(200).json({ message: "Quiz submitted successfully", submission });
  } catch (error) {
    console.error("Error submitting quiz:", error);
    return res.status(500).json({ message: "Failed to submit quiz", error });
  }
};



// Fetch a specific quiz by ID
const getQuizById = async (req, res) => {
  const quizId = req.params.id;

  try {
    const quiz = await Quiz.findById(quizId).populate('questions');
    if (!quiz) {
      return res.status(404).json({ message: "Quiz not found" });
    }

    return res.status(200).json(quiz);
  } catch (error) {
    console.error("Error fetching quiz:", error);
    return res.status(500).json({ message: "Failed to fetch quiz", error });
  }
};


// Get hint for a specific question in a quiz
const getHintForQuestion = async (req, res) => {
  const { quizId, queId } = req.params;

  try {
    const quiz = await Quiz.findById(quizId);
    if (!quiz) {
      return res.status(404).json({ message: "Quiz not found" });
    }

    const question = quiz.questions.find((q) => q._id.toString() === queId);
    if (!question) {
      return res.status(404).json({ message: "Question not found" });
    }

    return res.status(200).json({ hint: question.hint });
  } catch (error) {
    console.error("Error fetching hint:", error);
    return res.status(500).json({ message: "Failed to fetch hint", error });
  }
};

module.exports = {
  generateQuiz,
  submitQuiz,
  getQuizById,
  getHintForQuestion,
};
