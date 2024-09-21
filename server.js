const express = require("express");
const cors = require("cors");
const userRouter = require("../src/routes/authRoutes");
const quizRouter = require("../src/routes/quizRoutes");
const connectDB = require("../src/db/connectDB");
require('dotenv').config();

const app = express();

app.use(express.json());
app.use(cors());

connectDB();

// User routes
app.use("/user", userRouter);

// Quiz routes
app.use("/quiz", quizRouter);

app.get("/", (req, res) => {
  return res.send("PlayPower Lab Welcomes you :)");
});

// Export the app as a serverless function
module.exports = app;
