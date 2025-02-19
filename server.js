const express = require('express');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const walletRoutes = require('./routes/walletRoutes');
const referralRoutes = require('./routes/referralRoutes');
const WalletHistoryRoutes = require('./routes/WalletHistoryRoutes');

// Load environment variables
dotenv.config();

// Import the DB connection function
const connectDB = require('./config/db');

// Connect to the database
connectDB();

const app = express();

app.use(cors());


// Body parser middleware
app.use(bodyParser.json());

// Use routes
app.use('/api/auth', authRoutes);
app.use('/api/payment', paymentRoutes);
app.use('/api/wallet', walletRoutes);
app.use('/api/referral', referralRoutes);
app.use('/api/wallethistory', WalletHistoryRoutes);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
