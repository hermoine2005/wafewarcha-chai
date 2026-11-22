const mongoose = require('mongoose');

module.exports = async () => {
  const uri = process.env.MONGO_URI || '';
  if (!uri) throw new Error('MONGO_URI is missing. Create backend/.env (copy .env.example) and set MONGO_URI.');
  if (/[<>]/.test(uri) || /YOUR_DB|DB_USER|DB_PASSWORD|<cluster>|<db_/i.test(uri))
    throw new Error('MONGO_URI still contains placeholder text (< >, YOUR_DB_USER...). Paste your REAL Atlas connection string in backend/.env');
  await mongoose.connect(uri, { serverSelectionTimeoutMS: 15000 });
  console.log('MongoDB connected');
};
