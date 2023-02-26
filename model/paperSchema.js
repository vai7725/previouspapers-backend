const mongoose = require("mongoose");

const paperSchema = new mongoose.Schema({
  university: String,
  courseName: String,
  courseYear: String,
  paperTitle: String,
  paperYear: Number,
  paperURL: String,
});

module.exports = mongoose.model("papers", paperSchema);
