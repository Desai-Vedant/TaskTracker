import React from 'react';
import { Provider } from 'react-redux';
import { store } from './store/store';
import { TaskForm } from './components/TaskForm';
import { TaskList } from './components/TaskList';
import { ClipboardList } from 'lucide-react';
import { Container, Box, Typography, ThemeProvider, createTheme, CssBaseline } from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

const theme = createTheme({
  palette: {
    primary: {
      main: '#4f46e5',
    },
    background: {
      default: '#f3f4f6',
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <Provider store={store}>
          <Box sx={{ minHeight: '100vh', py: 4 }}>
            <Container maxWidth="md">
              <Box sx={{ textAlign: 'center', mb: 4 }}>
                <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
                  <ClipboardList size={48} color={theme.palette.primary.main} />
                </Box>
                <Typography variant="h3" component="h1" gutterBottom>
                  Task Tracker
                </Typography>
                <Typography variant="subtitle1" color="text.secondary">
                  Manage your tasks efficiently
                </Typography>
              </Box>

              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                <TaskForm />
                <TaskList />
              </Box>
            </Container>
          </Box>
        </Provider>
      </LocalizationProvider>
    </ThemeProvider>
  );
}

export default App;