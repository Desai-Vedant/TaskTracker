import mongoose from "mongoose";

// Task Schema
const taskSchema = new mongoose.Schema({
  task_name: { type: String, required: true },
  description: String,
  status: { type: String, default: "pending" },
  due_date: Date,
  created_at: { type: Date, default: Date.now },
  user_id: { type: String },
});

const Task = mongoose.model("Task", taskSchema);

export default Task;
