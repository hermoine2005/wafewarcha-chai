const mongoose = require('mongoose');
module.exports = mongoose.model('OperatingCost', new mongoose.Schema({
  item: { type: String, required: [true, 'Cost item is required'], trim: true },
  monthlyAmount: { type: Number, required: [true, 'Amount is required'], min: [0, 'Amount cannot be negative'] },
  note: String,
  order: { type: Number, default: 0 },
}, { timestamps: true }));
