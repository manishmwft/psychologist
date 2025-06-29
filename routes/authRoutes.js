const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Register route
router.post('/register', authController.registerUser);

// Login route
router.post('/login', authController.loginUser);

// Protected route (example)
router.get('/protected', authController.verifyToken, (req, res) => {
  res.status(200).json({ message: "This is a protected route", user: req.user });
});

router.get('/users', authController.getAllUsers);

module.exports = router;
