const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { isEmail, isPhone, strongPassword, fail } = require('../utils/validators');

const sign = (u) => jwt.sign({ id: u._id, role: u.role }, process.env.JWT_SECRET, { expiresIn: '7d' });
const pub = (u) => ({ _id: u._id, name: u.name, email: u.email, phone: u.phone, role: u.role, createdAt: u.createdAt });

exports.register = async (req, res, next) => {
  try {
    const { name, email, phone, password, confirmPassword } = req.body;
    const errs = [];
    if (!name || name.trim().length < 2) errs.push('Full name must be at least 2 characters');
    if (!isEmail(email)) errs.push('Enter a valid email address');
    if (!isPhone(phone)) errs.push('Enter a valid 10-digit Indian mobile number');
    if (!strongPassword(password)) errs.push('Password must be 8+ characters with letters and numbers');
    if (password !== confirmPassword) errs.push('Passwords do not match');
    if (errs.length) return fail(res, errs);
    if (await User.findOne({ email: email.toLowerCase() })) return res.status(409).json({ message: 'Email is already registered' });
    const user = await User.create({ name, email, phone, password, role: 'entrepreneur' }); // role never comes from the client
    res.status(201).json({ token: sign(user), user: pub(user) });
  } catch (e) { next(e); }
};

const loginAs = (role) => async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!isEmail(email) || !password) return fail(res, ['Email and password are required']);
    const user = await User.findOne({ email: email.toLowerCase() }).select('+password');
    if (!user || user.role !== role || !(await user.matchPassword(password)))
      return res.status(401).json({ message: 'Invalid email or password' });
    res.json({ token: sign(user), user: pub(user) });
  } catch (e) { next(e); }
};
exports.login = loginAs('entrepreneur');
exports.adminLogin = loginAs('admin');
exports.me = (req, res) => res.json({ user: pub(req.user) });
