const mongoose = require('mongoose');
module.exports = mongoose.model('ContactMessage', new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, lowercase: true, trim: true },
  phone: { type: String, required: true },
  subject: { type: String, required: true, trim: true },
  message: { type: String, required: true, maxlength: 2000 },
}, { timestamps: true }));
