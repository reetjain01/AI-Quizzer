// models/questionModel.js
const mongoose = require("mongoose");

const questionSchema = new mongoose.Schema({
  statement: {
    type: String,
    required: true,
  },
  options: [
    {
      type: String,
      required: true,
    },
  ],
  marks: {
    type: Number,
    required: true,
  },
  correctAns: {
    type: String,
    required: true,
  },
  hint: {
    type: String,
  },
});

const Question = mongoose.model("Question", questionSchema);
module.exports = Question;
