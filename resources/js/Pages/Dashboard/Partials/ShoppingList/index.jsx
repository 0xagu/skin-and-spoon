import React from 'react';
import { Box,Typography, Button } from '@mui/material';
import Header from '../../../../components/Header';
import Sidebar from '../../../../components/Sidebar';
import Footer from '../../../../components/Footer';

function ShoppingList({ handleDrawerToggle, mobileOpen, setFilter, drawerWidth}) {

    return (
        <Box sx={{ display: 'flex' }}>
            <Header handleDrawerToggle={handleDrawerToggle} />
            <Sidebar mobileOpen={mobileOpen} handleDrawerToggle={handleDrawerToggle} setFilter={setFilter} />
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
                <Typography variant="h4">Shopping List</Typography>
                <Typography variant="body1">Your shopping list items will go here.</Typography>

                <Button 
                    onClick={(e) => {
                        e.stopPropagation();
                        handleUpdateFavourite(category?.id);
                    }}
                    variant="contained" 
                    sx={{ ml: 2 }}
                >
                Fav
                </Button>
            </Box>
            <Footer />
        </Box>
    );
}

export default ShoppingList;