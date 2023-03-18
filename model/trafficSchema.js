const mongoose = require('mongoose');

const trafficSchema = new mongoose.Schema({
  userCount: Number,
  userVisit: Boolean,
});

module.exports = mongoose.model('traffic', trafficSchema);
