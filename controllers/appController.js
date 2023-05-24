// modules
const paper = require('../model/paperSchema');
const contact = require('../model/contactSchema');
const userHit = require('../model/trafficSchema');
const university = require('../model/universitySchema');

// Function to fetch universities data
const fetchUniversities = async (req, res) => {
  try {
    const universityData = await university.find({});
    res.status(200).json({ universityData });
  } catch (error) {
    console.log(error.message);
  }
};

// Function to fetch papers
const paperProvider = async (req, res) => {
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
};

// Function to store info when user try to contact
const userContact = async (req, res) => {
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
};

// Function to fetch the information if any user tried to contact
const fetchContactInfo = async (req, res) => {
  try {
    const contactInfo = await contact.find({});
    console.log(contactInfo);
    res.json({ contactInfo });
  } catch (error) {
    console.log(error);
  }
};

// Function to store new paper in DB
const storeNewPaper = async (req, res) => {
  const data = new paper(req.body);
  data
    .save()
    .then(() => res.status(200).json(req.body))
    .catch((err) => console.log(err));
};

// Function to store university data in DB
const storeNewUniversityData = async (req, res) => {
  const data = new university(req.body);
  data
    .save()
    .then(() =>
      res.status(200).json({
        msg: 'University data stored in db',
      })
    )
    .catch((err) => console.log(err));
};

// Function to update traffic count in DB
const updateTrafficCount = async (req, res) => {
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
};

// Function to delete the user contact query after resolution
const deleteUserContactQueryInfo = async (req, res) => {
  const { infoId } = req.params;
  contact.findByIdAndRemove(infoId, (err, deletedItem) => {
    if (err) {
      console.log(err);
      res.status(500).json({ msg: 'Internal server error' });
    } else {
      res.status(204).json({ msg: 'Info deleted successfully' });
    }
  });
};

module.exports = {
  paperProvider,
  fetchUniversities,
  fetchContactInfo,
  userContact,
  storeNewPaper,
  storeNewUniversityData,
  updateTrafficCount,
  deleteUserContactQueryInfo,
};
