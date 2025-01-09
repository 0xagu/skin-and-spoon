import React from 'react';
import { Typography, Box, Grid2, Button } from '@mui/material';
import CardItem from './CardItem.js';

const CardByWeek = ({ activeTab }) => {
  const categories = ['Category 1', 'Category 2', 'Category 3'];

  // Function to render cards in each category
  const renderCards = (category) => {
    return [0, 1, 2].map((index) => (
      <Grid2 item xs={12} sm={4} key={index}>
        <CardItem category={category} index={index} />
      </Grid2>
    ));
  };

  return (
    <Box>
      {activeTab === 0 && (
        <Box>
          <Typography variant="h5" gutterBottom>Week 1</Typography>

          {/* Categories for Week 1 */}
          <Grid2 container spacing={2}>
            {categories.map((category) => (
              <Grid2 item xs={12} sm={4} key={category}>
                <Box sx={{ border: '1px solid #ddd', p: 2 }}>
                  <Typography variant="h6" gutterBottom>{category}</Typography>
                  
                  {/* Cards for each category */}
                  <Grid2 container direction="column" spacing={2}> {/* Set direction to column */}
                    {renderCards(category)}
                  </Grid2>

                  {/* Add button */}
                  <Button variant="contained" sx={{ mt: 2 }}>
                    +
                  </Button>
                </Box>
              </Grid2>
            ))}
          </Grid2>
        </Box>
      )}

      {activeTab === 1 && (
        <Box>
          <Typography variant="h5" gutterBottom>Week 2</Typography>

          {/* Categories for Week 1 */}
          <Grid2 container spacing={2}>
            {categories.map((category) => (
              <Grid2 item xs={12} sm={4} key={category}>
                <Box sx={{ border: '1px solid #ddd', p: 2 }}>
                  <Typography variant="h6" gutterBottom>{category}</Typography>
                  
                  {/* Cards for each category */}
                  <Grid2 container direction="column" spacing={2}> {/* Set direction to column */}
                    {renderCards(category)}
                  </Grid2>

                  {/* Add button */}
                  <Button variant="contained" sx={{ mt: 2 }}>
                    +
                  </Button>
                </Box>
              </Grid2>
            ))}
          </Grid2>
        </Box>
      )}
    </Box>
  );
};

export default CardByWeek;
