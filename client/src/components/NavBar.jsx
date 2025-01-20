import React, { useState } from 'react';
import { 
  AppBar, 
  Toolbar, 
  Typography, 
  Box, 
  IconButton, 
  Menu, 
  MenuItem, 
  useMediaQuery,
  useTheme as useMuiTheme,
  Avatar,
  Tooltip,
  Button,
  ListItemIcon,
} from '@mui/material';
import { LogOut, Menu as MenuIcon, Sun, Moon, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { clearTasks } from '../store/tasksSlice';
import Logo from './Logo';
import { apiClient } from '../config/api';
import { useThemeContext } from '../contexts/ThemeContext';
import Cookies from 'js-cookie';

const NavBar = ({ setAuth }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const { mode, toggleTheme } = useThemeContext();
  const muiTheme = useMuiTheme();
  const isMobile = useMediaQuery(muiTheme.breakpoints.down('sm'));
  const [anchorEl, setAnchorEl] = useState(null);
  const isAuthenticated = !!user?.name;

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    handleMenuClose();
    try {
      await apiClient.post('/user/logout');
      dispatch(clearTasks());
      setAuth(false);
      Cookies.remove('localToken');
      Cookies.remove('token')
      localStorage.clear();
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const handleLogin = () => {
    // Clear tasks when navigating to login
    dispatch(clearTasks());
    navigate('/login');
  };

  const handleSignup = () => {
    // Clear tasks when navigating to signup
    dispatch(clearTasks());
    navigate('/signup');
  };

  const getInitials = (name) => {
    return name.charAt(0).toUpperCase();
  };

  return (
    <AppBar 
      position="sticky" 
      elevation={0} 
      sx={{ 
        backdropFilter: 'blur(8px)',
        backgroundColor: mode === 'light' 
          ? 'rgba(255, 255, 255, 0.8)' 
          : 'rgba(31, 41, 55, 0.8)',
        borderBottom: 1,
        borderColor: mode === 'light' 
          ? 'rgba(0, 0, 0, 0.12)' 
          : 'rgba(255, 255, 255, 0.12)',
      }}
    >
      <Toolbar>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            flexGrow: 1,
            cursor: 'pointer',
          }}
          onClick={() => navigate(isAuthenticated ? '/' : '/login')}
        >
          <Logo size={28} />
          <Typography 
            variant="h6" 
            component="div" 
            sx={{ 
              fontWeight: 600,
              background: mode === 'light'
                ? 'linear-gradient(45deg, #4f46e5, #ec4899)'
                : 'linear-gradient(45deg, #6366f1, #f472b6)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            Task Tracker
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <IconButton
            onClick={toggleTheme}
            size="small"
            sx={{ 
              color: mode === 'light' ? 'text.primary' : 'text.primary',
            }}
          >
            {mode === 'light' ? (
              <Moon size={20} />
            ) : (
              <Sun size={20} />
            )}
          </IconButton>

          {isAuthenticated ? (
            <>
              {!isMobile && (
                <Typography 
                  variant="body1" 
                  sx={{ 
                    color: mode === 'light' ? 'text.primary' : 'text.primary',
                  }}
                >
                  Welcome, {user.name}
                </Typography>
              )}

              <Tooltip title="Account settings">
                <IconButton
                  onClick={handleMenuOpen}
                  size="small"
                  sx={{ 
                    ml: 2,
                    color: mode === 'light' ? 'text.primary' : 'text.primary',
                  }}
                  aria-controls={Boolean(anchorEl) ? 'account-menu' : undefined}
                  aria-haspopup="true"
                  aria-expanded={Boolean(anchorEl) ? 'true' : undefined}
                >
                  <Avatar 
                    sx={{ 
                      width: 32, 
                      height: 32,
                      bgcolor: mode === 'light' ? 'primary.main' : 'primary.dark',
                      color: '#fff',
                    }}
                  >
                    {getInitials(user.name)}
                  </Avatar>
                </IconButton>
              </Tooltip>

              <Menu
                anchorEl={anchorEl}
                id="account-menu"
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
                onClick={handleMenuClose}
                PaperProps={{
                  elevation: 0,
                  sx: {
                    overflow: 'visible',
                    filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.15))',
                    mt: 1.5,
                    bgcolor: mode === 'light' ? 'background.paper' : 'background.paper',
                    color: mode === 'light' ? 'text.primary' : 'text.primary',
                    '& .MuiMenuItem-root': {
                      py: 1,
                      px: 2.5,
                    },
                    '&:before': {
                      content: '""',
                      display: 'block',
                      position: 'absolute',
                      top: 0,
                      right: 14,
                      width: 10,
                      height: 10,
                      bgcolor: mode === 'light' ? 'background.paper' : 'background.paper',
                      transform: 'translateY(-50%) rotate(45deg)',
                      zIndex: 0,
                    },
                  },
                }}
                transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
              >
                <MenuItem onClick={handleLogout}>
                  <ListItemIcon>
                    <LogOut size={20} style={{ color: muiTheme.palette.error.main }} />
                  </ListItemIcon>
                  Logout
                </MenuItem>
              </Menu>
            </>
          ) : (
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button
                variant="outlined"
                color="primary"
                onClick={handleLogin}
                sx={{ textTransform: 'none' }}
              >
                Login
              </Button>
              <Button
                variant="contained"
                color="primary"
                onClick={handleSignup}
                sx={{ textTransform: 'none' }}
              >
                Sign up
              </Button>
            </Box>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default NavBar;
