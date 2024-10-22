import React from 'react';
import { Box, Typography, Card, CardContent } from '@mui/material';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';

export function MyAchievements({ username = "John" }) {
  // Placeholder values for rank and points
  const rank = "Silver";
  const currentPoints = 1200;
  const pointsToRankUp = 300;

  return (
    <Box p={3} display="flex" flexDirection="column" alignItems="center">
      {/* Greeting message with the username */}
      <Typography variant="h5" mb={3}>
        Hello, {username}. Good job, keep it up!
      </Typography>
      <Box display="flex" alignItems="center" width="100%" maxWidth={600}>
        {/* Trophy icon to the left of the achievement information */}
        <EmojiEventsIcon sx={{ fontSize: 100, mr: 4 }} />
        <Card sx={{ flexGrow: 1 }}>
          <CardContent>
            {/* Achievement information grid */}
            <Box display="grid" gridTemplateColumns="1fr 1fr" gap={2}>
              {/* Displaying user's rank */}
              <Typography variant="h6" textAlign="left">Your Rank</Typography>
              <Typography variant="body1" textAlign="right">{rank}</Typography>

              {/* Displaying current points */}
              <Typography variant="h6" textAlign="left">Current Points</Typography>
              <Typography variant="body1" textAlign="right">{currentPoints}</Typography>

              {/* Displaying points needed to rank up */}
              <Typography variant="h6" textAlign="left">Points to Rank Up</Typography>
              <Typography variant="body1" textAlign="right">{pointsToRankUp}</Typography>
            </Box>
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
}