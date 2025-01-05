import React, { useState } from 'react';
import Header from "../../components/Header";
import { Button, Container } from '@mui/material';
import { useTranslation } from 'react-i18next';

const Home = () => {
    const { t } = useTranslation();
   
    return (
      <Container>
        <Header />
        <h2>Home Page</h2>
        <Button variant="contained" color="primary" onClick={handleOpen}>
            Log In
        </Button>
      </Container>
    );
};
export default Home;