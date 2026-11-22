require('dotenv').config({ override: true });
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const crud = require('./utils/crud');
const { notFound, errorHandler } = require('./middleware/error');

const app = express();
const origins = (process.env.CLIENT_URL || 'http://localhost:5173').split(',').map((s) => s.trim().replace(/\/$/, ''));
app.use(cors({
  origin: (origin, cb) => (!origin || origins.includes(origin) ? cb(null, true) : cb(new Error('Origin not allowed by CORS'))),
  credentials: true,
}));
app.use(express.json({ limit: '1mb' }));

app.get('/api/health', (req, res) => res.json({ status: 'ok', uptime: process.uptime(), time: new Date().toISOString() }));
app.use('/api/auth', require('./routes/auth'));
app.use('/api/users', require('./routes/users'));
app.use('/api/brand', require('./routes/brand'));
app.use('/api/franchises', crud(require('./models/FranchiseModel')));
app.use('/api/investments', crud(require('./models/Investment'), { order: 1, createdAt: 1 }));
app.use('/api/costs', crud(require('./models/OperatingCost'), { order: 1, createdAt: 1 }));
app.use('/api/products', crud(require('./models/Product')));
app.use('/api/process', crud(require('./models/FranchiseProcess'), { stepNumber: 1 }));
app.use('/api/gallery', crud(require('./models/Gallery')));
app.use('/api/enquiries', require('./routes/enquiries'));
app.use('/api/contact', require('./routes/contact'));
app.use('/api/admin/dashboard', require('./routes/adminDashboard'));

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
if (!process.env.JWT_SECRET) { console.error('JWT_SECRET is not set'); process.exit(1); }
connectDB().then(() => app.listen(PORT, () => console.log(`API running on port ${PORT}`)))
  .catch((e) => { console.error('Startup failed:', e.message); process.exit(1); });
