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
    const task = await Task.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.json(task);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete a task
export const deleteTask = async (req, res) => {
  try {
    await Task.findByIdAndDelete(req.params.id);
    res.json({ message: "Task deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
