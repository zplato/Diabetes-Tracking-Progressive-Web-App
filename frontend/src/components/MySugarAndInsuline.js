import React, { useState } from 'react';
import { Box, TextField, Button, Typography, Modal, Card, CardContent } from '@mui/material';
import { WbSunny, Cloud, Nightlight } from '@mui/icons-material';

export function MySugarAndInsulin() {
  // State variables to track inputs for each time of day and the entry date
  const [entryDate, setEntryDate] = useState('');
  const [morningGlucose, setMorningGlucose] = useState('');
  const [morningInsulin, setMorningInsulin] = useState('');
  const [afternoonGlucose, setAfternoonGlucose] = useState('');
  const [afternoonInsulin, setAfternoonInsulin] = useState('');
  const [eveningGlucose, setEveningGlucose] = useState('');
  const [eveningInsulin, setEveningInsulin] = useState('');
  const [open, setOpen] = useState(false);

  // Function to clear all the input fields
  const handleClear = () => {
    setEntryDate('');
    setMorningGlucose('');
    setMorningInsulin('');
    setAfternoonGlucose('');
    setAfternoonInsulin('');
    setEveningGlucose('');
    setEveningInsulin('');
  };

  // Function to handle the submission of the form
  const handleSubmit = () => {
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
      setOpen(true); // Open the modal to confirm the entry has been saved
    }
  };

  // Function to handle the closing of the modal
  const handleClose = () => setOpen(false);

  return (
    <Box p={3}>
      <Box display="flex" flexDirection="column" alignItems="center" mt={4}>
        {/* Date input for entry date */}
        <Box display="flex" flexDirection="column" alignItems="flex-start" mb={3}>
          <TextField
            label="Entry Date"
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
          <Typography variant="h6">Time of Day</Typography>
          <Typography variant="h6">Blood Glucose</Typography>
          <Typography variant="h6">Insulin Dosage</Typography>

          {/* Morning readings inputs */}
          <Box display="flex" alignItems="center">
            <WbSunny sx={{ mr: 1 }} /> Morning
          </Box>
          <TextField
            type="number"
            variant="outlined"
            value={morningGlucose}
            onChange={(e) => setMorningGlucose(e.target.value)}
            required
          />
          <TextField
            type="number"
            variant="outlined"
            value={morningInsulin}
            onChange={(e) => setMorningInsulin(e.target.value)}
            required
          />

          {/* Afternoon readings inputs */}
          <Box display="flex" alignItems="center">
            <Cloud sx={{ mr: 1 }} /> Afternoon
          </Box>
          <TextField
            type="number"
            variant="outlined"
            value={afternoonGlucose}
            onChange={(e) => setAfternoonGlucose(e.target.value)}
            required
          />
          <TextField
            type="number"
            variant="outlined"
            value={afternoonInsulin}
            onChange={(e) => setAfternoonInsulin(e.target.value)}
            required
          />

          {/* Evening readings inputs */}
          <Box display="flex" alignItems="center">
            <Nightlight sx={{ mr: 1 }} /> Evening
          </Box>
          <TextField
            type="number"
            variant="outlined"
            value={eveningGlucose}
            onChange={(e) => setEveningGlucose(e.target.value)}
            required
          />
          <TextField
            type="number"
            variant="outlined"
            value={eveningInsulin}
            onChange={(e) => setEveningInsulin(e.target.value)}
            required
          />
        </Box>

        {/* Buttons to clear inputs or submit the form */}
        <Box mt={2}>
          <Button variant="outlined" color="primary" onClick={handleClear} sx={{ mr: 2 }}>
            Clear
          </Button>
          <Button variant="contained" color="primary" onClick={handleSubmit}>
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