// controllers/WalletController.js
const Wallet = require('../models/Wallet');
const WalletHistory = require('../models/WalletHistory');



exports.updateWallet = async (req, res) => {
  try {
    const { userId, purchasedAmount, purchasedCoins, rewardedCoins, referralCoins } = req.body;

    // Validate that userId is provided
    if (!userId) {
      return res.status(400).json({ error: "User ID is required" });
    }

    // Find wallet for the user
    let wallet = await Wallet.findOne({ userId });
    if (!wallet) {
      return res.status(404).json({ error: "Wallet not found for this user" });
    }

    // Update wallet based on the request data
    if (purchasedAmount !== undefined) {
      wallet.purchasedAmount += purchasedAmount;
      wallet.totalCoins -= purchasedAmount;  // Deduct the purchasedAmount from totalCoins
    }
    if (purchasedCoins !== undefined) wallet.purchasedCoins += purchasedCoins;
    if (rewardedCoins !== undefined) wallet.rewardedCoins += rewardedCoins;
    if (referralCoins !== undefined) wallet.referralCoins += referralCoins;

    // Recalculate totalCoins after updating
    wallet.totalCoins = wallet.purchasedCoins + wallet.rewardedCoins + wallet.referralCoins;

    // Save the updated wallet
    await wallet.save();

    // Create a history entry for the update
    const historyEntry = {
      userId,  // Ensure that userId is passed correctly here
      transactionType: 'update',  // You can specify the type of transaction (e.g., 'purchase', 'reward', etc.)
      amount: purchasedAmount || purchasedCoins || rewardedCoins || referralCoins,
      totalCoins: wallet.totalCoins,
      description: `Updated wallet with purchased amount: ${purchasedAmount}, purchased coins: ${purchasedCoins}, rewarded coins: ${rewardedCoins}, referral coins: ${referralCoins}`
    };

    // Save history entry to the WalletHistory model
    await WalletHistory.create(historyEntry);

    // Send success response with the updated wallet and history recorded
    res.status(200).json({
      message: "Wallet updated successfully and history recorded",
      wallet
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};


// Get Wallet History by User ID
exports.getWalletHistory = async (req, res) => {
  try {
    const userId = req.params.userId;

    // Fetch wallet history by user ID
    const history = await WalletHistory.find({ userId }).sort({ createdAt: -1 }); // Sort by most recent first
    if (!history.length) {
      return res.status(404).json({ error: "No wallet history found for this user" });
    }

    // Send the wallet history data
    res.status(200).json({ history });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};
