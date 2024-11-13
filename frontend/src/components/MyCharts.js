import React, { useState } from 'react';
import { Box, Button, Typography, Card, CardContent, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceArea, PieChart, Pie, Cell } from 'recharts';

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
  const MORNING = "#811e73";
  const AFTERNOON = "#6350c5";
  const EVENING = "#300056";

  const VERY_LOW_HIGH = "#FF6961"
  const LOW_BORDERLINE = "#F8D66D"
  const NORMAL = "#8CD47E"
  const HIGH = "#FFB54C"

  const COLORS = [VERY_LOW_HIGH, LOW_BORDERLINE, NORMAL, LOW_BORDERLINE, HIGH, VERY_LOW_HIGH];

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

  function cleanData_bgSplit(data_in) {
    for (let i in data_in) {
      let pretty_date = data_in[i]["created_at"].split(" ")[0];
      pretty_date = new Date(pretty_date.replace(/-/g, '/'));
      data_in[i]["created_at"] = pretty_date.toDateString();
    }
    return data_in
  };

  function cleanData_bg(data_in) {
    let new_data = [];
    for (let i in data_in) {
      let pretty_date = data_in[i]["created_at"].split(" ")[0];
      pretty_date = new Date(pretty_date.replace(/-/g, '/'));
      pretty_date = pretty_date.toDateString();
      
      new_data.push( { created_at: pretty_date, reading: data_in[i]["bg_morning"] });
      new_data.push( { created_at: pretty_date, reading: data_in[i]["bg_afternoon"] });
      new_data.push( { created_at: pretty_date, reading: data_in[i]["bg_evening"] });
    }
    return new_data;
  };

  function cleanData_bgBreakdown(data_in) {
    let new_data = cleanData_bg(data_in);
    let fin_data = [];
    fin_data.push( {name:"VERY LOW", value: 0} );
    fin_data.push( {name:"LOW", value: 0} );
    fin_data.push( {name:"NORMAL", value: 0} );
    fin_data.push( {name:"BORDERLINE", value: 0} );
    fin_data.push( {name:"HIGH", value: 0} );
    fin_data.push( {name:"VERY HIGH", value: 0} );
    
    for (let i in new_data) {
      let reading = new_data[i]["reading"];
      if(reading >= 0 && reading <= 50) {
        fin_data[0]["value"] += 1;
      }
      else if(reading >= 51 && reading <= 70) {
        fin_data[1]["value"] += 1;
      }
      else if(reading >= 71 && reading <= 108) {
        fin_data[2]["value"] += 1;
      }
      else if(reading >= 109 && reading <= 180) {
        fin_data[3]["value"] += 1;
      }
      else if(reading >= 181 && reading <= 280) {
        fin_data[4]["value"] += 1;
      }
      else if(reading >= 281) {
        fin_data[5]["value"] += 1;
      }
    }
    return fin_data;
  };

  const BGSplit_Tooltip = ({active, payload, label}) => {
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

  const BG_Tooltip = ({active, payload, label}) => {
    if (active && payload && payload.length) {
      let label_clean = label.substring(0, label.length - 2).replace(/-/g, '/');
      let pretty_date = new Date(label_clean);
      return(
      <div className="tooltip">
        <h4>{pretty_date.toDateString()}</h4>
        <p>Reading: {getValueText(payload[0].value)}</p>
      </div>
      );
    }
  };

  // Placeholder data for the Blood Glucose readings over time
  const data = [
    { created_at: "2009-01-07 00:00:00", bg_morning: 238.00, bg_afternoon: 261.00, bg_evening: 127.00, ins_morning: 100.00, ins_afternoon: 100.00, ins_evening: 100.00 },
    { created_at: "2009-01-08 00:00:00", bg_morning: 258.00, bg_afternoon: 189.00, bg_evening: 262.00, ins_morning: 100.00, ins_afternoon: 500.00, ins_evening: 100.00 },
    { created_at: "2009-01-09 00:00:00", bg_morning: 168.00, bg_afternoon: 218.00, bg_evening: 103.00, ins_morning: 100.00, ins_afternoon: 100.00, ins_evening: 100.00 },
    { created_at: "2009-01-10 00:00:00", bg_morning: 88.00,  bg_afternoon: 179.00, bg_evening: 174.00, ins_morning: 500.00, ins_afternoon: 500.00, ins_evening: 100.00 },
    { created_at: "2009-01-11 00:00:00", bg_morning: 261.00, bg_afternoon: 127.00, bg_evening: 258.00, ins_morning: 100.00, ins_afternoon: 100.00, ins_evening: 100.00 },
    // Additional dummy data for the month
  ];

  return (
    <Box p={3} display="flex" flexDirection="column" alignItems="center">
      {/* Dropdown and button to select and display the appropriate chart */}
      <Box display="flex" alignItems="center" mb={2} mt={1} justifyContent="center" gap={1}>
        <Typography mr={2} sx={{ fontSize: '20px', letterSpacing: '0.7px'}}>
          Show Chart By
        </Typography>
        <FormControl variant="outlined" sx={{ minWidth: 200, mr: 2 }}>
          <InputLabel>Chart Type</InputLabel>
          <Select
            value={selectedChart}
            onChange={handleChartChange}
            label="Chart Type"
          >
            <MenuItem value="blood-glucose">Blood Glucose Readings</MenuItem>
            <MenuItem value="blood-glucose-split">Blood Glucose Readings (Split)</MenuItem>
            <MenuItem value="blood-glucose-breakdown">Blood Glucose Breakdown</MenuItem>
            <MenuItem value="insulin-dosages">Insulin Dosages</MenuItem>
          </Select>
        </FormControl>
        <Button variant="contained" color="primary" onClick={handleGoClick} sx={{ fontSize: '17px', backgroundColor: '#A02B93', width: '80px', height: '50px' }}>
          Go
        </Button>
      </Box>

      {/* Display the Blood Glucose line chart if selected */}
      {showChart && selectedChart === 'blood-glucose' && (
        <ResponsiveContainer width="80%" height={500}>
          <LineChart data={cleanData_bg(data)} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="created_at" axisLine="false"/>
            <YAxis label={{ value: 'mg/dL', angle: -90, position: 'insideLeft' }}  />
            <Tooltip content={<BG_Tooltip />}/>
            <Legend />
            {/* Line for morning blood glucose values */}
            <Line type="monotone" dataKey="reading" stroke="#811e73" />
            <ReferenceArea y1={0} y2={50} fill={VERY_LOW_HIGH} fillOpacity={0.2} ifOverflow='hidden'/>
            <ReferenceArea y1={50} y2={70} fill={LOW_BORDERLINE} fillOpacity={0.2} ifOverflow='hidden'/>
            <ReferenceArea y1={70} y2={108} fill={NORMAL} fillOpacity={0.2} ifOverflow='hidden'/>
            <ReferenceArea y1={108} y2={180} fill={LOW_BORDERLINE} fillOpacity={0.2} ifOverflow='hidden'/>
            <ReferenceArea y1={180} y2={280} fill={HIGH} fillOpacity={0.2} ifOverflow='hidden'/>
            <ReferenceArea y1={280} y2={315} fill={VERY_LOW_HIGH} fillOpacity={0.2} ifOverflow='hidden'/>
          </LineChart>
        </ResponsiveContainer>
      )}
      {showChart && selectedChart === 'blood-glucose-split' && (
        <ResponsiveContainer width="80%" height={500}>
          <LineChart data={cleanData_bgSplit(data)} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="created_at" axisLine="false"/>
            <YAxis label={{ value: 'mg/dL', angle: -90, position: 'insideLeft' }}  />
            <Tooltip content={<BGSplit_Tooltip />}/>
            <Legend />
            {/* Line for morning blood glucose values */}
            <Line type="monotone" dataKey="bg_morning" stroke={MORNING} />
            {/* Line for afternoon blood glucose values */}
            <Line type="monotone" dataKey="bg_afternoon" stroke={AFTERNOON} />
            {/* Line for evening blood glucose values */}
            <Line type="monotone" dataKey="bg_evening" stroke={EVENING} />
            <ReferenceArea y1={0} y2={50} fill={VERY_LOW_HIGH} fillOpacity={0.2} ifOverflow='hidden'/>
            <ReferenceArea y1={50} y2={70} fill={LOW_BORDERLINE} fillOpacity={0.2} ifOverflow='hidden'/>
            <ReferenceArea y1={70} y2={108} fill={NORMAL} fillOpacity={0.2} ifOverflow='hidden'/>
            <ReferenceArea y1={108} y2={180} fill={LOW_BORDERLINE} fillOpacity={0.2} ifOverflow='hidden'/>
            <ReferenceArea y1={180} y2={280} fill={HIGH} fillOpacity={0.2} ifOverflow='hidden'/>
            <ReferenceArea y1={280} y2={315} fill={VERY_LOW_HIGH} fillOpacity={0.2} ifOverflow='hidden'/>
          </LineChart>
        </ResponsiveContainer>
      )}
      {showChart && selectedChart === 'blood-glucose-breakdown' && (
        <ResponsiveContainer width="80%" height={500}>
          <PieChart margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <Pie data={cleanData_bgBreakdown(data)} dataKey="value">
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
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