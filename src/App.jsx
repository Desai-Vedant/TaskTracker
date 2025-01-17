import React, { useEffect, useState } from "react";
import { Provider } from "react-redux";
import { store } from "./store/store";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { TaskForm } from "./components/TaskForm";
import { TaskList } from "./components/TaskList";

import {
  Container,
  Box,
  ThemeProvider,
  createTheme,
  CssBaseline,
} from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import LoginPage from "./components/LoginPage";
import SignupPage from "./components/SignupPage";
import Branding from "./components/Branding";
import Home from "./components/HomePage";
import Cookies from "js-cookie";

const theme = createTheme({
  palette: {
    primary: {
      main: "#4f46e5",
    },
    background: {
      default: "#f3f4f6",
    },
  },
});

const checkLoginStatus = () => {
  var isLoggedin = false;
  try {
    const localToken = Cookies.get("localToken");
    if (localToken) {
      isLoggedin = true;
    }
  } catch (error) {
    isLoggedin = false;
  } finally {
    return isLoggedin;
  }
};

function App() {
  const [auth, setAuth] = useState(false);

  useEffect(() => {
    setAuth(checkLoginStatus());
  }, []);
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <Provider store={store}>
          <Router>
            <Box sx={{ minHeight: "100vh", py: 4 }}>
              <Container maxWidth="md">
                <Branding theme={theme} />
                <Routes>
                  {auth ? (
                    <Route
                      path="/"
                      element={
                        <>
                          <TaskForm />
                          <Box sx={{ pt: 3 }}>
                            <TaskList />
                          </Box>
                        </>
                      }
                    />
                  ) : (
                    <Route path="/home" element={<Home />} />
                  )}
                  <Route path="/login" element={<LoginPage />} />
                  <Route path="/signup" element={<SignupPage />} />
                  <Route path="*" element={<Navigate to="/login" />} />
                </Routes>
              </Container>
            </Box>
          </Router>
        </Provider>
      </LocalizationProvider>
    </ThemeProvider>
  );
}

export default App;
