const express = require('express');
const router = express.Router();
const referralController = require('../controllers/referralController');

// Route to generate referral code
router.post('/generate-referral-code', referralController.generateReferralCode);

// Route to handle new referral (when a user uses a referral code)
router.post('/handle-referral', referralController.handleReferral);

// Route to update referral reward status (when payment is processed)
router.post('/update-referral-reward', referralController.updateReferralRewardStatus);

module.exports = router;
