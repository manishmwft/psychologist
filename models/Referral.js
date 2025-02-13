const mongoose = require('mongoose');

// Referral Schema
const referralSchema = new mongoose.Schema(
  {
    referralCode: { 
      type: String, 
      required: true, 
      unique: true 
    }, // Unique referral code
    referredEmail: { 
      type: String, 
      required: true 
    }, // Email of the referred user
    referredUserId: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'Auth', 
      required: true 
    }, // Referred user's unique ID
    referrerUserId: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'Auth', 
      required: true 
    }, // Referring user's unique ID
    paymentAmount: { 
      type: Number, 
      default: 0 
    }, // Amount earned from the referral
    rewarded: { 
      type: Boolean, 
      default: false 
    }, // Whether the referral has been rewarded
    numberOfReferrals: { 
      type: Number, 
      default: 0 
    } // Number of users using this referral code
  },
  { timestamps: true } // Automatically manage createdAt and updatedAt fields
);

const Referral = mongoose.model('Referral', referralSchema);

module.exports = Referral;
