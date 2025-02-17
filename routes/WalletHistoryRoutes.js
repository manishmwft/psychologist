const express = require('express');
const router = express.Router();
const WalletHistoryController = require('../controllers/WalletHistoryController');  // Import the correct controller

// Update Wallet
router.put('/update', WalletHistoryController.updateWallet);

// Get Wallet History by User ID
router.get('/:userId', WalletHistoryController.getWalletHistory);

module.exports = router;
