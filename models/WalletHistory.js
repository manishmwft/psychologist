// models/WalletHistory.js
const mongoose = require('mongoose');

const walletHistorySchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'Auth', required: true },
  transactionType: { 
    type: String, 
    enum: ['purchase', 'reward', 'referral', 'update'],  // Add 'update' to the enum list
    required: true 
  },
  amount: { type: Number, required: true },
  totalCoins: { type: Number, required: true },
  description: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('WalletHistory', walletHistorySchema);
