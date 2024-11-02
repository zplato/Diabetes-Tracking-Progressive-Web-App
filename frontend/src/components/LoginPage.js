import React, { useState } from 'react';
import { Box, TextField, Button, Typography, Card, CardContent, Link, IconButton, InputAdornment } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import axios from 'axios';

export function LoginPage({ onLogin }) {
  // State to track the username input by the user
  const [username, setUsername] = useState('');
  // State to track the password input by the user
  const [password, setPassword] = useState('');
  // State to toggle password visibility
  const [showPassword, setShowPassword] = useState(false);
  // State to track error messages for invalid login attempts
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  // Function to handle the login button click event
  const handleLoginClick = async () => {
    // Basic check to ensure both username and password are provided
    if (username && password) {
      try {
        // Determine API URL based on environment - Used for testing but should probably be the production link only
        const apiUrl = window.location.hostname === '127.0.0.1'
          ? 'http://127.0.0.1:5000/validateUserLogin'
          : 'https://cs6440groupproj.onrender.com/validateUserLogin';

        // Make a POST request to the Flask API to validate the login
        const response = await axios.post(apiUrl, {
          username,
          password,
        });

        // If the login is successful, call the provided onLogin function with the username
        if (response.status === 200) {
          const userData = response.data;
          onLogin(userData.username);
        }
      } catch (error) {
        // Handle any errors during the login process
        if (error.response && error.response.status === 401) {
          setErrorMessage('Invalid username or password');
        } else {
          setErrorMessage('An error occurred. Please try again later.');
        }
      }
    } else {
      setErrorMessage('Please provide both username and password');
    }
  };

  // Function to navigate to the create account page
  const handleCreateAccountClick = (e) => {
    e.preventDefault();
    navigate('/create-account');
  };

  // Function to toggle password visibility
  const handleTogglePasswordVisibility = () => {
    setShowPassword((prevShowPassword) => !prevShowPassword);
  };

  // Function to handle form submission with Enter key
  const handleFormSubmit = (e) => {
    e.preventDefault();
    handleLoginClick();
  };

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="flex-start"
      minHeight="100vh"
      pt={3}
      bgcolor="#f0f0f0"
    >
      <Card sx={{ width: 400, boxShadow: 3 }}>
        <CardContent>
          {/* Title for the login form */}
          <Typography variant="h4" mb={3} textAlign="center">
            Login
          </Typography>
          <Box component="form" onSubmit={handleFormSubmit}>
            {/* Input field for the username */}
            <TextField
              label="Username"
              variant="outlined"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              fullWidth
              margin="normal"
              required
            />
            {/* Input field for the password with visibility toggle */}
            <TextField
              label="Password"
              type={showPassword ? 'text' : 'password'}
              variant="outlined"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              fullWidth
              margin="normal"
              required
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={handleTogglePasswordVisibility}
                      edge="end"
                    >
                      {showPassword ? <Visibility /> : <VisibilityOff />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            {/* Display error message if login fails */}
            {errorMessage && (
              <Typography variant="body2" color="error" mt={2}>
                {errorMessage}
              </Typography>
            )}
            <Box mt={2} display="flex" justifyContent="space-between" alignItems="center">
              <Box textAlign="left">
                {/* Link to navigate to the create account page if user doesn't have an account */}
                <Typography variant="body2">No Account Yet?</Typography>
                <Link
                  href="#"
                  variant="body2"
                  onClick={(e) => {
                    e.preventDefault();
                    handleCreateAccountClick(e);
                  }}
                  style={{ textDecoration: 'none' }}
                >
                  Create Account
                </Link>
              </Box>
              {/* Button to initiate the login process */}
              <Button
                type="submit"
                variant="contained"
                color="primary"
              >
                Sign In
              </Button>
            </Box>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}
