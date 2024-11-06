import React, { useState } from 'react';
import { Box, TextField, Button, Typography, Card, CardContent } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export function CreateAccount({ onLogin }) {
  // State to store the input values for user information
  const [username, setUsername] = useState('');
  const [firstName, setFirstName] = useState('');
  const [password, setPassword] = useState('');
  const [middleName, setMiddleName] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [lastName, setLastName] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  // Function to handle the cancel button click, navigating back to the login page
  const handleCancel = () => {
    navigate('/login');
  };

  // Function to handle the submit button click, creating an account
  const handleSubmit = async () => {
    // Ensure all required fields are filled before submitting
    if (username && firstName && password && dateOfBirth && lastName) {
      try {
        // Determine API URL based on environment - Used for testing but should probably be the production link only
        const apiUrl = window.location.hostname === '127.0.0.1'
          ? 'http://127.0.0.1:5000/createUserAccount'
          : 'https://cs6440groupproj.onrender.com/createUserAccount';

        // Make a POST request to the Flask API to create a new user account
        const response = await axios.post(apiUrl, {
          username,
          password,
          firstname: firstName,
          middlename: middleName,
          lastname: lastName,
          dob: dateOfBirth,
        });

        // If the account creation is successful, call the provided onLogin function with the username
        if (response.status === 201) {
          onLogin(username);
        }
      } catch (error) {
        // Handle any errors during the account creation process
        if (error.response && error.response.status === 409) {
          setErrorMessage('Username already exists');
        } else if (error.response && error.response.status === 400) {
          setErrorMessage(error.response.data.message);
        } else {
          setErrorMessage('An error occurred. Please try again later.');
        }
      }
    } else {
      setErrorMessage('Please fill in all required fields');
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
            {/* Display error message if account creation fails */}
            {errorMessage && (
              <Typography variant="body2" color="error" mt={2}>
                {errorMessage}
              </Typography>
            )}
            {/* Buttons for canceling or submitting the form */}
            <Box display="flex" justifyContent="space-between">
              <Button
                variant="contained"
                color="primary"
                onClick={handleCancel}
                sx={{ backgroundColor: '#7F7F7F'}}                               
              >
                Cancel
              </Button>
              <Button
                variant="contained"
                color="primary"
                onClick={handleSubmit}
                sx={{ backgroundColor: '#A02B93' }}
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