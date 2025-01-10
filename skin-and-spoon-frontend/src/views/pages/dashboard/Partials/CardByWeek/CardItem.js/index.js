import React from 'react';
import { Card, CardContent, Typography } from '@mui/material';

const CardItem = ({ category }) => {
  return (
    <Card sx={{ mb: 2 }}>
      <CardContent>
        <Typography variant="h6">Card  for {category}</Typography>
        <Typography variant="body2" color="textSecondary">
          This is some content for card.
        </Typography>
      </CardContent>
    </Card>
  );
};

export default CardItem;
