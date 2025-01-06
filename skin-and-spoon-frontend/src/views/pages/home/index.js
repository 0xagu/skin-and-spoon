import React from 'react';
import Header from "../../components/Header";
import { Container, Box, Toolbar, Grid2 } from '@mui/material';
import { useTranslation } from 'react-i18next';
import InteractiveBackground from './Partials/3dInteractiveBackground';
import { Suspense } from 'react';
const Home = () => {
    return (
      <Container maxWidth="false" disableGutters>
        <Header />
        <Box component="main" >
          {/* <Toolbar/> */}
          <Grid2 
            container
            disableGutters
            sx={{
              backgroundColor: 'blue',
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
                backgroundColor: 'red',
                flexGrow: 1,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                position: 'relative',
              }}
            >
              <h2 style={{ zIndex: 10 }}>Stop Wasting Money Y'all!</h2>
            </Grid2>
            <Grid2 
              item 
              xs={6}
              sx={{
                backgroundColor: 'green',
                flexGrow: 1,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                position: 'relative',
              }}
            >
              <h2 style={{ zIndex: 10 }}>Stop Wasting Money Y'all!</h2>
            </Grid2>
            <Suspense fallback={null}>
                <InteractiveBackground />
              </Suspense>
          </Grid2>
        </Box>
       
      </Container>
    );
};
export default Home;