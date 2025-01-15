import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchTasks, updateTask, deleteTask, setStatusFilter, setSearchTerm } from '../store/tasksSlice';
import { Search, Trash2 } from 'lucide-react';
import {
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Box,
  Typography,
  IconButton,
  Card,
  CardContent,
  Grid,
  InputAdornment,
  CircularProgress
} from '@mui/material';

export function TaskList() {
  const dispatch = useDispatch();
  const { items, status, filter } = useSelector((state) => state.tasks);

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchTasks());
    }
  }, [status, dispatch]);

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const filteredTasks = items.filter(task => {
    const matchesStatus = !filter.status || task.status === filter.status;
    const matchesSearch = task.task_name.toLowerCase().includes(filter.search.toLowerCase()) ||
                         task.description?.toLowerCase().includes(filter.search.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const handleStatusChange = async (taskId, status) => {
    await dispatch(updateTask({ id: taskId, status }));
  };

  const handleDelete = async (taskId) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      await dispatch(deleteTask(taskId));
    }
  };

  if (status === 'loading') {
    return (
      <Box display="flex" justifyContent="center" p={4}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Box mb={4} display="flex" gap={2}>
        <TextField
          placeholder="Search tasks..."
          value={filter.search}
          onChange={(e) => dispatch(setSearchTerm(e.target.value))}
          fullWidth
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search size={20} />
              </InputAdornment>
            ),
          }}
        />
        <FormControl sx={{ minWidth: 120 }}>
          <InputLabel>Status</InputLabel>
          <Select
            value={filter.status || ''}
            onChange={(e) => dispatch(setStatusFilter(e.target.value || null))}
            label="Status"
          >
            <MenuItem value="">All</MenuItem>
            <MenuItem value="pending">Pending</MenuItem>
            <MenuItem value="in_progress">In Progress</MenuItem>
            <MenuItem value="completed">Completed</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {filteredTasks.length === 0 ? (
        <Typography textAlign="center" color="text.secondary">
          No tasks found
        </Typography>
      ) : (
        <Grid container spacing={2}>
          {filteredTasks.map((task) => (
            <Grid item xs={12} key={task._id}>
              <Card>
                <CardContent>
                  <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Box flex={1}>
                      <Typography variant="h6" component="h3">
                        {task.task_name}
                      </Typography>
                      {task.description && (
                        <Typography color="text.secondary" sx={{ mt: 1 }}>
                          {task.description}
                        </Typography>
                      )}
                      {task.due_date && (
                        <Typography color="text.secondary" variant="body2" sx={{ mt: 1 }}>
                          Due: {formatDate(task.due_date)}
                        </Typography>
                      )}
                    </Box>
                    <Box display="flex" alignItems="center" gap={2}>
                      <FormControl size="small">
                        <Select
                          value={task.status}
                          onChange={(e) => handleStatusChange(task._id, e.target.value)}
                          sx={{ minWidth: 120 }}
                        >
                          <MenuItem value="pending">Pending</MenuItem>
                          <MenuItem value="in_progress">In Progress</MenuItem>
                          <MenuItem value="completed">Completed</MenuItem>
                        </Select>
                      </FormControl>
                      <IconButton
                        onClick={() => handleDelete(task._id)}
                        color="error"
                        size="small"
                      >
                        <Trash2 size={20} />
                      </IconButton>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
}