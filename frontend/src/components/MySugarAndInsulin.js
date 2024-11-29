import React, { useState } from 'react';
import { Box, TextField, Button, Typography, Modal, Card, CardContent } from '@mui/material';
import { WbSunny, Cloud, Nightlight } from '@mui/icons-material';
import axios from 'axios';

export function MySugarAndInsulin({ accountID, username, firstName }) {
  // Helper function to get today's date in 'YYYY-MM-DD' format
  const getTodayDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = (today.getMonth() + 1).toString().padStart(2, '0');
    const day = today.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  // Helper function to get number input
  const numInput = (currentValue, newValue, max) => {
    const parsedValue = parseInt(newValue);
    return isNaN(parsedValue) ? 0 : Math.max(0, Math.min(1000, parsedValue))
  };

  // State variables to track inputs for each time of day and the entry date
  const [entryDate, setEntryDate] = useState(getTodayDate());
  const [morningGlucose, setMorningGlucose] = useState('');
  const [morningInsulin, setMorningInsulin] = useState('');
  const [afternoonGlucose, setAfternoonGlucose] = useState('');
  const [afternoonInsulin, setAfternoonInsulin] = useState('');
  const [eveningGlucose, setEveningGlucose] = useState('');
  const [eveningInsulin, setEveningInsulin] = useState('');
  const [popupOpen, setPopupOpen] = useState(false);
  const [entryDateErrorMessage, setEntryDateErrorMessage] = useState(false);
  const [dosagesErrorMessage, setDosagesErrorMessage] = useState(false);
  const [bg_morn_msg, setBGMornMsg] = useState('BG Morning: No messages to display.');
  const [bg_aft_msg, setBGAftMsg] = useState('BG Afternoon: No messages to display.');
  const [bg_eve_msg, setBGEveMsg] = useState('BG Evening: No messages to display.');

  // Function to clear all the input fields
  const handleClear = () => {
    setEntryDate(getTodayDate());
    setMorningGlucose('');
    setMorningInsulin('');
    setAfternoonGlucose('');
    setAfternoonInsulin('');
    setEveningGlucose('');
    setEveningInsulin('');
    setBGMornMsg('');
    setBGAftMsg('');
    setBGEveMsg('');
    setEntryDateErrorMessage(false);
    setDosagesErrorMessage(false);
  };

  // Function to handle the submission of the form
  const handleSubmit = async () => {
    setEntryDateErrorMessage(false);
    setDosagesErrorMessage(false);
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
        
        // Construct the payload
        const payload = {
          account_id: accountID,
          entry_date: entryDate,
          bg_morning: morningGlucose,
          ins_morning: morningInsulin,
          bg_afternoon: afternoonGlucose,
          ins_afternoon: afternoonInsulin,
          bg_evening: eveningGlucose,
          ins_evening: eveningInsulin
        };

        // Make a POST request to the API
        const response = await axios.post(apiUrl, payload, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('authToken')}` // Use the auth token
          }
        });

        // If the entry is successfully created, open the modal to confirm
        if (response.status === 201) {
          // Set BG morning, afternoon, evening msgs in modal notification box
          setBGMornMsg(response.data.bg_morning_message);
          setBGAftMsg(response.data.bg_afternoon_message);
          setBGEveMsg(response.data.bg_evening_message);
          setPopupOpen(true);
          // Moved handleClear in popupClose()       
        }
      } catch (error) {
        console.error('Error saving entry:', error);
        // Handle error - show a message or do some error logging
      }
    }
    setEntryDateErrorMessage(false);
    setDosagesErrorMessage(false);
    if (entryDate.length === 0){
      setEntryDateErrorMessage(true);
    }
    if (morningGlucose.length === 0 || morningInsulin.length === 0 || 
        afternoonGlucose.length === 0 || afternoonInsulin.length === 0 || 
        eveningGlucose.length === 0 || eveningInsulin.length === 0){
          setDosagesErrorMessage(true);
    }
  };

  // Function to handle the closing of the modal and clear form data
  const popupClose = () => {   
    setPopupOpen(false)
    handleClear();
  };

  return (
    <Box p={3} display="flex" justifyContent="center" alignItems="center" gap={10}>
      {/* Doctor image */}
      <Box component="img" src="/images/doctor.jpg" alt="doctor-image" sx={{ width: '170px' }} />      
      <Box display="flex" flexDirection="column" alignItems="center" mt={1}>      
        {/* Date input for entry date */}
        <Box display="flex" alignItems="center" mb={4} gap={3}>
          <Typography sx={{ fontSize: '20px', letterSpacing: '0.7px'}}>Entry Date *</Typography>        
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
            <Typography sx={{ fontSize: '19px', letterSpacing: '0.7px', color: '#333333', pl: 3, pr: 3}}>Time of Day</Typography>
          </Box>

          <Box display="flex" alignItems="center" justifyContent="center" sx={{ bgcolor: '#EDFFE0', height: '50px', borderRadius: '5px' }}>
            <Typography sx={{ fontSize: '19px', letterSpacing: '0.7px', color: '#333333' }}>Blood Glucose</Typography>
          </Box>

          <Box display="flex" alignItems="center"  justifyContent="center" sx={{ bgcolor: '#EDFFE0', height: '50px', borderRadius: '5px' }}>
            <Typography sx={{ fontSize: '19px', letterSpacing: '0.7px', color: '#333333' }}>Insulin Dosage</Typography>
          </Box>    

          {/* Morning readings inputs */}
          <Box display="flex" alignItems="center">
            <WbSunny sx={{ mr: 1 , color: 'orange', pl: 2}} /> 
            <Typography sx={{ fontSize: '17px', letterSpacing: '0.7px', color: 'black' }}>Morning</Typography>
          </Box>          
          <input
            id="bg_morn"
            placeholder="mg/dl"            
            type="number"
            value={morningGlucose}
            onChange={(e) => {
              setMorningGlucose(numInput(morningGlucose, e.target.value, 1000));
              e.target.value = morningGlucose
            }}
            min={0}
            max={1000}
            required
            style={{ padding: '10px', fontSize: '16px', borderRadius: '4px', border: '1px solid #ccc' }}
          />          
          <input
            id="ins_morn"
            placeholder="units"            
            type="number"
            value={morningInsulin}
            onChange={(e) => {
              setMorningInsulin(numInput(morningInsulin, e.target.value, 100));
              e.target.value = morningInsulin
            }}
            min={0}
            max={100}
            required
            style={{ padding: '10px', fontSize: '16px', borderRadius: '4px', border: '1px solid #ccc' }}
          />
          {/* Afternoon readings inputs */}
          <Box display="flex" alignItems="center">
            <Cloud sx={{ mr: 1 , color: '#90CFFC', pl: 2}} /> 
            <Typography sx={{ fontSize: '17px', letterSpacing: '0.7px', color: 'black' }}>Afternoon</Typography>
          </Box>          
          <input
            id="bg_aft"
            placeholder="mg/dl"            
            type="number"
            value={afternoonGlucose}
            onChange={(e) => {
              setAfternoonGlucose(numInput(afternoonGlucose, e.target.value, 1000));
              e.target.value = afternoonGlucose
            }}
            min={0}
            max={1000}
            required
            style={{ padding: '10px', fontSize: '16px', borderRadius: '4px', border: '1px solid #ccc' }}
          />          
          <input
            id="ins_aft"
            placeholder="units"            
            type="number"
            value={afternoonInsulin}
            onChange={(e) => {
              setAfternoonInsulin(numInput(afternoonInsulin, e.target.value, 100));
              e.target.value = afternoonInsulin
            }}
            min={0}
            max={100}
            required
            style={{ padding: '10px', fontSize: '16px', borderRadius: '4px', border: '1px solid #ccc' }}
          />
          {/* Evening readings inputs */}
          <Box display="flex" alignItems="center">
            <Nightlight sx={{ mr: 1 , color: '#8B79B5', pl: 2}} /> 
            <Typography sx={{ fontSize: '17px', letterSpacing: '0.7px', color: 'black' }}>Evening</Typography>
          </Box>          
          <input
            id="bg_eve"
            placeholder="mg/dl"            
            type="number"
            value={eveningGlucose}
            onChange={(e) => {
              setEveningGlucose(numInput(eveningGlucose, e.target.value, 1000));
              e.target.value = eveningGlucose
            }}
            min={0}
            max={1000}
            required
            style={{ padding: '10px', fontSize: '16px', borderRadius: '4px', border: '1px solid #ccc' }}
          />          
          <input
            id="ins_eve"
            placeholder="units"           
            type="number"
            value={eveningInsulin}
            onChange={(e) => {
              setEveningInsulin(numInput(eveningInsulin, e.target.value, 100));
              e.target.value = eveningInsulin
            }}
            min={0}
            max={100}
            required
            style={{ padding: '10px', fontSize: '16px', borderRadius: '4px', border: '1px solid #ccc' }}
          />
        </Box>
        {/* Display error message if account creation fails */}
        {entryDateErrorMessage && (
          <Typography variant="body2" color="error" mt={2}>
            {"Please add an entry date"}
          </Typography>
        )}
        {dosagesErrorMessage && (
          <Typography variant="body2" color="error" mt={2}>
            {"Please enter all dosages"}
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
      <Modal open={popupOpen} onClose={popupClose}>
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          minHeight="100vh"
        >
          <Card sx={{ width: 600, boxShadow: 3 }}>
            <CardContent>
              <Typography align="left" sx={{ pl: 3, pr: 2, pt: 3, fontSize: '19px', letterSpacing: '0.4px', color: 'black'}}>Your entry has been saved!</Typography>
              <Typography align="left" sx={{ pl: 3, pr: 2, pt: 3, fontSize: '19px', letterSpacing: '0.7px', color: '#A02B93'}}>Summary Findings</Typography>
              <Typography align="left" sx={{ pl: 3, pr: 2, pt: 3, fontSize: '17px', letterSpacing: '0.4px', color: 'black' }}>{bg_morn_msg}</Typography>
              <Typography align="left" sx={{ pl: 3, pr: 2, pt: 2, fontSize: '17px', letterSpacing: '0.4px', color: 'black' }}>{bg_aft_msg}</Typography>
              <Typography align="left" sx={{ pl: 3, pr: 2, pt: 2, fontSize: '17px', letterSpacing: '0.4px', color: 'black' }}>{bg_eve_msg}</Typography>
              <Box display="flex" justifyContent="center" mt={4} mb={3}>
                <Button 
                  variant="contained"                  
                  onClick={popupClose}
                  sx={{ fontSize: '17px', backgroundColor: '#A02B93', width: '150px', height: '50px' }}
                >
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