// Generic CRUD router: public read, admin-only write
const express = require('express');
const { protect, adminOnly } = require('../middleware/auth');
module.exports = (Model, sort = { createdAt: -1 }) => {
  const r = express.Router();
  const wrap = (fn) => (req, res, next) => fn(req, res).catch(next);
  r.get('/', wrap(async (req, res) => res.json(await Model.find().sort(sort))));
  r.get('/:id', wrap(async (req, res) => {
    const d = await Model.findById(req.params.id);
    if (!d) return res.status(404).json({ message: 'Not found' });
    res.json(d);
  }));
  r.post('/', protect, adminOnly, wrap(async (req, res) => res.status(201).json(await Model.create(req.body))));
  r.put('/:id', protect, adminOnly, wrap(async (req, res) => {
    const d = await Model.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!d) return res.status(404).json({ message: 'Not found' });
    res.json(d);
  }));
  r.delete('/:id', protect, adminOnly, wrap(async (req, res) => {
    const d = await Model.findByIdAndDelete(req.params.id);
    if (!d) return res.status(404).json({ message: 'Not found' });
    res.json({ message: 'Deleted' });
  }));
  return r;
};
