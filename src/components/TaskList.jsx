import React, { useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchTasks, updateTask, deleteTask, setStatusFilter, setSearchTerm } from '../store/tasksSlice';
import { Search, Trash2, CheckCircle, Clock, PlayCircle } from 'lucide-react';
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
  CircularProgress,
  Chip,
  useTheme as useMuiTheme,
  useMediaQuery,
  Tooltip,
  Fade,
  Alert,
} from '@mui/material';
import dayjs from 'dayjs';
import localizedFormat from 'dayjs/plugin/localizedFormat';
import { useThemeContext } from '../contexts/ThemeContext';

dayjs.extend(localizedFormat);

const statusIcons = {
  pending: <Clock size={16} />,
  in_progress: <PlayCircle size={16} />,
  completed: <CheckCircle size={16} />,
};

const statusColors = {
  pending: '#f59e0b',
  in_progress: '#3b82f6',
  completed: '#10b981',
};

export function TaskList() {
  const dispatch = useDispatch();
  const { items, status, filter, error } = useSelector((state) => state.tasks);
  const theme = useMuiTheme();
  const { mode } = useThemeContext();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    if (status === 'idle' && user?.id) {
      dispatch(fetchTasks());
    }
  }, [status, dispatch]);

  const formatDate = (dateString) => {
    if (!dateString) return 'No due date';
    try {
      const date = dayjs(dateString);
      if (!date.isValid()) return 'Invalid date';
      return date.format('LL');
    } catch (error) {
      return 'Invalid date';
    }
  };

  const filteredTasks = useMemo(() => {
    return items.filter(task => {
      const matchesStatus = !filter.status || task.status === filter.status;
      const searchTerm = filter.search.toLowerCase();
      const matchesSearch = !searchTerm || 
        task.task_name.toLowerCase().includes(searchTerm) ||
        task.description?.toLowerCase().includes(searchTerm);
      return matchesStatus && matchesSearch;
    });
  }, [items, filter]);

  const handleStatusChange = async (taskId, status) => {
    try {
      await dispatch(updateTask({ id: taskId, status })).unwrap();
    } catch (error) {
      console.error('Failed to update task status:', error);
    }
  };

  const handleDelete = async (taskId) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        await dispatch(deleteTask(taskId)).unwrap();
      } catch (error) {
        console.error('Failed to delete task:', error);
      }
    }
  };

  if (status === 'loading') {
    return (
      <Box 
        display="flex" 
        justifyContent="center" 
        alignItems="center" 
        minHeight="200px"
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}
      
      <Box 
        mb={4} 
        display="flex" 
        gap={2}
        flexDirection={isMobile ? 'column' : 'row'}
      >
        <TextField
          placeholder="Search tasks..."
          value={filter.search}
          onChange={(e) => dispatch(setSearchTerm(e.target.value))}
          fullWidth
          size={isMobile ? 'small' : 'medium'}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search size={20} />
              </InputAdornment>
            ),
          }}
        />
        <FormControl sx={{ minWidth: isMobile ? '100%' : 200 }}>
          <InputLabel>Status</InputLabel>
          <Select
            value={filter.status || ''}
            onChange={(e) => dispatch(setStatusFilter(e.target.value || null))}
            label="Status"
            size={isMobile ? 'small' : 'medium'}
          >
            <MenuItem value="">All</MenuItem>
            <MenuItem value="pending">
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Clock size={16} color={statusColors.pending} />
                Pending
              </Box>
            </MenuItem>
            <MenuItem value="in_progress">
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <PlayCircle size={16} color={statusColors.in_progress} />
                In Progress
              </Box>
            </MenuItem>
            <MenuItem value="completed">
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <CheckCircle size={16} color={statusColors.completed} />
                Completed
              </Box>
            </MenuItem>
          </Select>
        </FormControl>
      </Box>

      {filteredTasks.length === 0 ? (
        <Box 
          sx={{ 
            textAlign: "center", 
            py: 8,
            backgroundColor: theme.palette.mode === 'light' 
              ? 'rgba(0, 0, 0, 0.02)' 
              : 'rgba(255, 255, 255, 0.02)',
            borderRadius: 2,
          }}
        >
          <Typography color="text.secondary" gutterBottom>
            No tasks found
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {filter.search || filter.status 
              ? "Try adjusting your filters"
              : "Create a new task to get started"}
          </Typography>
        </Box>
      ) : (
        <Grid container spacing={2}>
          {filteredTasks.map((task) => (
            <Grid item xs={12} sm={6} md={4} key={task._id}>
              <Card 
                elevation={0}
                sx={{
                  height: '100%',
                  transition: 'transform 0.2s, box-shadow 0.2s',
                  '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: theme.shadows[4],
                  },
                  border: `1px solid ${
                    theme.palette.mode === 'light'
                      ? 'rgba(0, 0, 0, 0.12)'
                      : 'rgba(255, 255, 255, 0.12)'
                  }`,
                }}
              >
                <CardContent>
                  <Box 
                    sx={{ 
                      display: 'flex', 
                      justifyContent: 'space-between',
                      alignItems: 'flex-start',
                      mb: 2 
                    }}
                  >
                    <Typography 
                      variant="h6" 
                      component="h3"
                      sx={{ 
                        fontSize: '1.1rem',
                        fontWeight: 500,
                        wordBreak: 'break-word'
                      }}
                    >
                      {task.task_name}
                    </Typography>
                    <Tooltip title="Delete task" TransitionComponent={Fade}>
                      <IconButton
                        size="small"
                        onClick={() => handleDelete(task._id)}
                        sx={{ 
                          ml: 1,
                          color: theme.palette.error.main,
                          '&:hover': {
                            backgroundColor: theme.palette.error.main + '1A',
                          }
                        }}
                      >
                        <Trash2 size={18} />
                      </IconButton>
                    </Tooltip>
                  </Box>

                  {task.description && (
                    <Typography 
                      variant="body2" 
                      color="text.secondary"
                      sx={{ 
                        mb: 2,
                        display: '-webkit-box',
                        WebkitLineClamp: 3,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                      }}
                    >
                      {task.description}
                    </Typography>
                  )}

                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography 
                      variant="caption" 
                      color="text.secondary"
                      sx={{ display: 'block' }}
                    >
                      {formatDate(task.due_date)}
                    </Typography>
                    
                    <FormControl size="small">
                      <Select
                        value={task.status}
                        onChange={(e) => handleStatusChange(task._id, e.target.value)}
                        variant="standard"
                        sx={{
                          '.MuiSelect-select': {
                            display: 'flex',
                            alignItems: 'center',
                            gap: 0.5,
                            py: 0.5,
                            pr: 2,
                          },
                        }}
                      >
                        {Object.entries(statusIcons).map(([value, icon]) => (
                          <MenuItem key={value} value={value}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              {React.cloneElement(icon, { color: statusColors[value] })}
                              <Typography variant="body2" sx={{ textTransform: 'capitalize' }}>
                                {value.replace('_', ' ')}
                              </Typography>
                            </Box>
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
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