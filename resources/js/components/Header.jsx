import React, { useState } from 'react';
import { AppBar, Toolbar, Typography, Box, Button, IconButton, Badge, Menu, MenuItem } from '@mui/material';
import CssBaseline from '@mui/material/CssBaseline';
import VerifyLoginRegister from './VerifyLoginRegister';
import { usePage, router } from '@inertiajs/react';
import NotificationsIcon from '@mui/icons-material/Notifications';
import { setFilter } from '../store/action';
import { useDispatch } from 'react-redux';

const Header = ({ handleDrawerToggle }) => {
    const [open, setOpen] = useState(false);
    const { auth } = usePage().props;
    const dispatch = useDispatch();

    const [notifications, setNotifications] = useState([
        { id: 1, title: "New Item Added", path: "/dashboard" },
        { id: 2, title: "Something is Expiring Soon", path: "/dashboard", filter: "Expired" }
    ]);
    
    // notification menu
    const [anchorEl, setAnchorEl] = useState(null);
    const openNotifications = Boolean(anchorEl);

    const handleNotificationsClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleNotificationsClose = () => {
        setAnchorEl(null);
    };

    const handleNotificationClick = (notification) => {
        if (notification.filter) {
            dispatch(setFilter(notification.filter));
        }
        router.visit(notification.path);
        handleNotificationsClose();
    };
    
       
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const handleLogout = async () => {
        try {
            await axios.post('/logout');
            window.location.href = '/';
        } catch (error) {
            console.error('Logout failed', error);
        }
    };

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
                <Box sx={{ marginLeft: 'auto' }}>
                    {auth.user && (
                        <>
                            {/* Notification Bell Icon */}
                            <IconButton color="inherit" onClick={handleNotificationsClick}>
                                <Badge badgeContent={notifications.length} color="error">
                                    <NotificationsIcon />
                                </Badge>
                            </IconButton>

                            {/* Notification Dropdown Menu */}
                            <Menu
                                anchorEl={anchorEl}
                                open={openNotifications}
                                onClose={handleNotificationsClose}
                                PaperProps={{
                                    sx: { width: '250px', maxHeight: '300px', overflowY: 'auto' }
                                }}
                            >
                                {notifications.length > 0 ? (
                                    notifications.map((notification) => (
                                        <MenuItem 
                                            key={notification.id} 
                                            onClick={() => handleNotificationClick(notification)}
                                        >
                                            {notification.title}
                                        </MenuItem>
                                    ))
                                ) : (
                                    <MenuItem onClick={handleNotificationsClose}>
                                        No new notifications
                                    </MenuItem>
                                )}
                            </Menu>
                        </>
                    )}
                    {auth.user ? (
                        <Button color="inherit" onClick={handleLogout}>
                            Logout
                        </Button>
                    ) : (
                        <Button color="inherit" onClick={handleOpen}>
                            Login
                        </Button>
                    )}
                </Box>
                </Toolbar>
            </AppBar>
            <VerifyLoginRegister open={open} handleClose={handleClose} />
        </Box>
    );
};

export default Header;
