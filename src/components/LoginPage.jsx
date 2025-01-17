import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  TextField,
  Typography,
  Button,
  Alert,
  Container,
  Paper,
} from "@mui/material";
import axios from "axios";
import Cookies from "js-cookie";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:5000/api/user/login",
        { email, password },
        { withCredentials: true }
      );
      const token = response.data.token;
      setDataToCookie("localToken", token);
      navigate("/");
    } catch (err) {
      setError("Invalid credentials");
    }
  };

  const setDataToCookie = (key, value) => {
    Cookies.set(key, value, { expires: 1 / 24 }); // Cookie expires in 1 hour
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
            fullWidth
            variant="outlined"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <TextField
            label="Password"
            type="password"
            fullWidth
            variant="outlined"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <Button
            type="submit"
            variant="contained"
            color="primary"
            size="large"
            fullWidth
            sx={{
              mt: 2,
              textTransform: "none",
              borderRadius: "8px",
            }}
          >
            Login
          </Button>
        </Box>
        <Typography
          variant="body2"
          color="textSecondary"
          align="center"
          sx={{ mt: 2 }}
        >
          Don’t have an account?{" "}
          <Button
            variant="text"
            color="primary"
            size="small"
            onClick={() => navigate("/signup")}
            sx={{ textTransform: "none" }}
          >
            Sign up here
          </Button>
        </Typography>
      </Paper>
    </Container>
  );
};

export default LoginPage;
