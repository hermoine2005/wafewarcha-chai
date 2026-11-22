const mongoose = require('mongoose');
module.exports = mongoose.model('Gallery', new mongoose.Schema({
  title: { type: String, required: [true, 'Title is required'], trim: true },
  imageUrl: { type: String, required: [true, 'Image URL is required'] },
  category: { type: String, enum: ['Cafe Interiors', 'Tea Preparation', 'Products', 'Franchise'], default: 'Products' },
}, { timestamps: true }));
