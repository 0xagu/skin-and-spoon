import React from 'react';
import { Card, CardContent, Typography } from '@mui/material';

const CardItem = ({ category }) => {
  return (
    <Card sx={{ mb: 2 }}>
      <CardContent>
      <Typography variant="body2" color="textSecondary">
          Logo: {category?.logo}
        </Typography>
        <Typography variant="h6">Name: {category?.name}</Typography>
        <Typography variant="body2" color="textSecondary">
          Quantity: {category?.quantity}
        </Typography>
        <Typography variant="body2" color="textSecondary">
          Expiry Date: {category?.expiration_date}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default CardItem;
