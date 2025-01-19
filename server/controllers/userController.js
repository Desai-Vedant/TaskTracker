import User from "../models/User.js";
import dotenv from "dotenv";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import express from "express";

dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) throw new Error("JWT_SECRET is not defined");

// Register
export const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required!" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: "User already exists!" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    try {
      const user = await User.create({ name, email, password: hashedPassword });
      res.status(201).json({ message: "User created successfully!" });
    } catch (error) {
      res.status(500).json({ message: "Error creating user", error });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Login
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Input validation
    if (!email || !password) {
      return res.status(400).json({ 
        status: 'error',
        message: "Email and password are required!" 
      });
    }

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ 
        status: 'error',
        message: "Invalid email format" 
      });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ 
        status: 'error',
        message: "Invalid credentials" 
      });
    }

    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      return res.status(401).json({ 
        status: 'error',
        message: "Invalid credentials" 
      });
    }

    const token = jwt.sign(
      {
        user_id: user._id,
        email: user.email,
        name: user.name
      },
      JWT_SECRET,
      { expiresIn: "1h" }
    );

    // Set HTTP-only cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax", // Explicitly set to lax for better security and compatibility
      maxAge: 3600000 // 1 hour
    });

    // Also send token in response for client-side storage
    return res.status(200).json({
      status: 'success',
      message: "Login successful",
      user: { 
        id: user._id, 
        email: user.email, 
        name: user.name 
      },
      token
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ 
      status: 'error',
      message: "An error occurred during login" 
    });
  }
};

// Logout
export const logoutUser = async (req, res) => {
  try {
    // Clear the HTTP-only cookie
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax" // Explicitly set to lax for better security and compatibility
    });

    return res.status(200).json({ 
      status: 'success',
      message: "Logged out successfully" 
    });
  } catch (error) {
    console.error("Logout error:", error);
    res.status(500).json({ 
      status: 'error',
      message: "An error occurred during logout" 
    });
  }
};

// Get User
export const getUser = async (req, res) => {
  try {
    const user_id = req.user.user_id;
    const user = await User.findById(user_id);
    res.status(200).json({ name: user.name, email: user.email });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};
