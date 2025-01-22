import React, { useEffect, useState } from "react";
import { Provider } from "react-redux";
import { store } from "./store/store";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { Box, CssBaseline } from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { ThemeProvider } from "./contexts/ThemeContext";
import Cookies from "js-cookie";

// Import components directly
import { TaskForm } from "./components/TaskForm";
import { TaskList } from "./components/TaskList";
import LoginPage from "./components/LoginPage";
import SignupPage from "./components/SignupPage";
import NavBar from "./components/NavBar";
import { apiClient } from "./config/api.js";
import axios from "axios";

const getUserApiCall = async () => {
  try {
    const response = await apiClient.post("/user/get");
  } catch (error) {
    console.error(`Error Getting Data : ${error}`);
  }
};

const checkLoginStatus = () => {
  try {
    const localToken = Cookies.get("localToken");
    const user = localStorage.getItem("user");
    return !!(localToken && user);
  } catch (error) {
    console.error("Auth check error:", error);
    return false;
  }
};

function App() {
  const [auth, setAuth] = useState(false);

  useEffect(() => {
    getUserApiCall(); // On every login , checks if we get info of user if it responds with 401 then logout the user as token is expired
    setAuth(checkLoginStatus());
  }, []);

  return (
    <ThemeProvider>
      <CssBaseline />
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <Provider store={store}>
          <Router>
            <Box
              sx={{
                minHeight: "100vh",
                display: "flex",
                flexDirection: "column",
              }}
            >
              <NavBar setAuth={setAuth} />
              <Box
                component="main"
                sx={{
                  flex: 1,
                  display: "flex",
                  flexDirection: "column",
                  p: { xs: 2, sm: 3, md: 4 },
                }}
              >
                <Routes>
                  {auth ? (
                    <>
                      <Route
                        path="/"
                        element={
                          <Box>
                            <TaskForm />
                            <Box sx={{ mt: 3 }}>
                              <TaskList />
                            </Box>
                          </Box>
                        }
                      />
                      <Route path="*" element={<Navigate to="/" replace />} />
                    </>
                  ) : (
                    <>
                      <Route
                        path="/login"
                        element={<LoginPage setAuth={setAuth} />}
                      />
                      <Route path="/signup" element={<SignupPage />} />
                      <Route
                        path="*"
                        element={<Navigate to="/login" replace />}
                      />
                    </>
                  )}
                </Routes>
              </Box>
            </Box>
          </Router>
        </Provider>
      </LocalizationProvider>
    </ThemeProvider>
  );
}

export default App;
