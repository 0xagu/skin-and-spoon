import React, { useState } from 'react';
import { AppBar, Toolbar, Typography, Box, Button, IconButton, Badge, Menu, MenuItem, Avatar, Divider } from '@mui/material';
import CssBaseline from '@mui/material/CssBaseline';
import VerifyLoginRegister from './VerifyLoginRegister';
import { usePage, router } from '@inertiajs/react';
import NotificationsIcon from '@mui/icons-material/Notifications';
import { setFilter } from '../store/action';
import { useDispatch } from 'react-redux';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { formatDistanceToNow } from 'date-fns';

const Header = ({ handleDrawerToggle }) => {
    const [open, setOpen] = useState(false);
    const { auth } = usePage().props;
    const dispatch = useDispatch();

    const [notifications, setNotifications] = useState([
        { id: 1, title: "New Item Added", timestamp: 1711468800000 },
        { id: 2, title: "New Item Added", timestamp: 1711468800000 }
    ]);

    const formatTimeAgo = (timestamp) => {
        return formatDistanceToNow(new Date(timestamp), { addSuffix: true });
    };
    
    // notification menu
    const [anchorEl, setAnchorEl] = useState(null);
    const [anchorUser, setAnchorUser] = useState(null);

    const openNotifications = Boolean(anchorEl);
    const openUserMenu = Boolean(anchorUser);

    const handleNotificationsClick = (event) => setAnchorEl(event.currentTarget);
    const handleNotificationsClose = () => setAnchorEl(null);

    const handleUserMenuClick = (event) => setAnchorUser(event.currentTarget);
    const handleUserMenuClose = () => setAnchorUser(null);

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
            <AppBar position="fixed" elevation={0} sx={{ backgroundColor: 'transparent', boxShadow: 'none', paddingTop: 1 }}>
                <Toolbar sx={{ justifyContent: 'flex-end', gap: 2 }}>
                    {auth.user && (
                        <>
                            {/* Notification Bell Icon */}
                            <IconButton 
                                onClick={handleNotificationsClick}
                                sx={{
                                    border: '2px solid #ccc',
                                    borderRadius: '50%',
                                    padding: '6px',
                                    color: 'black',
                                }}
                            >
                                <Badge badgeContent={notifications.length} color="error">
                                    <NotificationsIcon fontSize="small" />
                                </Badge>
                            </IconButton>

                            {/* Notification Dropdown Menu */}
                            <Menu
                                anchorEl={anchorEl}
                                open={openNotifications}
                                onClose={handleNotificationsClose}
                                PaperProps={{ sx: { width: 400, maxHeight: '300px', overflowY: 'auto' } }}
                                anchorOrigin={{
                                    vertical: 'bottom',
                                    horizontal: 'left',  // Aligns the left side of the menu with the button
                                }}
                                transformOrigin={{
                                vertical: 'top',
                                horizontal: 'right',  // Ensures the menu expands leftward
                                }}
                            >
                                
                                <Box sx={{ display: "flex", justifyContent: "flex-end", p: 1 }}>
                                    <Button size="small" onClick={() => router.visit('/notification')} endIcon={<ArrowForwardIcon />}>
                                        View All
                                    </Button>
                                </Box>
                                
                                {notifications.length > 0 ? (
                                    notifications.map((notification, index) => (
                                        <React.Fragment key={notification.id}>
                                            <MenuItem onClick={() => handleNotificationClick(notification)}>
                                                <Box sx={{ display: "flex", alignItems: "center", gap: 2, width: "100%" }}>
                                                    {/* Avatar on the left */}
                                                    <Avatar src={auth?.user?.profilePicture} sx={{ width: 40, height: 40 }} />

                                                    {/* Notification content */}
                                                    <Box sx={{ flexGrow: 1 }}>
                                                        <Typography variant="body1">{notification.title}</Typography>
                                                        <Typography variant="caption" color="text.secondary">
                                                            {formatTimeAgo(notification.timestamp)}
                                                        </Typography>
                                                    </Box>
                                                </Box>
                                            </MenuItem>
                                            {index < notifications.length - 1 && <Divider />}
                                        </React.Fragment>
                                    ))
                                ) : (
                                    <MenuItem onClick={handleNotificationsClose}>No new notifications</MenuItem>
                                )}

                            </Menu>
                        </>
                    )}

                    {auth.user ? (
                        <Box 
                            sx={{ 
                                cursor: 'pointer', 
                                // border: '1px solid #ccc', 
                                padding: '6px 12px', 
                                // borderRadius: '8px', 
                                display: 'flex', 
                                alignItems: 'center', 
                                gap: 1 
                            }} 
                            onClick={handleUserMenuClick}
                        >
                            <Typography variant="body1" sx={{ color: 'primary.main' }}>Hey, {auth?.user?.name}</Typography>
                            <ArrowDropDownIcon  sx={{ color: 'primary.main' }}/>
                        </Box>
                    ) : (
                        <>
                            <Button variant="contained" color="primary" onClick={handleOpen} sx={{ borderRadius: "20px", px:3 }}>
                                Login
                            </Button>
                            <Button variant="outlined" onClick={handleOpen} sx={{ borderRadius: "20px", px: 3, borderColor: "black", color: "black" }}>
                                Sign Up
                            </Button>
                        </>
                    )}

                    {/* User Dropdown Menu */}
                    <Menu
                        anchorEl={anchorUser}
                        open={openUserMenu}
                        onClose={handleUserMenuClose}
                        PaperProps={{ 
                            sx: { 
                              width: 400, 
                              borderRadius: 3,
                              boxShadow: "none",
                              border: '1px solid #ccc', 
                            } 
                        }}
                        anchorOrigin={{
                            vertical: 'bottom',
                            horizontal: 'center',  // Centers the menu below the button
                        }}
                        transformOrigin={{
                            vertical: 'top',
                            horizontal: 'center',  // Ensures the menu expands downward symmetrically
                        }}
                    >
                        <MenuItem sx={{ display: "flex", alignItems: "center", gap: 3, pointerEvents: "none", py: 3 }}>
                            <Avatar src={auth?.user?.profilePicture} sx={{ width: 80, height: 80}} />
                            <div sx={{ display: "flex", alignItems: "center" }}>
                                <Typography variant="body1" fontWeight="bold">
                                {auth?.user?.name}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                {auth?.user?.email}
                                </Typography>
                                <Typography variant="body2" color="text.secondary" sx={{ fontWeight: "bold" }}>
                                    Member
                                </Typography>
                            </div>
                            
                        </MenuItem>
                        <Divider />
                        <MenuItem onClick={() => router.visit('/settings')}>Settings</MenuItem>
                        <MenuItem   onClick={handleLogout}>Logout</MenuItem>
                    </Menu>
                </Toolbar>
            </AppBar>

            <VerifyLoginRegister open={open} handleClose={handleClose} />
        </Box>
    );
};

export default Header;
