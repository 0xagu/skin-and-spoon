import React, { useState } from 'react';
import { Box } from '@mui/material';
import Footer from '../../components/Footer.jsx';
import Header from '../../components/Header.jsx';
import ShoppingList from '../ShoppingList';
import Analytic from '../Analytic';
import { useSelector } from 'react-redux';
import AIChat from '../AIChat';
import ItemByDate from '../ItemByDate';
import Sidebar from '../../components/Sidebar.jsx';
function Dashboard() {
  const drawerWidth = 90;
  const filter = useSelector((state) => state.filter);

  const [mobileOpen, setMobileOpen] = useState(false);
 
  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };
  
  return (
    <Box sx={{ display: 'flex' }}>
      <Header handleDrawerToggle={handleDrawerToggle}/>
      <Sidebar mobileOpen={mobileOpen} handleDrawerToggle={handleDrawerToggle} />
      
      {filter?.filter === "Shopping List" ? (
        <ShoppingList 
          handleDrawerToggle={handleDrawerToggle} 
          mobileOpen={mobileOpen} 
          drawerWidth={drawerWidth}
        />
      ) : filter?.filter === "Analytic" ? (
        <Analytic 
          handleDrawerToggle={handleDrawerToggle} 
          mobileOpen={mobileOpen} 
          drawerWidth={drawerWidth}
        />
      ) : filter?.filter === "AI Chat" ? (
        <AIChat 
          handleDrawerToggle={handleDrawerToggle} 
          mobileOpen={mobileOpen} 
          drawerWidth={drawerWidth}
        />
      ) : (
        <ItemByDate 
          handleDrawerToggle={handleDrawerToggle} 
          mobileOpen={mobileOpen} 
          drawerWidth={drawerWidth}
        />
      )}
      <Footer />
    </Box>
  );
}

export default Dashboard;
