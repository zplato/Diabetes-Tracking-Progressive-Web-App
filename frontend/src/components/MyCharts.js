import React, { useState } from 'react';
import { Box, Button, Typography, Card, CardContent, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export function MyCharts() {
  // State to store the currently selected chart type from the dropdown
  const [selectedChart, setSelectedChart] = useState('');
  // State to determine whether to show the selected chart or not
  const [showChart, setShowChart] = useState(false);

  // Function to handle dropdown selection change
  const handleChartChange = (event) => {
    setSelectedChart(event.target.value);
  };

  // Function to handle the 'Go' button click to display the selected chart
  const handleGoClick = () => {
    setShowChart(true);
  };

  // Placeholder data for the Blood Glucose readings over time
  const data = [
    { date: '2023-09-01', morning: 100, afternoon: 120, evening: 90 },
    { date: '2023-09-02', morning: 110, afternoon: 130, evening: 85 },
    { date: '2023-09-03', morning: 105, afternoon: 125, evening: 95 },
    // Additional dummy data for the month
  ];

  return (
    <Box p={3} display="flex" flexDirection="column" alignItems="center">
      {/* Dropdown and button to select and display the appropriate chart */}
      <Box display="flex" alignItems="center" mb={3} justifyContent="center">
        <Typography variant="h6" mr={2}>
          Show Chart by
        </Typography>
        <FormControl variant="outlined" sx={{ minWidth: 200, mr: 2 }}>
          <InputLabel>Chart Type</InputLabel>
          <Select
            value={selectedChart}
            onChange={handleChartChange}
            label="Chart Type"
          >
            <MenuItem value="blood-glucose">Blood Glucose Readings</MenuItem>
            <MenuItem value="insulin-dosages">Insulin Dosages</MenuItem>
          </Select>
        </FormControl>
        <Button variant="contained" color="primary" onClick={handleGoClick}>
          Go
        </Button>
      </Box>

      {/* Display the Blood Glucose line chart if selected */}
      {showChart && selectedChart === 'blood-glucose' && (
        <ResponsiveContainer width="80%" height={400}>
          <LineChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis label={{ value: 'mg/dL', angle: -90, position: 'insideLeft' }} />
            <Tooltip />
            <Legend />
            {/* Line for morning blood glucose values */}
            <Line type="monotone" dataKey="morning" stroke="#8884d8" />
            {/* Line for afternoon blood glucose values */}
            <Line type="monotone" dataKey="afternoon" stroke="#82ca9d" />
            {/* Line for evening blood glucose values */}
            <Line type="monotone" dataKey="evening" stroke="#ffc658" />
          </LineChart>
        </ResponsiveContainer>
      )}

      {/* Display a message when 'Insulin Dosages' is selected, but no data is available */}
      {showChart && selectedChart === 'insulin-dosages' && (
        <Card sx={{ maxWidth: 400, mt: 5, mx: 'auto' }}>
          <CardContent>
            <Typography variant="h6" textAlign="center">
              No Record
            </Typography>
          </CardContent>
        </Card>
      )}
    </Box>
  );
}