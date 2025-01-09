import React from 'react';
import { Card, CardContent, Typography } from '@mui/material';

const CardItem = ({ category, index }) => {
  return (
    <Card sx={{ mb: 2 }}>
      <CardContent>
        <Typography variant="h6">Card {index + 1} for {category}</Typography>
        <Typography variant="body2" color="textSecondary">
          This is some content for card {index + 1}.
        </Typography>
      </CardContent>
    </Card>
  );
};

export default CardItem;
