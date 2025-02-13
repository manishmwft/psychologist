const mongoose = require('mongoose');

// Wallet Schema
const walletSchema = new mongoose.Schema(
  {
    userId: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'Auth', 
      required: true, 
      unique: true 
    },
    purchasedAmount: { 
      type: Number, 
      default: 0 
    }, // Amount spent on purchasing coins (currency value)
    purchasedCoins: { 
      type: Number, 
      default: 0 
    }, // Number of purchased coins
    rewardedCoins: { 
      type: Number, 
      default: 0 
    }, // Number of rewarded coins
    referralCoins: { 
      type: Number, 
      default: 0 
    }, // Number of coins earned via referrals
    totalCoins: { 
      type: Number, 
      default: 0 
    }, // Total coins = purchasedCoins + rewardedCoins + referralCoins
    lastUpdated: { 
      type: Date, 
      default: Date.now 
    },
  },
  { timestamps: true } // Automatically manage createdAt and updatedAt fields
);

const Wallet = mongoose.model('Wallet', walletSchema);

module.exports = Wallet;
