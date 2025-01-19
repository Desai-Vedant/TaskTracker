import express from "express";
import {
  loginUser,
  logoutUser,
  registerUser,
  getUser,
} from "../controllers/userController.js";
import authenticateToken from "../utils/authorization.js";

const router = express.Router();

// Register User
router.post("/register", registerUser);

// Login User
router.post("/login", loginUser);

// Logout User
router.post("/logout", logoutUser);

// Get User
router.post("/get", authenticateToken, getUser);

export default router;
