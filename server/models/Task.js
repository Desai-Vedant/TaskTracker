import mongoose from "mongoose";

// Task Schema
const taskSchema = new mongoose.Schema({
  task_name: { type: String, required: true },
  description: String,
  status: { 
    type: String, 
    enum: ['pending', 'in_progress', 'completed'],
    default: "pending" 
  },
  due_date: Date,
  created_at: { type: Date, default: Date.now },
  user_id: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User',
    required: true 
  }
});

// Index for faster queries by user_id
taskSchema.index({ user_id: 1 });

const Task = mongoose.model("Task", taskSchema);

export default Task;
