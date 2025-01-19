import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { apiClient } from "../config/api";

const initialState = {
  items: [],
  status: "idle",
  error: null,
  filter: {
    status: null,
    search: "",
  },
};

// Async Thunks using apiClient
export const fetchTasks = createAsyncThunk("tasks/fetchTasks", async () => {
  try {
    const response = await apiClient.get("/tasks");
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to fetch tasks");
  }
});

export const addTask = createAsyncThunk("tasks/addTask", async (task) => {
  try {
    const response = await apiClient.post("/tasks", task);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to add task");
  }
});

export const updateTask = createAsyncThunk(
  "tasks/updateTask",
  async ({ id, ...updates }) => {
    try {
      const response = await apiClient.patch(`/tasks/${id}`, updates);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || "Failed to update task");
    }
  }
);

export const deleteTask = createAsyncThunk("tasks/deleteTask", async (id) => {
  try {
    await apiClient.delete(`/tasks/${id}`);
    return id;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to delete task");
  }
});

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
    setStatusFilter: (state, action) => {
      state.filter.status = action.payload;
    },
    setSearchTerm: (state, action) => {
      state.filter.search = action.payload;
    },
  },
  extraReducers: (builder) => {
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
        const index = state.items.findIndex((task) => task._id === action.payload._id);
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
