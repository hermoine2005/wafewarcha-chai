const r = require('express').Router();
const Msg = require('../models/ContactMessage');
const { protect, adminOnly } = require('../middleware/auth');
const { isEmail, isPhone, fail } = require('../utils/validators');
r.post('/', async (req, res, next) => {
  try {
    const { name, email, phone, subject, message } = req.body, errs = [];
    if (!name || name.trim().length < 2) errs.push('Name is required');
    if (!isEmail(email)) errs.push('Valid email is required');
    if (!isPhone(phone)) errs.push('Valid 10-digit phone is required');
    if (!subject || !subject.trim()) errs.push('Subject is required');
    if (!message || message.trim().length < 10) errs.push('Message must be at least 10 characters');
    if (errs.length) return fail(res, errs);
    await Msg.create({ name, email, phone, subject, message });
    res.status(201).json({ message: 'Thank you! Your message has been received.' });
  } catch (e) { next(e); }
});
r.get('/', protect, adminOnly, async (req, res, next) => { try { res.json(await Msg.find().sort({ createdAt: -1 })); } catch (e) { next(e); } });
r.delete('/:id', protect, adminOnly, async (req, res, next) => {
  try { if (!(await Msg.findByIdAndDelete(req.params.id))) return res.status(404).json({ message: 'Not found' }); res.json({ message: 'Deleted' }); } catch (e) { next(e); }
});
module.exports = r;
