const mongoose = require('mongoose');
module.exports = mongoose.model('BrandInformation', new mongoose.Schema({
  name: { type: String, default: 'Wafewarcha Chai' },
  tagline: String, intro: String, story: String, mission: String, vision: String,
  values: [String], whyChoose: [String],
  contactEmail: String, contactPhone: String, address: String, mapEmbedUrl: String,
}, { timestamps: true }));
