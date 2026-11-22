const mongoose = require('mongoose');
module.exports = mongoose.model('Investment', new mongoose.Schema({
  title: { type: String, required: [true, 'Title is required'], trim: true },
  category: { type: String, required: true, enum: ['Initial Investment', 'Franchise Fee', 'Interior & Setup', 'Equipment', 'Furniture', 'Other Expenses'] },
  amount: { type: Number, required: [true, 'Amount is required'], min: [0, 'Amount cannot be negative'] },
  note: String,
  order: { type: Number, default: 0 },
}, { timestamps: true }));
