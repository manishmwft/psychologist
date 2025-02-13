const express = require('express');
const router = express.Router();
const walletController = require('../controllers/walletController');

// Route to create or update the wallet
router.post('/update-wallet', walletController.createOrUpdateWallet);

// Route to get wallet info by user ID
router.get('/:userId', walletController.getWalletByUser);

module.exports = router;
