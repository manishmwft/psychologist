const mongoose = require('mongoose');

exports.handleReferral = async (req, res) => {
  try {
    const { referrerUserId, referredEmail, referralCode } = req.body;

    // Validate fields
    if (!referrerUserId || !referredEmail || !referralCode) {
      return res.status(400).json({ error: "All fields are required" });
    }

    console.log("Referrer User ID being queried:", referrerUserId); // Log incoming ID

    // Convert referrerUserId to ObjectId
    const referrerId = new mongoose.Types.ObjectId(referrerUserId);
    console.log("Converted Referrer ObjectId:", referrerId); // Log converted ObjectId

    // Query the referrer user using findOne()
    const referrer = await Auth.findOne({ "_id": referrerId });
    console.log("Referrer Found:", referrer); // Log referrer after query

    if (!referrer) {
      return res.status(400).json({ error: "Referrer not found" });
    }

    if (referrer.referral_code !== referralCode) {
      return res.status(400).json({ error: "Invalid referral code" });
    }

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

    await referral.save();

    referrer.referralCount = (referrer.referralCount || 0) + 1;
    await referrer.save();

    res.status(201).json({ message: "Referral successfully handled", referral });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Server error" });
  }
};
