import React, { useState } from 'react';
import Header from "../../components/Header";
import { Button, Container } from '@mui/material';
import { useTranslation } from 'react-i18next';
import VerifyEmail from '../authentication/verifyEmail';
const Home = () => {
    const { t } = useTranslation();
    const [open, setOpen] = useState(false);
    
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    return (
      <Container>
        <Header />
        <h2>Home Page</h2>
        <Button variant="contained" color="primary" onClick={handleOpen}>
            Log In
        </Button>
        
        <VerifyEmail open={open} handleClose={handleClose} />
      </Container>
    );
};
export default Home;