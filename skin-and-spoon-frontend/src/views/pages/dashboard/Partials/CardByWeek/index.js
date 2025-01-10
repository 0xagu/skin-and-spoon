import React, { useState } from 'react';
import { Typography, Box, Grid2, Button } from '@mui/material';
import CardItem from './CardItem.js';
import AddItemModal from '../AddItemModal.js/index.js';

const CardByWeek = () => {
  const categories = ['Category 1', 'Category 2', 'Category 3'];

  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <Box>
      <Box>
        {/* Categories for Week 1 */}
        <Grid2 container spacing={2}>
          {categories.map((category) => (
            <Grid2 item xs={12} sm={4} key={category}>
              <Box sx={{ border: '1px solid #ddd', p: 2 }}>
              <Box 
                sx={{
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center'
                }}
              >
                <Typography variant="h6" gutterBottom>{category}</Typography>
                <Button 
                  onClick={handleOpen}
                  variant="contained" 
                  sx={{ ml: 2 }}
                >
                  +
                </Button>
              </Box>
                {/* Cards for each category */}
                <Grid2 container direction="column" spacing={2}> {/* Set direction to column */}
                  
                  <Grid2 item xs={12} sm={4} >
                    <CardItem category={category}/>
                  </Grid2>
                  <Grid2 item xs={12} sm={4} >
                    <CardItem category={category}/>
                  </Grid2>
                  <Grid2 item xs={12} sm={4} >
                    <CardItem category={category}/>
                  </Grid2>
                </Grid2>
              </Box>
            </Grid2>
          ))}
        </Grid2>
      </Box>
      <AddItemModal open={open} handleClose={handleClose} />
    </Box>
  );
};

export default CardByWeek;
