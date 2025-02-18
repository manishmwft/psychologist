const Payment = require('../models/Payment');
const Auth = require('../models/Auth');
const { v4: uuidv4 } = require('uuid'); // Import uuid package

// Make Payment
exports.makePayment = async (req, res) => {
  try {
    const { userId, amount, transactionId,product } = req.body;

    // Validate that all necessary fields are provided
    if (!userId || !amount || !transactionId || !product) {
      return res.status(400).json({ error: "All fields are required" });
    }

    // Check if the user exists
    const user = await Auth.findById(userId);
    if (!user) {
      return res.status(400).json({ error: "User not found" });
    }

    // Create a new payment record
    const newPayment = new Payment({
      userId,
      transactionId,
      amount,
      product,
      paymentDate: new Date(),
    });

    // Save payment to the database
    await newPayment.save();

    // Send back success response
    res.status(201).json({
      message: "Payment successful",
      payment: newPayment,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};


exports.getAllTransactions = async (req, res) => {
  try {
    console.log("Fetching all transactions...");
    
    // Fetch all transactions from the database
    const transactions = await Payment.find();
    console.log("Transactions fetched:", transactions);

    if (!transactions || transactions.length === 0) {
      console.log("No transactions found.");
      return res.status(404).json({ error: "No transactions found" });
    }

    res.status(200).json({ transactions });
  } catch (error) {
    console.error("Error fetching transactions:", error);
    res.status(500).json({ error: "Server error" });
  }
};

// Get All Payments by User
exports.getPaymentsByUser = async (req, res) => {
  try {
    const userId = req.params.userId;

    // Fetch all payments made by the user
    const payments = await Payment.find({ userId });

    if (!payments) {
      return res.status(404).json({ error: "No payments found for this user" });
    }

    res.status(200).json({ payments });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};


