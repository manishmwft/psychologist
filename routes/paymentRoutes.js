const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');

// Route to make a payment
router.post('/make-payment', paymentController.makePayment);

router.get("/payments", paymentController.getAllTransactions); // Fetch all transactions
// Route to get payments by user ID
router.get('/:userId', paymentController.getPaymentsByUser);





module.exports = router;
