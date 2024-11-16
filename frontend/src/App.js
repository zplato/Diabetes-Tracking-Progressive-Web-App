import './App.css';
import React, { useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, useNavigate, useLocation } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Box, Tabs, Tab, Link } from '@mui/material';
import { MySugarAndInsulin } from './components/MySugarAndInsuline';
import { MyCharts } from './components/MyCharts';
import { MyAchievements } from './components/MyAchievements';
import { CreateAccount } from './components/CreateAccount';
import { LoginPage } from './components/LoginPage';

function App() {
  // State to track the selected tab index for navigation
  const [selectedTab, setSelectedTab] = React.useState(0);
  // State to track if the user is logged in
  const [isLoggedIn, setIsLoggedIn] = React.useState(false);
  // State to store the username of the logged-in user
  const [username, setUsername] = React.useState('');
  const navigate = useNavigate();
  const location = useLocation();

  // Effect to navigate to the create account page if not logged in and on the root path
  useEffect(() => {
    if (!isLoggedIn && location.pathname === '/') {
      navigate('/login');
    }
  }, [isLoggedIn, location, navigate]);

  // Handles changing tabs and updating the route accordingly
  const handleTabChange = (event, newValue) => {
    setSelectedTab(newValue);
    switch (newValue) {
      case 0:
        navigate('/my-sugar-insulin');
        break;
      case 1:
        navigate('/my-charts');
        break;
      case 2:
        navigate('/my-achievements');
        break;
      default:
        navigate('/my-sugar-insulin');
    }
  };

  // Function to handle login, setting the user as logged in and storing the username
  const handleLogin = (user) => {
    setIsLoggedIn(true);
    setUsername(user);
    navigate('/my-sugar-insulin');
  };

  // Function to handle logout, clearing the login state and navigating to the login page
  const handleLogout = () => {
    setIsLoggedIn(false);
    setUsername('');
    navigate('/login');
  };

  return (
    <Box>
      <AppBar position="static" sx={{ backgroundColor: '#A02B93' }}>
        <Toolbar>
          {/* MAZNA Logo */}
          <img src="/images/mazna-logo.png" alt="mazna-logo" style={{ width: '30px', height: 'auto', marginRight: '16px'}} />
          
          {/* Title of the app in the AppBar */}
          <Typography sx={{ flexGrow: 1, fontSize: '19px', letterSpacing: '0.7px' }}>
            MAZNA Tech - Diabetes App for Kids!
          </Typography>
          {/* Display the username when logged in */}
          {isLoggedIn && (
            <Typography sx={{ fontSize: '16px', letterSpacing: '0.7px', mr: 3}}>
              Hello, {username}!
            </Typography>
          )}
          {/* Show login and create account links if the user is not logged in */}
          {!isLoggedIn && (
            <Box>
              <Link
                component="button"                
                color="inherit"
                onClick={() => navigate('/login')}
                sx={{ fontSize: '16px', letterSpacing: '0.7px', mr: 5, textDecoration: 'none' }}
              >
                Login
              </Link>
              <Link
                component="button"                
                color="inherit"
                onClick={() => navigate('/create-account')}
                sx={{ fontSize: '16px', letterSpacing: '0.7px', mr: 3, textDecoration: 'none' }}
              >
                Create Account
              </Link>
            </Box>
          )}
          {/* Show logout link if the user is logged in */}
          {isLoggedIn && (
            <Link
              component="button"              
              color="inherit"
              onClick={handleLogout}
              sx={{ fontSize: '16px', letterSpacing: '0.7px', mr: 3, textDecoration: 'none' }}
            >
              Logout
            </Link>
          )}
        </Toolbar>
      </AppBar>

      {/* Conditional rendering of components based on login status */}
      {isLoggedIn ? (
        <Box>
          {/* Tabs for navigating between different pages */}
          <Tabs value={selectedTab} onChange={handleTabChange} centered 
              sx={{backgroundColor: '#F2F2F2','.MuiTabs-indicator': { backgroundColor: '#A02B93' }}}>
            <Tab label="My Sugar & Insulin" 
                sx={{ color: selectedTab === 0 ? '#9CCF53' : '#999999', fontWeight: 600, '&.Mui-selected': { color: '#9CCF53' }}}/>
            <Tab label="My Charts"
                sx={{ color: selectedTab === 1 ? '#9CCF53' : '#999999', fontWeight: 600, '&.Mui-selected': { color: '#9CCF53' }}}/>
            <Tab label="My Achievements" 
                sx={{ color: selectedTab === 2 ? '#9CCF53' : '#999999', fontWeight: 600, '&.Mui-selected': { color: '#9CCF53' }}}/>
          </Tabs>

          {/* Define the routes for logged-in pages */}
          <Routes>
            <Route path="/my-sugar-insulin" element={<MySugarAndInsulin />} />
            <Route path="/my-charts" element={<MyCharts />} />
            <Route path="/my-achievements" element={<MyAchievements username={username} />} />
          </Routes>
        </Box>
      ) : (
        <Routes>
          {/* Define the routes for non-logged-in pages */}
          <Route path="/" element={<CreateAccount onLogin={(user) => handleLogin(user)} />} />
          <Route path="/create-account" element={<CreateAccount onLogin={(user) => handleLogin(user)} />} />
          <Route path="/login" element={<LoginPage onLogin={(user) => handleLogin(user)} />} />
        </Routes>
      )}
    </Box>
  );
}

export default function MainApp() {
  // Main app component wrapped in Router to handle navigation
  return (
    <Router>
      <App />
    </Router>
  );
}
