const mongoose = require("mongoose");

const universityCardSchema = new mongoose.Schema({
  unName: String,
  unDesc: String,
  unPath: String,
  unImgLink: String,
});

module.exports = mongoose.model("university", universityCardSchema);
