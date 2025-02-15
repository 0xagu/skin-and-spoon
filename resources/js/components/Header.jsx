import React, { useState } from 'react';
import { AppBar, Toolbar, Typography, Box, Button, IconButton } from '@mui/material';
import CssBaseline from '@mui/material/CssBaseline';
import VerifyLoginRegister from './VerifyLoginRegister';

const Header = ({ handleDrawerToggle }) => {
    const [open, setOpen] = useState(false);
       
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    return (
        <Box>
            <CssBaseline />
            <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
                <Toolbar>
                <IconButton
                    color="inherit"
                    edge="start"
                    onClick={handleDrawerToggle}
                    sx={{ display: { sm: 'none' }, mr: 2 }}
                >
                    Open
                </IconButton>
                <Typography variant="h6" noWrap component="div">
                    My App
                </Typography>
                <Box sx={{ marginLeft: 'auto' }} onClick={handleOpen}>
                    <Button color="inherit">Login</Button>
                </Box>
                </Toolbar>
            </AppBar>
            <VerifyLoginRegister open={open} handleClose={handleClose} />
        </Box>
    );
};

export default Header;
