const mongoose = require('mongoose');

const authSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true },
  referal_code: { type: String, required: true, unique: true },
  role: { type: String, default: 'user' }, // Default role is 'user', could be 'admin' or others
  passwordResetToken: String,
  passwordResetExpires: Date
}, { timestamps: true });

const Auth = mongoose.model('Auth', authSchema);

module.exports = Auth;
