// Packages
require('dotenv').config();
const bcrypt = require('bcrypt');
const JWT = require('jsonwebtoken');
const genOTP = require('otp-generator');

// modules
const paper = require('../model/paperSchema');
const contact = require('../model/contactSchema');
const userHit = require('../model/trafficSchema');
const university = require('../model/universitySchema');
const User = require('../model/userSchema');

// Environment variables
const jwtSecret = process.env.JWT_SECRET;

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

// Code of User authentication system
const generateOTP = async (req, res) => {
  req.app.locals.OTP = await genOTP.generate(6, {
    lowerCaseAlphabets: false,
    upperCaseAlphabets: false,
    specialChars: false,
  });
  return res.status(201).json({ code: req.app.locals.OTP });
};

const verifyOTP = async (req, res) => {
  const { code } = req.query;
  if (parseInt(code) === parseInt(req.app.locals.OTP)) {
    // req.app.locals.OTP = null;
    req.app.locals.updateSession = true;
    return res.status(200).json({ msg: 'OTP Verification Successfull!' });
  }
  return res.status(400).json({ err: 'Invalid OTP' });
};

const createUpdateSession = async (req, res) => {
  if (req.app.locals.updateSession) {
    return res.status(201).json({ flag: req.app.locals.updateSession });
  }
  return res.status(440).json({ err: 'Session expired.' });
};

const storeUserCred = async (req, res) => {
  try {
    const requestBody = req.body;
    const { email } = requestBody;

    // Checking if email already exist
    const emailExist = new Promise(async (resolve, reject) => {
      const exist = await User.findOne({ email });
      if (exist) {
        reject('User already exist with the email!');
      }
      if (!exist) {
        resolve('Welcome...');
      }
    });

    emailExist
      .then(() => {
        req.app.locals.updateSession = true;

        res.status(200).json({ msg: 'OK' });
      })
      .catch((err) => res.status(400).json({ err: err }));
  } catch (error) {
    return res.status(500).send(error);
  }
};

const registerUser = async (req, res) => {
  try {
    if (req.app.locals.updateSession) {
      const creds = req.body;
      const { password } = creds;

      if (password) {
        bcrypt
          .hash(password, 10)
          .then((hashedPassword) => {
            const user = new User({
              ...creds,
              password: hashedPassword,
            });

            user
              .save()
              .then(() => {
                req.app.userCred = {};
                req.app.locals.updateSession = false;
                return res
                  .status(201)
                  .json({ msg: 'User registered successfully.' });
              })
              .catch(() =>
                res.status(500).json({ err: 'Could not register user.' })
              );
          })
          .catch(() =>
            res.status(500).json({ err: 'Unable to hash password' })
          );
      }
    } else {
      res.status(440).json({ msg: 'Session expired' });
    }
  } catch (error) {
    res.status(500).json({ err: 'No credentials found' });
  }
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    User.findOne({ email })
      .then((user) => {
        bcrypt
          .compare(password, user.password)
          .then((passwordMatched) => {
            if (!passwordMatched) {
              return res.status(400).json({ err: 'Password did not match' });
            }

            //   Creating token
            const token = JWT.sign(
              {
                userID: user._id,
                userEmail: user.email,
              },
              jwtSecret,
              { expiresIn: '10d' }
            );
            return res.status(200).json({
              msg: 'User logged in successfully',
              firstName: user.firstName,
              email: user.email,
              token,
            });
          })
          .catch(() =>
            res.status(400).json({ err: 'Did not get the password' })
          );
      })
      .catch((err) =>
        res
          .status(404)
          .json({ err: `User not found with the email: '${email}'` })
      );
  } catch (error) {
    return res.status(500).send(error);
  }
};

const getUser = async (req, res) => {
  const { userID } = req.user;
  if (userID) {
    User.findOne({ _id: userID })
      .then((user) => {
        if (!user) {
          res.status(404).json({ err: 'No user found...' });
        }
        const { password, ...rest } = Object.assign({}, user.toJSON());
        return res.status(200).json({ rest });
      })
      .catch((err) => res.status(500).json({ err }));
  } else {
    return res.status(404).json({ err: 'No user found' });
  }
};

const updatePassword = async (req, res) => {
  const { email, password } = req.body;
  try {
    if (password) {
      bcrypt
        .hash(password, 10)
        .then((hashedPassword) => {
          const user = User.updateOne(
            { email: email },
            { password: hashedPassword }
          );
          user
            .then(() =>
              res.status(200).json({ msg: 'Password updated successfully' })
            )
            .catch(() =>
              res.status(304).json({ err: "Password couldn't be modified" })
            );
        })
        .catch(() => res.status(500).json({ err: 'Could not hash password' }));
    }
  } catch (error) {
    return res.status(500).json({ error });
  }
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
  registerUser,
  loginUser,
  generateOTP,
  verifyOTP,
  createUpdateSession,
  storeUserCred,
  getUser,
  updatePassword,
};
