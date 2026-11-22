const r = require('express').Router();
const { protect, adminOnly } = require('../middleware/auth');
r.get('/', protect, adminOnly, require('../controllers/dashboardController').stats);
module.exports = r;
