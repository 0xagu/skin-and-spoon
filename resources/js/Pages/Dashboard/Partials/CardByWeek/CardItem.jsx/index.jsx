import React from 'react';
import { Card, CardContent, Typography, Button, } from '@mui/material';

const CardItem = ({ category, handleViewDetail, handleUpdateFavourite }) => {
  
  return (
    <Card sx={{ mb: 2 }} onClick={() => {handleViewDetail(category?.id)}}>
      <CardContent>
        <Button 
          onClick={(e) => {
            e.stopPropagation();
            handleUpdateFavourite(category?.id);
          }}
          variant="contained" 
          sx={{ ml: 2 }}
        >
          Fav
        </Button>


        <Typography variant="body2" color="textSecondary">
          Is Fav? {category?.priority}
        </Typography>
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
