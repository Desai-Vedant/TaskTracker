import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { addTask } from '../store/tasksSlice';
import { PlusCircle } from 'lucide-react';
import { TextField, Button, Paper, Box } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

export function TaskForm() {
  const dispatch = useDispatch();
  const [taskName, setTaskName] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!taskName.trim()) return;

    const newTask = {
      task_name: taskName,
      description,
      due_date: dueDate?.toISOString() || null,
      status: 'pending',
      created_at: new Date().toISOString()
    };

    await dispatch(addTask(newTask));

    setTaskName('');
    setDescription('');
    setDueDate(null);
  };

  return (
    <Paper elevation={3} sx={{ p: 3 }}>
      <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <TextField
          label="Task Name"
          value={taskName}
          onChange={(e) => setTaskName(e.target.value)}
          required
          fullWidth
        />

        <TextField
          label="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          multiline
          rows={3}
          fullWidth
        />

        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DatePicker
            label="Due Date"
            value={dueDate}
            onChange={setDueDate}
            slotProps={{
              textField: {
                fullWidth: true,
              },
            }}
          />
        </LocalizationProvider>

        <Button
          type="submit"
          variant="contained"
          startIcon={<PlusCircle />}
          sx={{ alignSelf: 'flex-start' }}
        >
          Add Task
        </Button>
      </Box>
    </Paper>
  );
}