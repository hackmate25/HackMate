import UserModel from "../Modules/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import sgMail from "@sendgrid/mail";
import logger from "../utils/logger.js";

dotenv.config();

const otpStore = {}; // in-memory store

// ✅ Initialize SendGrid
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// --- SIGNUP INIT ---
const signupInit = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // check if user exists
    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      return res.status(409).json({
        message: "User already exists. Please login.",
        success: false,
      });
    }

    // generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // store temporarily
    otpStore[email] = {
      name,
      email,
      password: hashedPassword,
      otp,
      createdAt: Date.now(),
    };

    console.log("Sending OTP to:", email);

    // send OTP email with SendGrid
    const msg = {
      to: email,
      from: process.env.EMAIL_FROM, // Verified sender
      subject: "Your OTP for Signup",
      text: `Your OTP is ${otp}. It will expire in 5 minutes.`,
    };

    await sgMail.send(msg);

    // OTP sent

    return res.status(200).json({
      message: "OTP sent to email",
      success: true,
    });
  } catch (error) {
    logger.error("Error in signup-init:", error);
    return res.status(500).json({
      message: "Error in signup-init",
      success: false,
      error: error.message,
    });
  }
};


// --- VERIFY OTP ---
// --- VERIFY OTP ---
const verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    const storedData = otpStore[email];
    if (!storedData) {
      return res.status(400).json({ message: "OTP expired or not requested", success: false });
    }

    // check expiry
    if (Date.now() - storedData.createdAt > 5 * 60 * 1000) {
      delete otpStore[email];
      return res.status(400).json({ message: "OTP expired", success: false });
    }

    // check OTP match
    if (storedData.otp !== otp) {
      return res.status(400).json({ message: "Invalid OTP", success: false });
    }

    // create user (basic info only)
    const newUser = new UserModel({
      name: storedData.name,
      email: storedData.email,
      password: storedData.password,
    });
    await newUser.save();

    // cleanup
    delete otpStore[email];

    // generate JWT with longer expiration for persistent sessions
    const token = jwt.sign(
      { email: newUser.email, id: newUser._id },
      process.env.JWT_SECRET,
      { expiresIn: "30d" } // 30 days for persistent login
    );

    return res.status(201).json({
      message: "Signup successful",
      success: true,
      token,
      user: { name: newUser.name, email: newUser.email, id: newUser._id },
    });
  } catch (error) {
    logger.error("Error verifying OTP:", error);
    res.status(500).json({ message: "Error verifying OTP", success: false, error: error.message });
  }
};


// --- LOGIN ---
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await UserModel.findOne({ email });
    if (!user) {
      return res.status(404).json({
        message: "User not found. Please register.",
        success: false,
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        message: "Invalid credentials",
        success: false,
      });
    }

    const token = jwt.sign(
      { email: user.email, id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "30d" } // 30 days for persistent login
    );

    res.status(200).json({
      message: "Login successful",
      success: true,
      token,
      user: { name: user.name, email: user.email, id: user._id },
    });
  } catch (error) {
    logger.error("Error in login:", error);
    res.status(500).json({
      message: "Error in login",
      success: false,
      error: error.message,
    });
  }
};

// --- VERIFY TOKEN ---
const verifyToken = async (req, res) => {
  try {
    const authHeader = req.headers['authorization'];
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'No token provided'
      });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Find user to ensure they still exist
    const user = await UserModel.findById(decoded.id).select('-password');
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.status(200).json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email
      }
    });
  } catch (error) {
    logger.error("Error verifying token:", error);
    res.status(401).json({
      success: false,
      message: 'Invalid or expired token'
    });
  }
};

export { signupInit, verifyOtp, login, verifyToken };
