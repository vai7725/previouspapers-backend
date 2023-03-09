require("dotenv").config();

const express = require("express");
const cors = require("cors");
const app = express();

const connectDB = require("./connect");
const contact = require("./model/contactSchema");
const university = require("./model/universitySchema");
const paper = require("./model/paperSchema");

const port = process.env.PORT || 5000;

app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.send("Hello world");
});

app.post("/contact", (req, res) => {
  const data = new contact(req.body);
  data
    .save()
    .then(() =>
      res.status(200).json({
        msg: "Thanks for connecting with us. We'll contact you shortly.",
      })
    )
    .catch((err) =>
      res.status(400).json({ msg: "Please provide proper credentials." })
    );
});

app.post("/adduniversity", (req, res) => {
  const data = new university(req.body);
  data
    .save()
    .then(() =>
      res.status(200).json({
        msg: "University data stored in db",
      })
    )
    .catch((err) => console.log(err));
});

app.get("/fetchuniversities", async (req, res) => {
  try {
    const universityData = await university.find({});
    res.status(200).json({ universityData });
  } catch (error) {
    console.log(error.message);
  }
});

app.post("/addpaper", (req, res) => {
  const data = new paper(req.body);
  data
    .save()
    .then(() => res.status(200).json(req.body))
    .catch((err) => console.log(err));
});

app.get("/api/papers/:university", async (req, res) => {
  const { university } = req.params;
  try {
    const paperData = await paper.find({ university: university });
    if (paperData.length < 1) {
      return res
        .status(200)
        .json({ msg: `No papers found of university '${university}'.` });
    }
    res.status(200).json({ paperData });
  } catch (error) {
    console.log(error);
  }
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
