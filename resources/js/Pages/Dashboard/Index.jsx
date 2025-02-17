import React, { useState } from 'react';
import {
  Box,
  Tabs,
  Tab,
  Typography
} from '@mui/material';
import Header from '../../components/Header';
import Sidebar from '../../components/Sidebar';
import Footer from '../../components/Footer';
import CardByWeek from './Partials/CardByWeek';
import { useQuery } from '@tanstack/react-query';
import api from '../../api/axios';

function Dashboard() {
  const drawerWidth = 240;
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeYearTab, setActiveYearTab] = useState(2025);
  const [activeWeekTab, setActiveWeekTab] = useState(7);
  const [filter, setFilter] = useState(0);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };
  
  const handleYearTabChange = (event, newYear) => {
    setActiveYearTab(newYear);
    setActiveWeekTab(1);
  };

  const handleWeekTabChange = (event, newWeek) => {
    setActiveWeekTab(newWeek + 1);
  };

  const { data: itemDates } = useQuery({
    queryKey: ['itemDates'],
    queryFn: async () => {
      const response = await api.get(`/list/get-list-date`);
      const result = response.data;
      return typeof result === 'object' ? result : {};
    }
  });

  if (!itemDates) {
    return;
  }

  const availableWeeks = itemDates[activeYearTab] || [];

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

        {/* year section  */}
        <Box sx={{ borderBottom: 1, borderColor: 'divider', }}>
        <Tabs value={activeYearTab} onChange={handleYearTabChange}>
            {Object.keys(itemDates).map(year => (
              <Tab key={year} label={year} value={parseInt(year)} />
            ))}
          </Tabs>
        </Box>
        {/* Tabs Section */}
        <Box sx={{ borderBottom: 1, borderColor: 'divider', }}>
        <Tabs value={activeWeekTab - 1} onChange={handleWeekTabChange}>
            {availableWeeks.length > 0 ? (
              availableWeeks.map(week => (
                <Tab key={week} label={`Week ${week}`} value={week - 1} />
              ))
            ) : (
              <Tab label="No weeks available" disabled />
            )}
          </Tabs>
        </Box>

        {/* Display the active year and week */}
        <Box sx={{ mt: 3 }}>
          <Typography variant="h6">
            Year: {activeYearTab}, Week: {activeWeekTab}
          </Typography>
        </Box>

        {/* Render the content of the active tab */}
        <Box sx={{ mt: 3 }}>
          <CardByWeek 
            filter={filter} 
            year={activeYearTab} 
            week={activeWeekTab} 
          />
        </Box>
      </Box>

      <Sidebar mobileOpen={mobileOpen} handleDrawerToggle={handleDrawerToggle} setFilter={setFilter}/>
      <Footer />
    </Box>
  );
}

export default Dashboard;
