exports.notFound = (req, res) => res.status(404).json({ message: `Route not found: ${req.originalUrl}` });
exports.errorHandler = (err, req, res, next) => {
  let status = err.status || 500;
  let message = err.message || 'Server error';
  if (err.name === 'ValidationError') { status = 400; message = Object.values(err.errors).map((e) => e.message).join(', '); }
  if (err.name === 'CastError') { status = 400; message = 'Invalid ID or value'; }
  if (err.code === 11000) { status = 409; message = 'Duplicate value: record already exists'; }
  if (status === 500) console.error(err);
  res.status(status).json({ message: status === 500 && process.env.NODE_ENV === 'production' ? 'Server error' : message });
};
