const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const schema = new mongoose.Schema({
  name: { type: String, required: [true, 'Name is required'], trim: true, minlength: 2, maxlength: 80 },
  email: { type: String, required: [true, 'Email is required'], unique: true, lowercase: true, trim: true },
  phone: { type: String, required: [true, 'Phone is required'], trim: true },
  password: { type: String, required: true, minlength: 8, select: false },
  role: { type: String, enum: ['entrepreneur', 'admin'], default: 'entrepreneur' },
}, { timestamps: true });
schema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});
schema.methods.matchPassword = function (p) { return bcrypt.compare(p, this.password); };
module.exports = mongoose.model('User', schema);
