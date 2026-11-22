const mongoose = require('mongoose');
module.exports = mongoose.model('FranchiseProcess', new mongoose.Schema({
  stepNumber: { type: Number, required: [true, 'Step number is required'], min: 1 },
  title: { type: String, required: [true, 'Title is required'], trim: true },
  description: { type: String, required: [true, 'Description is required'] },
}, { timestamps: true }));
