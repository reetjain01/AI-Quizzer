// models/quizModel.js
const mongoose = require("mongoose");

const quizSchema = new mongoose.Schema({
  subject: { 
    type: String, 
    required: true 
},
  difficulty: { 
    type: String, 
    required: true 
},
  maxMarks: { 
    type: Number, 
    required: true 
},
  grade: { 
    type: Number, 
    default: 0 
},
  questions: [{ 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Question' 
}],
});

const Quiz = mongoose.model("Quiz", quizSchema);
module.exports = Quiz;
