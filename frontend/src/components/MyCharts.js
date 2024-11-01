import React, { useState } from 'react';
import { Box, Button, Typography, Card, CardContent, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceArea } from 'recharts';

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

  // Color constants
  const VERY_LOW_HIGH = "#FF6961"
  const LOW_BORDERLINE = "#F8D66D"
  const NORMAL = "#8CD47E"
  const HIGH = "#FFB54C"

  function getValueText(value) {
    // Defaults to NORMAL
    let level = "NORMAL";
    let tcolor = NORMAL;
    if (value >= 0 && value < 51) {
      level = "VERY LOW";
      tcolor = VERY_LOW_HIGH;
    }
    else if (value >= 51 && value < 70) {
      level = "LOW";
      tcolor = LOW_BORDERLINE;
    }
    else if (value >= 109 && value < 180) {
      level = "BORDERLINE";
      tcolor = LOW_BORDERLINE;
    }
    else if (value >= 181 && value < 280) {
      level = "HIGH";
      tcolor = HIGH;
    }
    else if (value >= 281){
      level = "VERY HIGH";
      tcolor = VERY_LOW_HIGH;
    }
    return (
      <span style={{color: tcolor}}><strong color={NORMAL}>[{level}]</strong></span>
    );
  };

  const BGTooltip = ({active, payload, label}) => {
    if (active && payload && payload.length) {
      let pretty_date = new Date(label.replace(/-/g, '/'));
      return(
      <div className="tooltip">
        <h4>{pretty_date.toDateString()}</h4>
        <p>Morning: {getValueText(payload[0].value)}</p>
        <p>Afternoon: {getValueText(payload[1].value)}</p>
        <p>Evening: {getValueText(payload[2].value)}</p>
      </div>
      );
    }
  };

  // Placeholder data for the Blood Glucose readings over time
  const data = [
    { date: '2023-09-01', morning: 100, afternoon: 120, evening: 90 },
    { date: '2023-09-02', morning: 20, afternoon: 130, evening: 85 },
    { date: '2023-09-03', morning: 105, afternoon: 125, evening: 95 },
    { date: '2023-09-10', morning: 90, afternoon: 130, evening: 300 },
    { date: '2023-09-11', morning: 270, afternoon: 78, evening: 60 },
    { date: '2023-09-12', morning: 40, afternoon: 78, evening: 99 },
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
        <ResponsiveContainer width="80%" height={500}>
          <LineChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis label={{ value: 'mg/dL', angle: -90, position: 'insideLeft' }}  />
            <Tooltip content={<BGTooltip />}/>
            <Legend />
            {/* Line for morning blood glucose values */}
            <Line type="monotone" dataKey="morning" stroke="#811e73" />
            {/* Line for afternoon blood glucose values */}
            <Line type="monotone" dataKey="afternoon" stroke="#6350c5" />
            {/* Line for evening blood glucose values */}
            <Line type="monotone" dataKey="evening" stroke="#300056" />
            <ReferenceArea y1={0} y2={50} fill={VERY_LOW_HIGH} fillOpacity={0.2} ifOverflow='hidden'/>
            <ReferenceArea y1={50} y2={70} fill={LOW_BORDERLINE} fillOpacity={0.2} ifOverflow='hidden'/>
            <ReferenceArea y1={70} y2={108} fill={NORMAL} fillOpacity={0.2} ifOverflow='hidden'/>
            <ReferenceArea y1={108} y2={180} fill={LOW_BORDERLINE} fillOpacity={0.2} ifOverflow='hidden'/>
            <ReferenceArea y1={180} y2={280} fill={HIGH} fillOpacity={0.2} ifOverflow='hidden'/>
            <ReferenceArea y1={280} y2={315} fill={VERY_LOW_HIGH} fillOpacity={0.2} ifOverflow='hidden'/>
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