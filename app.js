require("dotenv").config();

const express = require("express");
const app = express();

const connectDB = require("./connect");

const port = process.env.PORT || 5000;

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello world");
});

app.post("/contact", (req, res) => {
  const data = req.body;
  console.log(data);
  res.send("Data stored");
});

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    app.listen(port, () => console.log(`App started listening at ${port}`));
  } catch (error) {
    console.log("The error is", error);
  }
};

start();
