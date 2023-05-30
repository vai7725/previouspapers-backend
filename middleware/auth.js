// packages
require('dotenv').config();
const jwt = require('jsonwebtoken');

// variables
const jwtSecret = process.env.JWT_SECRET;

const localVariables = async (req, res, next) => {
  req.app.locals = {
    OTP: null,
    updateSession: false,
  };

  req.app.userCred = {};
  next();
};

const authorize = async (req, res, next) => {
  try {
    const token = await req.headers.authorization.split(' ')[1];
    const decodeToken = await jwt.verify(token, jwtSecret);
    req.user = decodeToken;
    next();
  } catch (error) {
    res.status(401).json({ err: 'Authorization failed.' });
  }
};

module.exports = {
  localVariables,
  authorize,
};
