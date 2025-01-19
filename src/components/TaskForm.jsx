import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { addTask } from '../store/tasksSlice';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { 
  TextField, 
  Button, 
  Box, 
  Card, 
  CardContent,
  useTheme as useMuiTheme,
  Alert,
  Fade,
  Paper,
  Typography,
  IconButton,
  useMediaQuery,
  InputAdornment,
  CircularProgress,
  Collapse,
} from '@mui/material';
import { PlusCircle, Calendar, X } from "lucide-react";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from 'dayjs';
import { useThemeContext } from '../contexts/ThemeContext';

export function TaskForm() {
  const dispatch = useDispatch();
  const theme = useMuiTheme();
  const { mode } = useThemeContext();
  const [taskName, setTaskName] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!taskName.trim()) {
      setError("Task name is required");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const newTask = {
        task_name: taskName.trim(),
        description: description.trim(),
        due_date: dueDate ? dueDate.toDate().toISOString() : null,
        status: "pending",
        created_at: new Date().toISOString(),
      };

      await dispatch(addTask(newTask)).unwrap();
      
      // Reset form
      setTaskName("");
      setDescription("");
      setDueDate(null);
      
      // Show success message
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError(err.message || "Failed to create task");
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearDate = () => {
    setDueDate(null);
  };

  return (
    <Paper 
      elevation={0} 
      sx={{ 
        p: { xs: 2, sm: 3 }, 
        borderRadius: 3,
        border: `1px solid ${
          mode === 'light'
            ? 'rgba(0, 0, 0, 0.12)'
            : 'rgba(255, 255, 255, 0.12)'
        }`,
      }}
    >
      <Typography 
        variant="h6" 
        component="h2" 
        gutterBottom
        sx={{
          fontWeight: 500,
          color: theme.palette.text.primary,
          mb: 3
        }}
      >
        Create New Task
      </Typography>

      <Collapse in={!!error}>
        <Alert 
          severity="error" 
          sx={{ mb: 2 }}
          onClose={() => setError("")}
        >
          {error}
        </Alert>
      </Collapse>

      <Collapse in={success}>
        <Alert 
          severity="success" 
          sx={{ mb: 2 }}
          onClose={() => setSuccess(false)}
        >
          Task created successfully!
        </Alert>
      </Collapse>

      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{ 
          display: "flex", 
          flexDirection: "column", 
          gap: 2.5 
        }}
      >
        <TextField
          label="Task Name"
          value={taskName}
          onChange={(e) => {
            setTaskName(e.target.value);
            if (error) setError("");
          }}
          required
          fullWidth
          disabled={isLoading}
          size={isMobile ? "small" : "medium"}
          sx={{
            '& .MuiOutlinedInput-root': {
              '&.Mui-focused fieldset': {
                borderColor: theme.palette.primary.main,
              },
            },
          }}
        />

        <TextField
          label="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          multiline
          rows={3}
          fullWidth
          disabled={isLoading}
          size={isMobile ? "small" : "medium"}
          placeholder="Add details about your task..."
          sx={{
            '& .MuiOutlinedInput-root': {
              '&.Mui-focused fieldset': {
                borderColor: theme.palette.primary.main,
              },
            },
          }}
        />

        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DatePicker
            label="Due Date"
            value={dueDate}
            onChange={setDueDate}
            disabled={isLoading}
            minDate={dayjs()}
            slots={{
              openPickerIcon: Calendar,
            }}
            slotProps={{
              textField: {
                fullWidth: true,
                size: isMobile ? "small" : "medium",
                InputProps: {
                  endAdornment: dueDate && (
                    <InputAdornment position="end">
                      <IconButton
                        edge="end"
                        onClick={handleClearDate}
                        size="small"
                      >
                        <X size={16} />
                      </IconButton>
                    </InputAdornment>
                  ),
                },
              },
            }}
          />
        </LocalizationProvider>

        <Button
          type="submit"
          variant="contained"
          disabled={isLoading}
          startIcon={isLoading ? <CircularProgress size={20} /> : <PlusCircle size={20} />}
          sx={{
            alignSelf: "flex-start",
            px: 3,
            py: 1,
            borderRadius: 2,
            textTransform: 'none',
            fontWeight: 500,
            boxShadow: 'none',
            '&:hover': {
              boxShadow: 'none',
            },
          }}
        >
          {isLoading ? 'Creating...' : 'Add Task'}
        </Button>
      </Box>
    </Paper>
  );
}
