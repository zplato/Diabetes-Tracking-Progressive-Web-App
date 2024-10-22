import React, { useState } from 'react';
import { Box, TextField, Button, Typography, Card, CardContent, Link } from '@mui/material';
import { useNavigate } from 'react-router-dom';

export function LoginPage({ onLogin }) {
  // State to track the username input by the user
  const [username, setUsername] = useState('');
  // State to track the password input by the user
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  // Function to handle the login button click event
  const handleLoginClick = () => {
    // Basic check to ensure both username and password are provided
    if (username && password) {
      // Calls the provided onLogin function with the username to log in the user
      onLogin(username);
    }
  };

  // Function to navigate to the create account page
  const handleCreateAccountClick = () => {
    navigate('/create-account');
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
          <Box component="form">
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
            {/* Input field for the password */}
            <TextField
              label="Password"
              type="password"
              variant="outlined"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              fullWidth
              margin="normal"
              required
            />
            <Box mt={2} display="flex" justifyContent="space-between" alignItems="center">
              <Box textAlign="left">
                {/* Link to navigate to the create account page if user doesn't have an account */}
                <Typography variant="body2">No Account Yet?</Typography>
                <Link component="button" variant="body2" onClick={handleCreateAccountClick}>
                  Create Account
                </Link>
              </Box>
              {/* Button to initiate the login process */}
              <Button
                variant="contained"
                color="primary"
                onClick={handleLoginClick}
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