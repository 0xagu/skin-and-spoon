import React, { useState } from 'react';
import { Container, AppBar, Toolbar, Typography, Box, Button, Switch } from '@mui/material';
import AdbIcon from '@mui/icons-material/Adb';
import CssBaseline from '@mui/material/CssBaseline';
import VerifyLoginRegister from './verifyLoginRegister';

const Header = () => {
    const pages = ['Login'];
    const [darkMode, setDarkMode] = useState(false);
    const [open, setOpen] = useState(false);
        
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const handleDarkModeToggle = () => {
        setDarkMode(!darkMode);
    };
    return (
        <Box sx={{ display: 'flex' }}>
            <CssBaseline />
            <AppBar component="nav">
                <Container maxWidth="xl" >
                    <Toolbar disableGutters>
                        <AdbIcon sx={{ display: { xs: 'none', md: 'flex' }, mr: 1 }} />
                        <Typography
                            variant="h6"
                            noWrap
                            component="a"
                            href="#app-bar-with-responsive-menu"
                            sx={{
                                mr: 2,
                                display: { xs: 'none', md: 'flex', flexGrow: 1 },
                                fontFamily: 'monospace',
                                fontWeight: 700,
                                letterSpacing: '.3rem',
                                color: 'inherit',
                                textDecoration: 'none',
                            }}
                        >
                            Spoon & Skin
                        </Typography>

                        <Box 
                            sx={{ 
                                flexGrow: 1,
                                ml: 'auto',
                                display: 'flex',
                                justifyContent: 'flex-end',
                                alignItems: 'center'
                            }}
                        >
                            <Box sx={{ mr: 2 }}>
                                <Switch
                                    checked={darkMode}
                                    onChange={handleDarkModeToggle}
                                    name="darkMode"
                                    color="default"
                                />
                            </Box>
                                
                            {pages.map((page) => (
                                <Button
                                    key={page}
                                    onClick={handleOpen}
                                    sx={{ my: 2, color: 'white', display: 'block' }}
                                >
                                    {page}
                                </Button>
                            ))}
                        </Box>
                    </Toolbar>

                    <VerifyLoginRegister open={open} handleClose={handleClose} />
                </Container>
            </AppBar>
        </Box>
    );
};

export default Header;
