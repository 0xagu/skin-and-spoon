import React, { useState } from 'react';
import { Typography, Box, Grid2, Button } from '@mui/material';
import CardItem from './CardItem.js';
import AddItemModal from '../AddItemModal.js/index.js';
import { useQuery } from '@tanstack/react-query';
import api from '../../../../../api/axios';

const CardByWeek = () => {
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const { data: items } = useQuery({
    queryKey: ['items'],
    // enabled: bgImg ? true : false,
    queryFn: async () => {
      const response = await api.get(`/list/get`);
      const result = response.data;
      console.log("result;", result);
      return typeof result === 'object' ? result : {};
    }
  });
  return (
    <Box>
      <Box>
        {/* Categories for Week 1 */}
        <Grid2 container spacing={2}>
        {items && Object.keys(items).length > 0 ? (
            Object.keys(items).map((weekKey) => {
              const row = items[weekKey];
              console.log("weekKey:", weekKey);
              return (
              <Grid2 item xs={12} sm={4} key={weekKey}>
                <Box sx={{ border: '1px solid #ddd', p: 2 }}>
                  <Box 
                    sx={{
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center'
                    }}
                  >
                  <Typography variant="h6" gutterBottom>{row?.name}</Typography>
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
                  {row?.items?.map((item, index) => (
                    <Grid2 item xs={12} sm={4} key={index}>
                      <CardItem category={item}/>
                    </Grid2>
                  ))}
                </Grid2>
              </Box>
            </Grid2>
            );
          })
        ) : (
          <Typography>No data.</Typography>
        )}
        </Grid2>
      </Box>
      <AddItemModal open={open} handleClose={handleClose} />
    </Box>
  );
};

export default CardByWeek;
