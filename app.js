require('dotenv').config();

const express = require('express');
const cors = require('cors');
const app = express();

const connectDB = require('./connect');
const contact = require('./model/contactSchema');
const university = require('./model/universitySchema');
const paper = require('./model/paperSchema');
const userHit = require('./model/trafficSchema');

const port = process.env.PORT || 5000;

app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.send('Hello world');
});

app.post('/contact', (req, res) => {
  const data = new contact(req.body);
  data
    .save()
    .then(() =>
      res.status(200).json({
        msg: "Thanks for connecting with us. We'll contact you shortly.",
      })
    )
    .catch((err) =>
      res.status(400).json({ msg: 'Please provide proper credentials.' })
    );
});

<<<<<<< HEAD
// app.post('/adduniversity', (req, res) => {
=======
// app.post("/adduniversity", (req, res) => {
>>>>>>> 3f707fc80e5f2410264f0733b871b0c7dc19053f
//   const data = new university(req.body);
//   data
//     .save()
//     .then(() =>
//       res.status(200).json({
<<<<<<< HEAD
//         msg: 'University data stored in db',
=======
//         msg: "University data stored in db",
>>>>>>> 3f707fc80e5f2410264f0733b871b0c7dc19053f
//       })
//     )
//     .catch((err) => console.log(err));
// });

app.get('/fetchuniversities', async (req, res) => {
  try {
    const universityData = await university.find({});
    res.status(200).json({ universityData });
  } catch (error) {
    console.log(error.message);
  }
});

<<<<<<< HEAD
// app.post('/addpaper', (req, res) => {
=======
// app.post("/addpaper", (req, res) => {
>>>>>>> 3f707fc80e5f2410264f0733b871b0c7dc19053f
//   const data = new paper(req.body);
//   data
//     .save()
//     .then(() => res.status(200).json(req.body))
//     .catch((err) => console.log(err));
// });

app.get('/api/papers/:university', async (req, res) => {
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

app.put('/updatetraffic', async (req, res) => {
  try {
    const filter = { userVisit: true };
    const data = await userHit.findOne({ userVisit: true });
    const updateData = await userHit.findOneAndUpdate(
      filter,
      { ...data, userCount: data.userCount++ },
      {
        new: true,
      }
    );
    res.status(200).json({ msg: 'Traffic count updated.' });
  } catch (error) {
    res.status(404).json({ msg: error.msg });
  }
});

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    app.listen(port, () => console.log(`App started listening at ${port}`));
  } catch (error) {
    console.log('The error is', error);
  }
};

start();
