const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Auth = require('../models/Auth');

// Register User
exports.registerUser = async (req, res) => {
  try {
    const { name, email, password, referal_code } = req.body;

    // Simple validation
    if (!name || !email || !password) {
      return res.status(400).json({ error: "All fields are required" });
    }

    // Check if email already exists
    const existingUser = await Auth.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "Email already in use" });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Generate referral code automatically if not provided
    const generatedReferalCode = referal_code || `REF-${Math.random().toString(36).substring(2, 10).toUpperCase()}`;


    // Create new user
    const newUser = new Auth({ 
      name, 
      email, 
      password: hashedPassword, 
      referal_code: generatedReferalCode 
    });

    // Save user to DB
    await newUser.save();

    // Return success message
    res.status(201).json({ message: "User registered successfully", user: newUser });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};

// Login User & Generate JWT
exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    // Find user by email
    const user = await Auth.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: "Invalid credentials" });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.error('Password mismatch');  // Log password mismatch
      return res.status(400).json({ error: "Invalid credentials" });
    }

    // JWT secret key (ensure it's set in the environment)
    if (!process.env.JWT_SECRET) {
      console.error('JWT_SECRET is not set in the environment variables');
      return res.status(500).json({ error: "Internal Server Error" });
    }

    // Generate JWT token
    const payload = {
      userId: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      referal_code: user.referal_code,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt
    };
    
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });

    // Send back the token and full user details
    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        referal_code: user.referal_code,
        role: user.role,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
      }
    });
  } catch (error) {
    console.error('Server error:', error);  // Log complete error
    res.status(500).json({ error: error.message || "Server error" });
  }
};

  
// Middleware to protect routes using JWT token
exports.verifyToken = (req, res, next) => {

  const token = req.headers['authorization'];

  if (!token) {
    return res.status(403).json({ error: "Access denied, token required" });
  }

  try {
    // Remove 'Bearer' part from the token
    const jwtToken = token.split(' ')[1];

    // Verify token
    const decoded = jwt.verify(jwtToken, process.env.JWT_SECRET);
    req.user = decoded;
    next(); // Proceed to the next middleware/route handler
  } catch (error) {
    res.status(403).json({ error: "Invalid or expired token" });
  }
};


// Get All Users
exports.getAllUsers = async (req, res) => {
  try {
    const users = await Auth.find().select('-password'); // Exclude password for security
    res.status(200).json({ users });
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ error: "Server error" });
  }
};
