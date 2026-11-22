const mongoose = require('mongoose');
module.exports = mongoose.model('FranchiseModel', new mongoose.Schema({
  name: { type: String, required: [true, 'Model name is required'], trim: true },
  description: { type: String, required: [true, 'Description is required'] },
  spaceRequired: { type: String, required: [true, 'Space requirement is required'] },
  features: [String], benefits: [String], eligibility: [String],
  isSample: { type: Boolean, default: true },
}, { timestamps: true }));
