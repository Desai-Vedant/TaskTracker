import express from "express";
import {
  getAllTasks,
  createTask,
  updateTask,
  deleteTask,
} from "../controllers/taskController.js";
import authenticateToken from "../utils/authorization.js";

const router = express.Router();

// Get all tasks
router.get("/", authenticateToken, getAllTasks);

// Create a task
router.post("/", authenticateToken, createTask);

// Update a task
router.patch("/:id", authenticateToken, updateTask);

// Delete a task
router.delete("/:id", authenticateToken, deleteTask);

export default router;
