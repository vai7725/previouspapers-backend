const mongoose = require("mongoose");

const contactSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Name is required"],
  },
  email: {
    type: String,
    required: [true, "Email is required"],
  },
  university: {
    type: String,
    required: [true, "University name is required"],
  },
  msg: {
    type: String,
    required: [true, "Message is required"],
  },
});

module.exports = mongoose.model("contact", contactSchema);
