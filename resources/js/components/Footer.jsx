import React from 'react';
import { Box, Typography } from '@mui/material';

function Footer() {
  return (
    <Box
      component="footer"
      sx={{
        width: '100%',
        textAlign: 'center',
        py: 2,
        position: 'fixed',
        bottom: 0,
      }}
    >
      <Typography variant="body2">&copy; {new Date().getFullYear()} Skin&Spoon. All rights reserved.</Typography>
    </Box>
  );
}

export default Footer;
