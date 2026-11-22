exports.isEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(String(v || ''));
exports.isPhone = (v) => /^[6-9]\d{9}$/.test(String(v || '').replace(/[\s-]/g, '').replace(/^\+91/, ''));
exports.strongPassword = (v) => typeof v === 'string' && v.length >= 8 && /[A-Za-z]/.test(v) && /\d/.test(v);
exports.fail = (res, errors) => res.status(400).json({ message: errors[0], errors });
