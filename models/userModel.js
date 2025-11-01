const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  income: { type: Number },
  goals: { type: [String] },
});

module.exports = mongoose.model('User', userSchema);