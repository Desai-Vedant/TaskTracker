import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  Box,
  TextField,
  Typography,
  Button,
  Alert,
  Container,
  Paper,
  CircularProgress,
  IconButton,
  InputAdornment,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import Cookies from "js-cookie";
import { useDispatch } from "react-redux";
import { clearTasks } from "../store/tasksSlice";
import { apiClient } from "../config/api";

const LoginPage = ({ setAuth }) => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Clear any existing errors when component mounts
  useEffect(() => {
    setError("");
    // Clear any existing tasks when login page mounts
    dispatch(clearTasks());
  }, [dispatch]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error when user starts typing
    if (error) setError("");
  };

  const validateForm = () => {
    if (!formData.email || !formData.password) {
      setError("All fields are required");
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError("Please enter a valid email address");
      return false;
    }
    return true;
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);
    setError("");

    try {
      const response = await apiClient.post("/user/login", formData);

      if (response.data.status === "success") {
        // Clear any existing tasks before setting new user data
        dispatch(clearTasks());
        // Store token in cookie
        Cookies.set("localToken", response.data.token, {
          expires: 12 / 24, // 12 hours
          sameSite: "None",
          secure: true, // Required when sameSite is 'None'
        });

        // Store user data
        localStorage.setItem("user", JSON.stringify(response.data.user));

        // Update auth state
        setAuth(true);

        // Redirect to home
        navigate("/");
      } else {
        setError(response.data.message || "Login failed");
      }
    } catch (err) {
      setError(err.response?.data?.message || "An error occurred during login");
    } finally {
      setIsLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 8 }}>
      <Paper elevation={6} sx={{ padding: 4, borderRadius: "16px" }}>
        <Box
          sx={{
            textAlign: "center",
            mb: 3,
          }}
        >
          <Typography variant="h4" component="h1" gutterBottom>
            Login to Your Account
          </Typography>
          <Typography variant="subtitle1" color="textSecondary">
            Access your tasks by logging in.
          </Typography>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Box
          component="form"
          onSubmit={handleLogin}
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 2,
          }}
        >
          <TextField
            label="Email Address"
            type="email"
            name="email"
            fullWidth
            variant="outlined"
            value={formData.email}
            onChange={handleInputChange}
            required
            disabled={isLoading}
            error={!!error && error.includes("email")}
          />

          <TextField
            label="Password"
            type={showPassword ? "text" : "password"}
            name="password"
            fullWidth
            variant="outlined"
            value={formData.password}
            onChange={handleInputChange}
            required
            disabled={isLoading}
            error={!!error && error.includes("password")}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={togglePasswordVisibility}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          <Button
            type="submit"
            variant="contained"
            color="primary"
            size="large"
            fullWidth
            disabled={isLoading}
            sx={{
              mt: 2,
              textTransform: "none",
              borderRadius: "8px",
              height: "48px",
            }}
          >
            {isLoading ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              "Login"
            )}
          </Button>

          <Box sx={{ mt: 2, textAlign: "center" }}>
            <Typography variant="body2" color="textSecondary">
              Don't have an account?{" "}
              <Link
                to="/signup"
                style={{ color: "primary.main", textDecoration: "none" }}
              >
                Sign up
              </Link>
            </Typography>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
};

export default LoginPage;
