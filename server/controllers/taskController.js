import Task from "../models/Task.js";

// Get All Tasks
export const getAllTasks = async (req, res) => {
  try {
    const user_id = req.user.user_id;
    const tasks = await Task.find({ user_id }).sort({ created_at: -1 });
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create a Task
export const createTask = async (req, res) => {
  const task = new Task({
    task_name: req.body.task_name,
    description: req.body.description,
    status: req.body.status,
    due_date: req.body.due_date,
    user_id: req.user.user_id,
  });
  try {
    const newTask = await task.save();
    res.status(201).json(newTask);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Update a Task
export const updateTask = async (req, res) => {
  try {
    const user_id = req.user.user_id;
    const taskId = req.params.id;
    
    // First check if the task belongs to the user
    const existingTask = await Task.findOne({ _id: taskId, user_id });
    if (!existingTask) {
      return res.status(404).json({ message: "Task not found or unauthorized" });
    }

    // Update the task
    const task = await Task.findByIdAndUpdate(
      taskId,
      { ...req.body, user_id }, // Ensure user_id cannot be changed
      { new: true }
    );
    
    res.json(task);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete a task
export const deleteTask = async (req, res) => {
  try {
    const user_id = req.user.user_id;
    const taskId = req.params.id;

    // First check if the task belongs to the user
    const existingTask = await Task.findOne({ _id: taskId, user_id });
    if (!existingTask) {
      return res.status(404).json({ message: "Task not found or unauthorized" });
    }

    await Task.findByIdAndDelete(taskId);
    res.json({ message: "Task deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
