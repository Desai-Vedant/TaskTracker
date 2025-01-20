import React from "react";
import { useNavigate } from "react-router-dom";
import { Box, Typography, Button, Container, Paper } from "@mui/material";
import Grid from "@mui/material/Grid";

export default function Home() {
  const navigate = useNavigate();

  const handleLogin = () => {
    navigate("/login");
  };

  const handleSignup = () => {
    navigate("/signup");
  };

  return (
    <Container maxWidth="md" sx={{ mt: 8 }}>
      <Grid container spacing={4} justifyContent="center">
        <Grid item xs={12} sm={6}>
          <Button
            fullWidth
            variant="contained"
            color="primary"
            size="large"
            onClick={handleLogin}
            sx={{
              padding: "12px 0",
              textTransform: "none",
              borderRadius: "8px",
            }}
          >
            Login
          </Button>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Button
            fullWidth
            variant="outlined"
            color="primary"
            size="large"
            onClick={handleSignup}
            sx={{
              padding: "12px 0",
              textTransform: "none",
              borderRadius: "8px",
            }}
          >
            Signup
          </Button>
        </Grid>
      </Grid>
    </Container>
  );
}
