const mongoose = require('mongoose');

const authSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true },
  referal_code: { type: String, required: true, unique: true },
  role: { type: String, default: 'user' }, // Default role is 'user', could be 'admin' or others
  passwordResetToken: String,
  passwordResetExpires: Date,
  
  // New field to store the reference to the user who referred this user
  referredBy: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Auth', 
    default: null  // If not referred by anyone, it will be null
  },

}, { timestamps: true });

const Auth = mongoose.model('Auth', authSchema);

module.exports = Auth;
