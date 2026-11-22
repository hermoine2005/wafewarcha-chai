const r = require('express').Router();
const Brand = require('../models/BrandInformation');
const { protect, adminOnly } = require('../middleware/auth');
r.get('/', async (req, res, next) => { try { res.json((await Brand.findOne()) || (await Brand.create({}))); } catch (e) { next(e); } });
r.put('/', protect, adminOnly, async (req, res, next) => {
  try {
    const b = (await Brand.findOne()) || new Brand();
    b.set(req.body); await b.save(); res.json(b);
  } catch (e) { next(e); }
});
module.exports = r;
