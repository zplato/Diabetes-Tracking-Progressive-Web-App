import React, { useState, useEffect } from 'react';
import { Box, TextField, Button, Typography, Modal, Card, CardContent } from '@mui/material';
import { WbSunny, Cloud, Nightlight } from '@mui/icons-material';
import axios from 'axios';

export function MySugarAndInsulin() {

  // Helper function to get today's date in 'YYYY-MM-DD' format
  const getTodayDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = (today.getMonth() + 1).toString().padStart(2, '0');
    const day = today.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  // State variables to track inputs for each time of day and the entry date
  const [entryDate, setEntryDate] = useState(getTodayDate());
  const [morningGlucose, setMorningGlucose] = useState('');
  const [morningInsulin, setMorningInsulin] = useState('');
  const [afternoonGlucose, setAfternoonGlucose] = useState('');
  const [afternoonInsulin, setAfternoonInsulin] = useState('');
  const [eveningGlucose, setEveningGlucose] = useState('');
  const [eveningInsulin, setEveningInsulin] = useState('');
  const [open, setOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Function to clear all the input fields
  const handleClear = () => {
    setEntryDate(getTodayDate()); // Reset to today's date
    setMorningGlucose('');
    setMorningInsulin('');
    setAfternoonGlucose('');
    setAfternoonInsulin('');
    setEveningGlucose('');
    setEveningInsulin('');
  };

  // Function to handle the submission of the form
  const handleSubmit = async () => {
    // Check if all required fields are filled before proceeding
    if (
      entryDate &&
      morningGlucose &&
      morningInsulin &&
      afternoonGlucose &&
      afternoonInsulin &&
      eveningGlucose &&
      eveningInsulin
    ) {
      try {
        // Define the API URL (use the appropriate environment endpoint)
        const apiUrl = 'https://cs6440groupproj.onrender.com/entries';

        // Get account_id from local storage or context (assuming the user is logged in)
        const accountId = localStorage.getItem('account_id');

        // Construct the payload
        const payload = {
          account_id: accountId,
          entry_date: entryDate,
          bg_morning: morningGlucose,
          ins_morning: morningInsulin,
          bg_afternoon: afternoonGlucose,
          ins_afternoon: afternoonInsulin,
          bg_evening: eveningGlucose,
          ins_evening: eveningInsulin,
        };

        // Make a POST request to the API
        const response = await axios.post(apiUrl, payload, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('authToken')}`, // Use the auth token
            'Content-Type': 'application/json'
          }
        });

        // If the entry is successfully created, open the modal to confirm
        if (response.status === 201) {
          setOpen(true);
        }
      } catch (error) {
        console.error('Error saving entry:', error);
        // Handle error - show a message or do some error logging
        setErrorMessage('An error occurred while saving the entry. Please try again.');
      }
    } else {
      setErrorMessage('Please fill in all required fields');
    }
  };

  // Function to handle the closing of the modal
  const handleClose = () => setOpen(false);

  return (
    <Box p={3} display="flex" justifyContent="center" alignItems="center" gap={10}>
      {/* Doctor image */}
      <Box component="img" src="/images/doctor.jpg" alt="doctor-image" sx={{ width: '170px' }} />      
      <Box display="flex" flexDirection="column" alignItems="center" mt={1}>      
        {/* Date input for entry date */}
        <Box display="flex" alignItems="center" mb={4} gap={3}>
          <Typography sx={{ fontSize: '20px', letterSpacing: '0.7px'}}>Entry Date</Typography>        
          <TextField            
            type="date"
            variant="outlined"
            value={entryDate}
            onChange={(e) => setEntryDate(e.target.value)}
            sx={{ maxWidth: 200 }}
            InputLabelProps={{ shrink: true }}
            required
          />
        </Box>

        {/* Grid layout for glucose and insulin inputs by time of day */}
        <Box display="grid" gridTemplateColumns="repeat(3, 1fr)" gap={3} mb={3}>
          <Box display="flex" alignItems="center" justifyContent="center" sx={{ bgcolor: '#EDFFE0', height: '50px', borderRadius: '5px' }}>
            <Typography sx={{ fontSize: '19px', letterSpacing: '0.7px', color: '#333333'}}>Time of Day</Typography>
          </Box>

          <Box display="flex" alignItems="center" justifyContent="center" sx={{ bgcolor: '#EDFFE0', height: '50px', borderRadius: '5px' }}>
            <Typography sx={{ fontSize: '19px', letterSpacing: '0.7px', color: '#333333' }}>Blood Glucose</Typography>
          </Box>

          <Box display="flex" alignItems="center"  justifyContent="center" sx={{ bgcolor: '#EDFFE0', height: '50px', borderRadius: '5px' }}>
            <Typography sx={{ fontSize: '19px', letterSpacing: '0.7px', color: '#333333' }}>Insulin Dosage</Typography>
          </Box>    

          {/* Morning readings inputs */}
          <Box display="flex" alignItems="center">
            <WbSunny sx={{ mr: 1 , color: 'orange', pl: 3}} /> 
            <Typography sx={{ fontSize: '17px', letterSpacing: '0.7px', color: 'black' }}>Morning</Typography>
          </Box>
          <TextField
            label="mg/dl"
            type="number"
            variant="outlined"
            value={morningGlucose}
            onChange={(e) => setMorningGlucose(e.target.value)}
            required
          />                              
          <TextField
            label="units"
            type="number"
            variant="outlined"
            value={morningInsulin}
            onChange={(e) => setMorningInsulin(e.target.value)}
            required
          />          
          {/* Afternoon readings inputs */}
          <Box display="flex" alignItems="center">
            <Cloud sx={{ mr: 1 , color: '#90CFFC', pl: 3}} /> 
            <Typography sx={{ fontSize: '17px', letterSpacing: '0.7px', color: 'black' }}>Afternoon</Typography>
          </Box>
          <TextField
            label="mg/dl"
            type="number"
            variant="outlined"
            value={afternoonGlucose}
            onChange={(e) => setAfternoonGlucose(e.target.value)}
            required
          />
          <TextField
            label="units"
            type="number"
            variant="outlined"
            value={afternoonInsulin}
            onChange={(e) => setAfternoonInsulin(e.target.value)}
            required
          />          
          {/* Evening readings inputs */}
          <Box display="flex" alignItems="center">
            <Nightlight sx={{ mr: 1 , color: '#8B79B5', pl: 3}} /> 
            <Typography sx={{ fontSize: '17px', letterSpacing: '0.7px', color: 'black' }}>Evening</Typography>
          </Box>
          <TextField
            label="mg/dl"
            type="number"
            variant="outlined"
            value={eveningGlucose}
            onChange={(e) => setEveningGlucose(e.target.value)}
            required
          />
          <TextField
            label="units"
            type="number"
            variant="outlined"
            value={eveningInsulin}
            onChange={(e) => setEveningInsulin(e.target.value)}
            required
          />
        </Box>

        {/* Display error message if entry submission fails */}
        {errorMessage && (
          <Typography variant="body2" color="error" mt={2}>
            {errorMessage}
          </Typography>
        )}

        {/* Buttons to clear inputs or submit the form */}
        <Box display="grid" gridTemplateColumns="repeat(2, 1fr)" gap={5} mt={2}>          
          <Button variant="contained" color="primary" onClick={handleClear} sx={{ fontSize: '17px', backgroundColor: '#7F7F7F', width: '150px', height: '50px' }}>
            Clear
          </Button>
          <Button variant="contained" color="primary" onClick={handleSubmit} sx={{ fontSize: '17px', backgroundColor: '#A02B93', width: '150px', height: '50px' }}>
            Submit
          </Button>
        </Box>
      </Box>

      {/* Modal to confirm successful entry submission */}
      <Modal open={open} onClose={handleClose}>
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          minHeight="100vh"
        >
          <Card sx={{ width: 400, boxShadow: 3 }}>
            <CardContent>
              <Typography variant="h5" mb={3} textAlign="center">
                Your entry has been saved!
              </Typography>
              <Typography variant="body1" textAlign="center">
                Summary Findings
              </Typography>
              <Box display="flex" justifyContent="center" mt={3}>
                <Button variant="contained" color="primary" onClick={handleClose}>
                  Close
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Box>
      </Modal>
    </Box>
  );
}
