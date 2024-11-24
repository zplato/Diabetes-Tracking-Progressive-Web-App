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
        // Backend API
        const apiUrl = 'https://cs6440groupproj.onrender.com/createUserAccount';

        // Make a POST request to the Flask API to create a new user account
        const response = await axios.post(apiUrl, {
          username: username,
          password: password,
          firstname: firstName,
          middlename: middleName,
          lastname: lastName,
          dob: dateOfBirth,
        }, {
          headers: {
            'Content-Type': 'application/json'
          }
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
      pt={7}
      bgcolor="#F7F7F7"
    >
      <Card sx={{ width: 500, boxShadow: 3 }}>
        <CardContent>
          {/* Title for the create account form */}
          <Box display="flex" alignItems="center"  justifyContent="center" gap={1}>
            <Typography mt={1} mb={3} textAlign="center" sx={{ fontSize: '32px', letterSpacing: '0.7px', color: '#A02B93' }}>
              Create
            </Typography>
            <Typography mt={1} mb={3} textAlign="center" sx={{ fontSize: '32px', letterSpacing: '0.7px', color: 'black' }}>
              Account
            </Typography>
          </Box>
          <Box component="form">
            {/* Input fields for username and first name */}
            <Box display="flex" gap={4} mb={3} pl={2} pr={2}>
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
            <Box display="flex" gap={4} mb={3} pl={2} pr={2}>
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
            <Box display="flex" gap={4} mb={3} pl={2} pr={2}>
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
            <Box display="flex" justifyContent="space-between" mb={1} mt={4} gap={4} pl={2} pr={2}>
              <Button
                variant="contained"
                color="primary"
                onClick={handleCancel}                
                sx={{ fontSize: '16px', backgroundColor: '#7F7F7F', width: '130px', height: '45px' }}                               
              >
                Cancel
              </Button>
              <Button
                variant="contained"
                color="primary"
                onClick={handleSubmit}
                sx={{ fontSize: '16px', backgroundColor: '#A02B93', width: '130px', height: '45px' }}
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