import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import taskRoutes from "./routes/taskRoutes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch((error) => console.error("MongoDB connection error:", error));

// Task Schema
const taskSchema = new mongoose.Schema({
  task_name: { type: String, required: true },
  description: String,
  status: { type: String, default: "pending" },
  due_date: Date,
  created_at: { type: Date, default: Date.now },
});

export const Task = mongoose.model("Task", taskSchema);

// Routes
app.use("/api/tasks", taskRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
