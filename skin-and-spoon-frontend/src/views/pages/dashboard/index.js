import React, { useState } from 'react';
import {
  Box,
  Tabs,
  Tab
} from '@mui/material';
import Header from '../../components/Header';
import Sidebar from '../../components/Sidebar';
import Footer from '../../components/Footer';
import CardByWeek from './Partials/CardByWeek';

function Dashboard() {
  const drawerWidth = 240;
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeTab, setActiveTab] = useState(0);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };
  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <Header handleDrawerToggle={handleDrawerToggle}/>

      {/* MAIN CONTENT */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          marginLeft: { sm: `${drawerWidth}px` },
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          marginTop: '64px',
        }}
      >
        {/* Tabs Section */}
        <Box sx={{ borderBottom: 1, borderColor: 'divider', }}>
          <Tabs value={activeTab} onChange={handleTabChange}>
            <Tab label="Week 1" />
            <Tab label="Week 2" />
          </Tabs>
        </Box>

        {/* Render the content of the active tab */}
        <Box sx={{ mt: 3 }}>
          <CardByWeek activeTab={activeTab} />
        </Box>
      </Box>

      <Sidebar mobileOpen={mobileOpen} handleDrawerToggle={handleDrawerToggle}/>
      <Footer />
    </Box>
  );
}

export default Dashboard;
