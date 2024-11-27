import React, { useState, useEffect } from 'react';
import { Box, Typography, Card, CardContent, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceArea, PieChart, Pie, Cell } from 'recharts';
import axios from 'axios';

export function MyCharts({ accountID, username, firstName }) {
  // State to store the currently selected chart type from the dropdown
  const [selectedChart, setSelectedChart] = useState('blood-glucose');
  // State to store fetched chart data
  const [chartData, setChartData] = useState([]);
  // State to handle data fetching error
  const [hasError, setHasError] = useState(false);

  // Placeholder data for when user data is unavailable
  const data = [
    { created_date: "2009-01-07", bg_morning: 238.00, bg_afternoon: 261.00, bg_evening: 127.00, ins_morning: 100.00, ins_afternoon: 100.00, ins_evening: 100.00 },
    { created_date: "2009-01-08", bg_morning: 258.00, bg_afternoon: 189.00, bg_evening: 262.00, ins_morning: 100.00, ins_afternoon: 500.00, ins_evening: 100.00 },
    { created_date: "2009-01-09", bg_morning: 168.00, bg_afternoon: 218.00, bg_evening: 103.00, ins_morning: 100.00, ins_afternoon: 100.00, ins_evening: 100.00 },
    { created_date: "2009-01-10", bg_morning: 88.00,  bg_afternoon: 179.00, bg_evening: 174.00, ins_morning: 500.00, ins_afternoon: 500.00, ins_evening: 100.00 },
    { created_date: "2009-01-11", bg_morning: 261.00, bg_afternoon: 127.00, bg_evening: 258.00, ins_morning: 100.00, ins_afternoon: 100.00, ins_evening: 100.00 },
];

  // Function to handle dropdown selection change
  const handleChartChange = (event) => {
    setSelectedChart(event.target.value);
  };

  // Function to fetch chart data from the API
  const fetchChartData = async () => {
    try {
      const response = await axios.get(`https://cs6440groupproj.onrender.com/entries?account_id=${accountID}`);
      if (response.status === 200) {
        // Ensure numeric values are correctly parsed and set data
        const parsedData = response.data.map(entry => ({
          ...entry,
          created_date: new Date(entry.created_date.replace(/-/g, '/')).toDateString(),
          bg_morning: entry.bg_morning ? parseFloat(entry.bg_morning) : null,
          bg_afternoon: entry.bg_afternoon ? parseFloat(entry.bg_afternoon) : null,
          bg_evening: entry.bg_evening ? parseFloat(entry.bg_evening) : null,
          ins_morning: entry.ins_morning ? parseFloat(entry.ins_morning) : null,
          ins_afternoon: entry.ins_afternoon ? parseFloat(entry.ins_afternoon) : null,
          ins_evening: entry.ins_evening ? parseFloat(entry.ins_evening) : null,
        }));
        setChartData(parsedData);
        setHasError(false);
      } else {
        setChartData(data);
        setHasError(true);
      }
    } catch (error) {
      console.error('Error fetching chart data:', error);
      setChartData(data);
      setHasError(true);
    }
  };

  useEffect(() => {
    fetchChartData();
  }, [selectedChart]);

  // Color constants
  const MORNING = "#811e73";
  const AFTERNOON = "#6350c5";
  const EVENING = "#300056";

  const VERY_LOW = "#FF6961"
  const LOW = "#F8D66D"
  const NORMAL = "#8CD47E"
  const BORDERLINE = "#C6C565"
  const HIGH = "#FFB54C"
  const VERY_HIGH = "#c30a00"

  const COLORS = [VERY_LOW, LOW, NORMAL, BORDERLINE, HIGH, VERY_HIGH];

  function getValueText(value) {
    // Defaults to NORMAL
    let level = "NORMAL";
    let tcolor = NORMAL;
    if (value >= 0 && value < 51) {
      level = "VERY LOW";
      tcolor = VERY_LOW;
    }
    else if (value >= 51 && value < 70) {
      level = "LOW";
      tcolor = LOW;
    }
    else if (value >= 109 && value < 180) {
      level = "BORDERLINE";
      tcolor = BORDERLINE;
    }
    else if (value >= 181 && value < 280) {
      level = "HIGH";
      tcolor = HIGH;
    }
    else if (value >= 281){
      level = "VERY HIGH";
      tcolor = VERY_HIGH;
    }
    return (
      <span style={{color: tcolor}}><strong color={NORMAL}>[{level}]</strong></span>
    );
  };

  function cleanData_bgSplit(data_in) {
    let new_data = [];
    for (let i in data_in) {
      new_data.push({ 
        created_date: data_in[i]["created_date"], 
        bg_morning: data_in[i]["bg_morning"] || 0, 
        bg_afternoon: data_in[i]["bg_afternoon"] || 0, 
        bg_evening: data_in[i]["bg_evening"] || 0 
      });
    }
    return new_data;
  }

  function cleanData_bg(data_in) {
    let new_data = [];
    for (let i in data_in) {
      new_data.push({ 
        created_date: data_in[i]["created_date"], 
        reading: data_in[i]["bg_morning"] || 0, 
        tod: "Morning" 
      });
      new_data.push({ 
        created_date: data_in[i]["created_date"], 
        reading: data_in[i]["bg_afternoon"] || 0, 
        tod: "Afternoon" 
      });
      new_data.push({ 
        created_date: data_in[i]["created_date"], 
        reading: data_in[i]["bg_evening"] || 0, 
        tod: "Evening" 
      });
    }
    return new_data;
  }

  function cleanData_id(data_in) {
    let new_data = [];
    for (let i in data_in) {
      new_data.push({ 
        created_date: data_in[i]["created_date"], 
        reading: data_in[i]["ins_morning"] || 0 
      });
      new_data.push({ 
        created_date: data_in[i]["created_date"], 
        reading: data_in[i]["ins_afternoon"] || 0 
      });
      new_data.push({ 
        created_date: data_in[i]["created_date"], 
        reading: data_in[i]["ins_evening"] || 0 
      });
    }
    return new_data;
  }

  function cleanData_bgBreakdown(data_in) {
    let new_data = cleanData_bg(data_in);
    let fin_data = [
      {name: "VERY LOW", value: 0},
      {name: "LOW", value: 0},
      {name: "NORMAL", value: 0},
      {name: "BORDERLINE", value: 0},
      {name: "HIGH", value: 0},
      {name: "VERY HIGH", value: 0},
    ];
    
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
      return(
      <div className="tooltip">
        <h4>{label}</h4>
        {payload.map((data, index) => (
          <p key={index}>{data.name}: {data.value} - {getValueText(data.value)}</p>
        ))}
      </div>
      );
    }
    return null;
  };

  const BG_Tooltip = ({active, payload, label}) => {
    if (active && payload && payload.length) {
      return(
      <div className="tooltip">
        <p><strong>{label}</strong> {payload[0].payload.tod}</p>
        <p>Reading: {payload[0].value} - {getValueText(payload[0].value)}</p>
      </div>
      );
    }
    return null;
  };

  const BGBreakdown_Tooltip = ({active, payload, label}) => {
    if (active && payload && payload.length) {
      let tcolor = NORMAL;
      if (payload[0].name === "LOW") {tcolor = LOW;}
      else if (payload[0].name === "VERY LOW") {tcolor = VERY_LOW;}
      else if (payload[0].name === "BORDERLINE") {tcolor = BORDERLINE;}
      else if (payload[0].name === "HIGH") {tcolor = HIGH;}
      else if (payload[0].name === "VERY HIGH") {tcolor = VERY_HIGH;}
      return(
      <div className="tooltip">
        <p><span style={{color: tcolor}}><strong color={NORMAL}>{payload[0].name}</strong></span> {payload[0].value}</p>
      </div>
      );
    }
    return null;
  };

  const Ins_Tooltip = ({active, payload, label}) => {
    if (active && payload && payload.length) {
      return(
      <div className="tooltip">
        <p><strong>{label}</strong> {payload[0].payload.tod}</p>
        <p>Insulin Dosage: {payload[0].value}</p>
      </div>
      );
    }
    return null;
  };

  return (
    <Box p={3} display="flex" flexDirection="column" alignItems="center">
      {/* Dropdown to select and display the appropriate chart */}
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
      </Box>

      <Box position="relative" width="80%" height={500}>
        {/* Display the Blood Glucose line chart if selected */}
        {chartData.length && selectedChart === 'blood-glucose' && (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={cleanData_bg(chartData)} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="created_date" interval={Math.round(chartData.length / 3)}/>
              <YAxis domain={[0, 'dataMax + 20']} label={{ value: 'mg/dL', angle: -90, position: 'insideLeft' }}  />
              <Tooltip content={<BG_Tooltip />}/>
              <Legend />
              {/* Line for morning blood glucose values */}
              <Line type="monotone" dataKey="reading" stroke="#811e73" />
              <ReferenceArea y1={0} y2={50} fill={VERY_LOW} fillOpacity={0.2} ifOverflow='hidden'/>
              <ReferenceArea y1={50} y2={70} fill={LOW} fillOpacity={0.2} ifOverflow='hidden'/>
              <ReferenceArea y1={70} y2={108} fill={NORMAL} fillOpacity={0.2} ifOverflow='hidden'/>
              <ReferenceArea y1={108} y2={180} fill={BORDERLINE} fillOpacity={0.2} ifOverflow='hidden'/>
              <ReferenceArea y1={180} y2={280} fill={HIGH} fillOpacity={0.2} ifOverflow='hidden'/>
              <ReferenceArea y1={280} y2={1000} fill={VERY_HIGH} fillOpacity={0.2} ifOverflow='hidden'/>
            </LineChart>
          </ResponsiveContainer>
        )}
        {/* Display the Blood Glucose Split line chart if selected */}
        {chartData.length && selectedChart === 'blood-glucose-split' && (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={cleanData_bgSplit(chartData)} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="created_date" axisLine="false"/>
              <YAxis domain={[0, 'dataMax + 20']} label={{ value: 'mg/dL', angle: -90, position: 'insideLeft' }}  />
              <Tooltip content={<BGSplit_Tooltip />}/>
              <Legend />
              {/* Line for morning blood glucose values */}
              <Line type="monotone" dataKey="bg_morning" stroke={MORNING} />
              {/* Line for afternoon blood glucose values */}
              <Line type="monotone" dataKey="bg_afternoon" stroke={AFTERNOON} />
              {/* Line for evening blood glucose values */}
              <Line type="monotone" dataKey="bg_evening" stroke={EVENING} />
              <ReferenceArea y1={0} y2={50} fill={VERY_LOW} fillOpacity={0.2} ifOverflow='hidden'/>
              <ReferenceArea y1={50} y2={70} fill={LOW} fillOpacity={0.2} ifOverflow='hidden'/>
              <ReferenceArea y1={70} y2={108} fill={NORMAL} fillOpacity={0.2} ifOverflow='hidden'/>
              <ReferenceArea y1={108} y2={180} fill={BORDERLINE} fillOpacity={0.2} ifOverflow='hidden'/>
              <ReferenceArea y1={180} y2={280} fill={HIGH} fillOpacity={0.2} ifOverflow='hidden'/>
              <ReferenceArea y1={280} y2={1000} fill={VERY_HIGH} fillOpacity={0.2} ifOverflow='hidden'/>
            </LineChart>
          </ResponsiveContainer>
        )}
        {/* Display the pie chart if selected */}
        {chartData.length && selectedChart === 'blood-glucose-breakdown' && (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <Pie data={cleanData_bgBreakdown(chartData)} dataKey="value" innerRadius={100}>
                {COLORS.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip content={<BGBreakdown_Tooltip /> } />
            </PieChart>
          </ResponsiveContainer>
        )}
        {/* Display the Insulin Dosage line chart if selected */}
        {chartData.length && selectedChart === 'insulin-dosages' && (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={cleanData_id(chartData)} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="created_date" interval={Math.round(chartData.length / 3)}/>
              <YAxis label={{ value: 'units', angle: -90, position: 'insideLeft' }}  />
              <Tooltip content={<Ins_Tooltip />} />
              <Legend />
              {<Line type="monotone" dataKey="reading" stroke={MORNING} />}
            </LineChart>
          </ResponsiveContainer>
        )}
        {/* Gray out overlay and "No Record" card if using placeholder data */}
        {(hasError || chartData.length === 0) && (
          <Box
            position="absolute"
            top={0}
            left={0}
            width="100%"
            height="100%"
            bgcolor="rgba(255, 255, 255, 0.75)"
            display="flex"
            justifyContent="center"
            alignItems="center"
          >
            <Card sx={{ maxWidth: 400 }}>
              <CardContent>
                <Typography variant="h6" textAlign="center">
                  No Data Yet
                </Typography>
              </CardContent>
            </Card>
          </Box>
        )}
      </Box>
    </Box>
  );
}
