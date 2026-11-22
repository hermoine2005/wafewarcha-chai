const mongoose = require('mongoose');
module.exports = mongoose.model('FranchiseEnquiry', new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  referenceNo: { type: String, unique: true, required: true },
  fullName: { type: String, required: true, trim: true },
  email: { type: String, required: true, lowercase: true, trim: true },
  phone: { type: String, required: true },
  city: { type: String, required: true, trim: true },
  state: { type: String, required: true, trim: true },
  preferredModel: { type: String, required: true },
  budget: { type: Number, required: true, min: 0 },
  preferredLocation: { type: String, required: true, trim: true },
  message: { type: String, default: '', maxlength: 1000 },
  status: { type: String, enum: ['Pending', 'In Review', 'Approved', 'Rejected'], default: 'Pending' },
  adminNote: { type: String, default: '' },
}, { timestamps: true }));
