const r = require('express').Router();
const User = require('../models/User');
const Enquiry = require('../models/FranchiseEnquiry');
const { protect, adminOnly } = require('../middleware/auth');
r.use(protect, adminOnly);
r.get('/', async (req, res, next) => { try { res.json(await User.find({ role: 'entrepreneur' }).sort({ createdAt: -1 })); } catch (e) { next(e); } });
r.delete('/:id', async (req, res, next) => {
  try {
    const u = await User.findOne({ _id: req.params.id, role: 'entrepreneur' });
    if (!u) return res.status(404).json({ message: 'User not found' });
    await Enquiry.deleteMany({ user: u._id });
    await u.deleteOne();
    res.json({ message: 'Deleted' });
  } catch (e) { next(e); }
});
module.exports = r;
