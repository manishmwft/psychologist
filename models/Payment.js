const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'Auth', required: true }, // Reference to the user
    transactionId: { type: String, required: true, unique: true }, // Unique transaction ID
    amount: { type: Number, required: true }, // Transaction amount
    paymentDate: { type: Date, default: Date.now }, // Date of transaction
    product: { 
      type: String, 
      required: true  
    }
  },
  { timestamps: true }
);

const Payment = mongoose.model('Payment', paymentSchema);

module.exports = Payment;
