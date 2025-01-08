import React, { useState } from 'react';
import Header from "../../components/Header";
import { Box, Container, Toolbar, Button } from '@mui/material';

import Sidebar from '../../components/Sidebar';
const Dashboard = () => {
    const [open, setOpen] = useState(false);

    const toggleDrawer = (newOpen) => () => {
      setOpen(newOpen);
    };

    return (
      <Container maxWidth="false" disableGutters>
        {/* <Header /> */}
        <Toolbar/>
        
        <Box className="body">
          <h1>Dashboard</h1>
          <Button onClick={toggleDrawer(true)}>Open drawer</Button>
        </Box>

        <Sidebar open={open} toggleDrawer={toggleDrawer} />
      </Container>
    );
};
export default Dashboard;