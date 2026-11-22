const User = require('../models/User');
const Enquiry = require('../models/FranchiseEnquiry');
const Product = require('../models/Product');
const FranchiseModel = require('../models/FranchiseModel');
const ContactMessage = require('../models/ContactMessage');

exports.stats = async (req, res, next) => {
  try {
    const since = new Date(); since.setDate(1); since.setMonth(since.getMonth() - 5); since.setHours(0, 0, 0, 0);
    const [entrepreneurs, totalEnquiries, byStatus, products, models, messages, trend] = await Promise.all([
      User.countDocuments({ role: 'entrepreneur' }), Enquiry.countDocuments(),
      Enquiry.aggregate([{ $group: { _id: '$status', count: { $sum: 1 } } }]),
      Product.countDocuments(), FranchiseModel.countDocuments(), ContactMessage.countDocuments(),
      Enquiry.aggregate([
        { $match: { createdAt: { $gte: since } } },
        { $group: { _id: { y: { $year: '$createdAt' }, m: { $month: '$createdAt' } }, count: { $sum: 1 } } },
      ]),
    ]);
    const s = { Pending: 0, 'In Review': 0, Approved: 0, Rejected: 0 };
    byStatus.forEach((x) => { s[x._id] = x.count; });
    const months = [];
    for (let i = 0; i < 6; i++) {
      const d = new Date(since.getFullYear(), since.getMonth() + i, 1);
      const hit = trend.find((t) => t._id.y === d.getFullYear() && t._id.m === d.getMonth() + 1);
      months.push({ month: d.toLocaleString('en-IN', { month: 'short', year: '2-digit' }), enquiries: hit ? hit.count : 0 });
    }
    res.json({
      totalEntrepreneurs: entrepreneurs, totalEnquiries, pending: s.Pending, inReview: s['In Review'],
      approved: s.Approved, rejected: s.Rejected, totalProducts: products, totalFranchiseModels: models, totalMessages: messages,
      statusChart: Object.entries(s).map(([name, value]) => ({ name, value })), trendChart: months,
    });
  } catch (e) { next(e); }
};
