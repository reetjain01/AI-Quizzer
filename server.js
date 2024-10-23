const express = require("express");
const cors = require("cors");
const userRouter = require("./src/routes/authRoutes");
const quizRouter = require("./src/routes/quizRoutes");
const connectDB = require("./src/db/connectDB");
require("dotenv").config();

const app = express();

app.use(express.json());
app.use(cors());

connectDB();

// user routes
app.use("/user", userRouter);

//Quiz routes
app.use("/quiz", quizRouter);

app.get("/", (req, res) => {
  return res.send("Hello from PlayPower Lab Server (21BCP221 - Reet) !!!!");
});

app.listen(5000, () => {
  console.log("Listening at port 5000!");
});
