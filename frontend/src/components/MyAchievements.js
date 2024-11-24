import React from 'react';
import { Box, Typography, Card, CardContent } from '@mui/material';
import StarsIcon from '@mui/icons-material/Stars';

export function MyAchievements({ accountID, username, firstName }) {
  // Placeholder values for rank and points
  const rank = "Silver";
  const currentPoints = 1200;
  const pointsToRankUp = 300;

  return (
    <Box p={3} display="flex" justifyContent="center" alignItems="center">      
      {/* Kid 1 with trophy */}
      <Box component="img" src="/images/kid-trophy-1.jpg" alt="doctor-image" sx={{ width: '170px' }} />
      
      <Box display="flex" alignItems="center" flexDirection="column" width="100%" maxWidth={600}>
        {/* Greeting message with the first name */}
        <Typography mt={1} mb={2} sx={{ fontSize: '24px', letterSpacing: '0.7px', color: 'black' }}>
          Hey, {firstName}!
        </Typography>
        <Typography mb={4} sx={{ fontSize: '24px', letterSpacing: '0.7px', color: 'black' }}>
          Good job! Keep it up!
        </Typography>        
        <Card sx={{ flexGrow: 1, bgcolor: '#EDFFE0', p: 2}}>
          <CardContent>
            {/* Achievement information grid */}
            <Box display="grid" gridTemplateColumns="repeat(2, 1fr)" gap={3}>
              {/* Displaying user's rank */}
              <Box display="flex" alignItems="center">
                <StarsIcon sx={{ mr: 1 , color: 'orange', pl: 3}} />
                <Typography sx={{ fontSize: '18px', letterSpacing: '0.7px', color: '#333333' }}>Your Rank</Typography>
              </Box>
              <Typography sx={{ fontSize: '18px', letterSpacing: '0.7px', color: '#333333', pl: 4 }} textAlign="center">{rank}</Typography>

              {/* Displaying current points */}
              <Box display="flex" alignItems="center">
                <StarsIcon sx={{ mr: 1 , color: 'orange', pl: 3}} />
                <Typography sx={{ fontSize: '18px', letterSpacing: '0.7px', color: '#333333' }}>Current Points</Typography>
              </Box>
              <Typography sx={{ fontSize: '18px', letterSpacing: '0.7px', color: '#333333', pl: 4 }} textAlign="center">{currentPoints}</Typography>

              {/* Displaying points needed to rank up */}
              <Box display="flex" alignItems="center">
                <StarsIcon sx={{ mr: 1 , color: 'orange', pl: 3}} />
                <Typography sx={{ fontSize: '18px', letterSpacing: '0.7px', color: '#333333' }}>Points to Rank Up</Typography>
              </Box>
              <Typography sx={{ fontSize: '18px', letterSpacing: '0.7px', color: '#333333', pl: 4 }} textAlign="center">{pointsToRankUp}</Typography>

            </Box>
          </CardContent>
        </Card>
      </Box>    

      {/* Kid 2 with trophy */}
      <Box component="img" src="/images/kid-trophy-2.jpg" alt="doctor-image" sx={{ width: '250px' }} />
    </Box>
  );
}