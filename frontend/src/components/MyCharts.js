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

  // Function to handle dropdown selection change
  const handleChartChange = (event) => {
    setSelectedChart(event.target.value);
  };

  // Function to fetch chart data from the API
  const fetchChartData = async () => {
    try {
      const response = await axios.get(`https://cs6440groupproj.onrender.com/entries?account_id=${accountID}`);
      if (response.status === 200) {
        setChartData(response.data);
        setHasError(false);
      } else {
        setChartData([]);
        setHasError(true);
      }
    } catch (error) {
      console.error('Error fetching chart data:', error);
      setChartData([]);
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
      let pretty_date = data_in[i]["created_at"].split("T")[0];
      pretty_date = new Date(pretty_date.replace(/-/g, '/'));
      pretty_date = pretty_date.toDateString();
      console.log(pretty_date);
      new_data.push( { created_at: pretty_date, 
                       bg_morning: parseFloat(data_in[i]["bg_morning"]), 
                       bg_afternoon: parseFloat(data_in[i]["bg_afternoon"]), 
                       bg_evening: parseFloat(data_in[i]["bg_evening"])});
    }
    return new_data
  };

  function cleanData_bg(data_in) {
    let new_data = [];
    for (let i in data_in) {
      let pretty_date = data_in[i]["created_at"].split("T")[0];
      pretty_date = new Date(pretty_date.replace(/-/g, '/'));
      pretty_date = pretty_date.toDateString();
      
      new_data.push( { created_at: pretty_date, 
                       reading: parseFloat(data_in[i]["bg_morning"]), 
                       tod:"Morning" });
      new_data.push( { created_at: pretty_date, 
                       reading: parseFloat(data_in[i]["bg_afternoon"]), 
                       tod:"Afternoon" });
      new_data.push( { created_at: pretty_date, 
                       reading: parseFloat(data_in[i]["bg_evening"]), 
                       tod:"Evening" });
    }
    return new_data;
  };

  function cleanData_id(data_in) {
    let new_data = [];
    for (let i in data_in) {
      let pretty_date = data_in[i]["created_at"].split("T")[0];
      pretty_date = new Date(pretty_date.replace(/-/g, '/'));
      pretty_date = pretty_date.toDateString();
      
      new_data.push( { created_at: pretty_date, reading: parseFloat(data_in[i]["ins_morning"]) });
      new_data.push( { created_at: pretty_date, reading: parseFloat(data_in[i]["ins_afternoon"]) });
      new_data.push( { created_at: pretty_date, reading: parseFloat(data_in[i]["ins_evening"]) });
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
        <p>Morning: {payload[0].value} - {getValueText(payload[0].value)}</p>
        <p>Afternoon: {payload[1].value} - {getValueText(payload[1].value)}</p>
        <p>Evening: {payload[2].value} - {getValueText(payload[2].value)}</p>
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
        <p><strong>{pretty_date.toDateString()}</strong> {payload[0].payload.tod}</p>
        <p>Reading: {payload[0].value} - {getValueText(payload[0].value)}</p>
      </div>
      );
    }
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
  };

  const Ins_Tooltip = ({active, payload, label}) => {
    if (active && payload && payload.length) {
      let label_clean = label.substring(0, label.length - 2).replace(/-/g, '/');
      let pretty_date = new Date(label_clean);
      return(
      <div className="tooltip">
        <p><strong>{pretty_date.toDateString()}</strong> {payload[0].payload.tod}</p>
        <p>Insulin Dosage: {payload[0].value}</p>
      </div>
      );
    }
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
              <XAxis dataKey="created_at"/>
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
              <XAxis dataKey="created_at" axisLine="false"/>
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
        {/* Display the Insuline Dosage line chart if selected */}
        {chartData.length && selectedChart === 'insulin-dosages' && (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={cleanData_id(chartData)} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="created_at" axisLine="false"/>
              <YAxis label={{ value: 'units', angle: -90, position: 'insideLeft' }}  />
              <Tooltip content={<Ins_Tooltip />} />
              <Legend />
              {<Line type="monotone" dataKey="reading" stroke={MORNING} />}
            </LineChart>
          </ResponsiveContainer>
        )}
        {/* Gray out overlay and "No Record" card if using placeholder data */}
        {hasError || chartData.length === 0 && (
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
