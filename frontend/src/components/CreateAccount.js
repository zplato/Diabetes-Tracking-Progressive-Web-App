import React, { useState } from 'react';
import { Box, TextField, Button, Typography, Card, CardContent } from '@mui/material';
import { useNavigate } from 'react-router-dom';

export function CreateAccount({ onLogin }) {
  // State to store the input values for user information
  const [username, setUsername] = useState('');
  const [firstName, setFirstName] = useState('');
  const [password, setPassword] = useState('');
  const [middleName, setMiddleName] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [lastName, setLastName] = useState('');
  const navigate = useNavigate();

  // Function to handle the cancel button click, navigating back to the login page
  const handleCancel = () => {
    navigate('/login');
  };

  // Function to handle the submit button click, creating an account
  const handleSubmit = () => {
    // Ensure all required fields are filled before submitting
    if (username && firstName && password && dateOfBirth && lastName) {
      console.log('Account created'); // Mock message indicating account creation
      onLogin(username); // Log the user in after account creation using the provided username
    }
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
      <Card sx={{ width: 500, boxShadow: 3 }}>
        <CardContent>
          {/* Title for the create account form */}
          <Typography variant="h4" mb={3} textAlign="center">
            Create Account
          </Typography>
          <Box component="form">
            {/* Input fields for username and first name */}
            <Box display="flex" gap={2} mb={2}>
              <TextField
                label="Username"
                variant="outlined"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                fullWidth
                required
              />
              <TextField
                label="First Name"
                variant="outlined"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                fullWidth
                required
              />
            </Box>
            {/* Input fields for password and middle name */}
            <Box display="flex" gap={2} mb={2}>
              <TextField
                label="Password"
                type="password"
                variant="outlined"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                fullWidth
                required
              />
              <TextField
                label="Middle Name"
                variant="outlined"
                value={middleName}
                onChange={(e) => setMiddleName(e.target.value)}
                fullWidth
              />
            </Box>
            {/* Input fields for date of birth and last name */}
            <Box display="flex" gap={2} mb={2}>
              <TextField
                label="Date of Birth"
                type="date"
                variant="outlined"
                value={dateOfBirth}
                onChange={(e) => setDateOfBirth(e.target.value)}
                fullWidth
                InputLabelProps={{ shrink: true }} // Ensures the label remains above the input
                required
              />
              <TextField
                label="Last Name"
                variant="outlined"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                fullWidth
                required
              />
            </Box>
            {/* Buttons for canceling or submitting the form */}
            <Box display="flex" justifyContent="space-between">
              <Button
                variant="outlined"
                color="primary"
                onClick={handleCancel}
              >
                Cancel
              </Button>
              <Button
                variant="contained"
                color="primary"
                onClick={handleSubmit}
              >
                Submit
              </Button>
            </Box>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}