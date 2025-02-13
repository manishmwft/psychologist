const Wallet = require('../models/Wallet');
const Auth = require('../models/Auth');

// Create or Update Wallet
exports.createOrUpdateWallet = async (req, res) => {
  try {
    const { userId, purchasedAmount, purchasedCoins, rewardedCoins, referralCoins } = req.body;

    // Validate that all fields are provided
    if (!userId || purchasedAmount === undefined || purchasedCoins === undefined || rewardedCoins === undefined || referralCoins === undefined) {
      return res.status(400).json({ error: "All fields are required" });
    }

    // Check if the user exists
    const user = await Auth.findById(userId);
    if (!user) {
      return res.status(400).json({ error: "User not found" });
    }

    // Calculate totalCoins
    const totalCoins = purchasedCoins + rewardedCoins + referralCoins;

    // Find or create the wallet for the user
    let wallet = await Wallet.findOne({ userId });
    if (wallet) {
      // If wallet exists, update the fields
      wallet.purchasedAmount += purchasedAmount;
      wallet.purchasedCoins += purchasedCoins;
      wallet.rewardedCoins += rewardedCoins;
      wallet.referralCoins += referralCoins;
      wallet.totalCoins = wallet.purchasedCoins + wallet.rewardedCoins + wallet.referralCoins;
      wallet.lastUpdated = Date.now();
    } else {
      // Create a new wallet if none exists
      wallet = new Wallet({
        userId,
        purchasedAmount,
        purchasedCoins,
        rewardedCoins,
        referralCoins,
        totalCoins,
      });
    }

    // Save wallet to the database
    await wallet.save();

    // Send success response
    res.status(201).json({
      message: "Wallet successfully updated",
      wallet,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};

// Get Wallet Info by User ID
exports.getWalletByUser = async (req, res) => {
  try {
    const userId = req.params.userId;

    // Fetch wallet by user ID
    const wallet = await Wallet.findOne({ userId });
    if (!wallet) {
      return res.status(404).json({ error: "Wallet not found for this user" });
    }

    // Send the wallet data
    res.status(200).json({ wallet });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};
