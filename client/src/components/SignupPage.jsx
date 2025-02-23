import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  TextField,
  Typography,
  Button,
  Alert,
  Container,
  Grid,
  Paper,
} from "@mui/material";
import { apiClient } from "../config/api";

const SignupPage = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    try {
      const formData = {
        name,
        email,
        password,
      };
      const response = await apiClient.post("/user/register", formData);
      if (response.status === 201) {
        navigate("/login");
      } else {
        setError("Registration failed");
      }
    } catch (err) {
      if (err.response?.status === 409) {
        setError("User already exists, Please Login.");
      } else {
        setError(`Registration failed`);
      }
    }
  };

  return (
    <Container maxWidth="md" sx={{ mt: 8 }}>
      <Grid container justifyContent="center">
        <Grid item xs={12} md={8}>
          <Paper elevation={6} sx={{ padding: 4, borderRadius: "16px" }}>
            <Box
              sx={{
                textAlign: "center",
                mb: 3,
              }}
            >
              <Typography variant="h4" component="h1" gutterBottom>
                Create Your Account
              </Typography>
              <Typography variant="subtitle1" color="textSecondary">
                Register to track your Tasks.
              </Typography>
            </Box>
            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}
            <Box
              component="form"
              onSubmit={handleRegister}
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: 2,
              }}
            >
              <TextField
                label="Name"
                type="text"
                fullWidth
                variant="outlined"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
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
              <TextField
                label="Confirm Password"
                type="password"
                fullWidth
                variant="outlined"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
              <Button
                type="submit"
                variant="contained"
                color="primary"
                size="large"
                sx={{
                  mt: 2,
                  borderRadius: "8px",
                  textTransform: "none",
                }}
              >
                Sign Up
              </Button>
            </Box>
            <Typography
              variant="body2"
              color="textSecondary"
              align="center"
              sx={{ mt: 2 }}
            >
              Already have an account?{" "}
              <Button
                variant="text"
                color="primary"
                size="small"
                onClick={() => navigate("/login")}
                sx={{ textTransform: "none" }}
              >
                Log in here
              </Button>
            </Typography>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default SignupPage;
