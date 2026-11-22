const crypto = require('crypto');
const Enquiry = require('../models/FranchiseEnquiry');
const { isEmail, isPhone, fail } = require('../utils/validators');

const newRef = () => {
  const d = new Date().toISOString().slice(0, 10).replace(/-/g, '');
  return `WC-${d}-${crypto.randomBytes(3).toString('hex').toUpperCase()}`;
};

exports.create = async (req, res, next) => {
  try {
    const b = req.body, errs = [];
    if (!b.fullName || b.fullName.trim().length < 2) errs.push('Full name is required');
    if (!isEmail(b.email)) errs.push('Valid email is required');
    if (!isPhone(b.phone)) errs.push('Valid 10-digit phone is required');
    ['city', 'state', 'preferredModel', 'preferredLocation'].forEach((k) => { if (!b[k] || !String(b[k]).trim()) errs.push(`${k} is required`); });
    if (b.budget === undefined || b.budget === '' || isNaN(b.budget) || Number(b.budget) <= 0) errs.push('Estimated budget must be a positive number');
    if (errs.length) return fail(res, errs);
    const e = await Enquiry.create({
      user: req.user._id, referenceNo: newRef(), status: 'Pending',
      fullName: b.fullName, email: b.email, phone: b.phone, city: b.city, state: b.state,
      preferredModel: b.preferredModel, budget: Number(b.budget), preferredLocation: b.preferredLocation, message: b.message || '',
    });
    res.status(201).json(e);
  } catch (e) { next(e); }
};

// entrepreneurs only ever see their own enquiries (admin note is hidden)
exports.mine = async (req, res, next) => {
  try { res.json(await Enquiry.find({ user: req.user._id }).sort({ createdAt: -1 }).select('-adminNote')); } catch (e) { next(e); }
};

exports.all = async (req, res, next) => {
  try {
    const { status, q } = req.query, filter = {};
    if (status) filter.status = status;
    if (q) {
      const rx = new RegExp(String(q).replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');
      filter.$or = [{ referenceNo: rx }, { fullName: rx }, { email: rx }, { city: rx }, { preferredModel: rx }];
    }
    res.json(await Enquiry.find(filter).sort({ createdAt: -1 }).populate('user', 'name email phone'));
  } catch (e) { next(e); }
};

exports.one = async (req, res, next) => {
  try {
    const e = await Enquiry.findById(req.params.id).populate('user', 'name email phone');
    if (!e) return res.status(404).json({ message: 'Enquiry not found' });
    res.json(e);
  } catch (e) { next(e); }
};

exports.update = async (req, res, next) => {
  try {
    const { status, adminNote } = req.body, upd = {};
    if (status !== undefined) {
      if (!['Pending', 'In Review', 'Approved', 'Rejected'].includes(status)) return fail(res, ['Invalid status']);
      upd.status = status;
    }
    if (adminNote !== undefined) upd.adminNote = String(adminNote).slice(0, 1000);
    const e = await Enquiry.findByIdAndUpdate(req.params.id, upd, { new: true, runValidators: true });
    if (!e) return res.status(404).json({ message: 'Enquiry not found' });
    res.json(e);
  } catch (e) { next(e); }
};

exports.remove = async (req, res, next) => {
  try {
    if (!(await Enquiry.findByIdAndDelete(req.params.id))) return res.status(404).json({ message: 'Enquiry not found' });
    res.json({ message: 'Deleted' });
  } catch (e) { next(e); }
};
