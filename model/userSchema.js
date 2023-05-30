const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: [true, 'Firstname is required'],
  },
  lastName: {
    type: String,
    required: [true, 'Lastname is required'],
  },
  profession: {
    type: String,
  },
  email: {
    type: String,
    required: [true, 'Email is required.'],
    unique: [true, 'Email already exist.'],
  },
  password: {
    type: String,
    required: [true, 'Password is required.'],
  },
});

module.exports = mongoose.model('user', userSchema);
