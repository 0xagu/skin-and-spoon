import React, { useState } from 'react';
import Header from "../../components/Header";
import { Container, Box, Grid2, Button, Stack } from '@mui/material';
import InteractiveBackground from '../Home/Partials/3dInteractiveBackground';
import { Suspense } from 'react';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import VerifyLoginRegister from '../../components/VerifyLoginRegister';
const Login = () => {
    const [open, setOpen] = useState(false);
          
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    return (
      <Container maxWidth="false" disableGutters>
        <Header />
        <Box component="main" >
          <Grid2 
            container
            disableGutters
            sx={{
              display: 'flex',
              justifyContent: 'center',
              flexDirection: 'column',
              alignItems: 'center',
              height: '100vh',
              overflow: 'hidden',
            }}
          >
            <Grid2 
              item  
              sx={{
                flexGrow: 1,
                display: 'flex',
                position: 'relative',
                width: '60%'
              }}
            >
              <Stack 
                spacing={2} 
                direction="column"
                sx={{
                  marginLeft: 20,
                  marginTop: 30,
                  width: '25%'
                }}
              >
                <h1 style={{ zIndex: 10 }}>Track Your Essentials, Save Your Money.</h1>
                <h4 style={{ zIndex: 10 }}>Efficiently manage your products and never miss an expiry with Skin & Spoon.</h4>
                <Button 
                  variant="outlined" 
                  endIcon={<ArrowForwardIcon />}
                  style={{ zIndex: 10 }}
                  onClick={handleOpen}
                >
                  Get Started
                </Button>
              </Stack>
            </Grid2>
            <Suspense fallback={null}>
                <InteractiveBackground />
              </Suspense>
          </Grid2>
        </Box>
        <VerifyLoginRegister open={open} handleClose={handleClose} />
      </Container>
    );
};
export default Login;