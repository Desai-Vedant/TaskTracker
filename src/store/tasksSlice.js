import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { apiEndpoints } from "../config/api";

const API_URL = "http://localhost:5000/api";

const initialState = {
  items: [],
  status: "idle",
  error: null,
  filter: {
    status: null,
    search: "",
  },
};

// Create an axios instance for centralized configuration
const apiClient = axios.create({
  baseURL: apiEndpoints.tasks,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

// Async Thunks using axios
export const fetchTasks = createAsyncThunk("tasks/fetchTasks", async () => {
  try {
    const response = await apiClient.get("");
    return response.data; // Assuming the API returns an array of tasks
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to fetch tasks");
  }
});

export const addTask = createAsyncThunk("tasks/addTask", async (task) => {
  try {
    const response = await apiClient.post("", task);
    return response.data; // Assuming the API returns the newly created task
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to add task");
  }
});

export const updateTask = createAsyncThunk(
  "tasks/updateTask",
  async ({ id, ...updates }) => {
    try {
      const response = await apiClient.patch(`/${id}`, updates);
      return response.data; // Assuming the API returns the updated task
    } catch (error) {
      throw new Error(error.response?.data?.message || "Failed to update task");
    }
  }
);

export const deleteTask = createAsyncThunk("tasks/deleteTask", async (id) => {
  try {
    await apiClient.delete(`/${id}`);
    return id; // Return the ID of the deleted task
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to delete task");
  }
});

// Slice definition
const tasksSlice = createSlice({
  name: "tasks",
  initialState,
  reducers: {
    clearTasks: (state) => {
      state.items = [];
      state.status = "idle";
      state.error = null;
      state.filter = {
        status: null,
        search: "",
      };
    },
    setStatusFilter(state, action) {
      state.filter.status = action.payload;
    },
    setSearchTerm(state, action) {
      state.filter.search = action.payload;
    },
  },
  extraReducers(builder) {
    builder
      .addCase(fetchTasks.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchTasks.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items = action.payload;
      })
      .addCase(fetchTasks.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(addTask.fulfilled, (state, action) => {
        state.items.unshift(action.payload);
      })
      .addCase(updateTask.fulfilled, (state, action) => {
        const index = state.items.findIndex(
          (task) => task._id === action.payload._id
        );
        if (index !== -1) {
          state.items[index] = action.payload;
        }
      })
      .addCase(deleteTask.fulfilled, (state, action) => {
        state.items = state.items.filter((task) => task._id !== action.payload);
      });
  },
});

export const { setStatusFilter, setSearchTerm, clearTasks } = tasksSlice.actions;
export default tasksSlice.reducer;
