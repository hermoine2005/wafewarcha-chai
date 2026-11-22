const mongoose = require('mongoose');
module.exports = mongoose.model('Product', new mongoose.Schema({
  name: { type: String, required: [true, 'Product name is required'], trim: true },
  description: { type: String, required: [true, 'Description is required'] },
  category: { type: String, required: true, enum: ['Tea Varieties', 'Special Chai', 'Cold Beverages', 'Snacks', 'Food Items'] },
  price: { type: Number, required: [true, 'Price is required'], min: [0, 'Price cannot be negative'] },
  image: { type: String, default: '' },
  available: { type: Boolean, default: true },
}, { timestamps: true }));
