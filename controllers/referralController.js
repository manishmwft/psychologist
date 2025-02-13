const Referral = require('../models/Referral');
const Auth = require('../models/Auth');
const mongoose = require('mongoose');

// Generate Referral Code
exports.generateReferralCode = async (req, res) => {
    try {
      const { userId } = req.body;
  
      // Validate that userId is provided
      if (!userId) {
        return res.status(400).json({ error: "User ID is required" });
      }
  
      // Find user by ID to generate referral code
      const user = await Auth.findById(userId);
      if (!user) {
        return res.status(400).json({ error: "User not found" });
      }
  
      // Create referral code (you could use a more complex code generator)
      const referralCode = `REF-${user._id.toString().slice(-6).toUpperCase()}`;
  
      // Save the referral code to the user's document (optional)
      user.referralCode = referralCode;
      await user.save();
  
      // Send response with user details and the generated referral code
      res.status(200).json({
        message: "Referral code generated",
        referralCode,
        userDetails: {
          name: user.name,
          email: user.email,
          referralCode: user.referralCode,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt
        }
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Server error" });
    }
  };

  exports.handleReferral = async (req, res) => {
    try {
      const { referrerUserId, referredEmail, referralCode } = req.body;
  
      // Validate that all fields are provided
      if (!referrerUserId || !referredEmail || !referralCode) {
        return res.status(400).json({ error: "All fields are required" });
      }
  
      // Log referrerUserId to confirm it's being passed correctly
      console.log("Referrer User ID being queried:", referrerUserId);
  
      // Convert referrerUserId to ObjectId to match MongoDB format
      const referrerId = new mongoose.Types.ObjectId(referrerUserId);
  
      // Log referrerId to confirm ObjectId conversion
      console.log("Referrer ObjectId:", referrerId);
  
      // Find referrer by ObjectId
      const referrer = await Auth.findById(referrerId);
      console.log("Referrer Found:", referrer); // Log referrer to confirm it exists
  
      if (!referrer) {
        return res.status(400).json({ error: "Referrer not found" });
      }
      console.log("Referrer Referral Code in DB:", referrer.referal_code);
      console.log("Referral Code from Request:", referralCode);  // Log the referralCode

      if (referralCode === undefined) {
        console.error("Referral code is undefined!");
        return res.status(400).json({ error: "Referral code is missing from the request" });
      }
      
      // Ensure both codes are trimmed and compared case-insensitively
      if (referrer.referal_code.trim().toUpperCase() !== referralCode.trim().toUpperCase()) {
        console.error("Referral codes do not match");
        return res.status(400).json({ error: "Invalid referral code" });
      }
  
      // Find referred user by email
      const referredUser = await Auth.findOne({ email: referredEmail });
      if (!referredUser) {
        return res.status(400).json({ error: "Referred user not found" });
      }
  
      // Create a new referral record
      const referral = new Referral({
        referralCode,
        referredEmail,
        referredUserId: referredUser._id,
        referrerUserId: referrer._id,
        paymentAmount: 10, // Example amount
        rewarded: false,
        numberOfReferrals: 1,
      });
  
      // Save referral record to the database
      await referral.save();
  
      // Update referrer referral count
      referrer.referralCount = (referrer.referralCount || 0) + 1;
      await referrer.save();
  
      res.status(201).json({
        message: "Referral successfully handled",
        referral,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Server error" });
    }
  };
  



  

// Update Referral Reward Status (when payment is processed)
exports.updateReferralRewardStatus = async (req, res) => {
  try {
    const { referralId } = req.body;

    // Validate that referralId is provided
    if (!referralId) {
      return res.status(400).json({ error: "Referral ID is required" });
    }

    // Find the referral by ID
    const referral = await Referral.findById(referralId);
    if (!referral) {
      return res.status(400).json({ error: "Referral not found" });
    }

    // Update referral reward status
    referral.rewarded = true;
    await referral.save();

    res.status(200).json({
      message: "Referral reward status updated",
      referral,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};
