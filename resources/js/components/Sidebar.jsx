import React, { useState} from 'react';
import { Box, Drawer, List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  Toolbar,
  useMediaQuery } from '@mui/material';
  import { Inbox as InboxIcon, Mail as MailIcon } from '@mui/icons-material';

function Sidebar({ mobileOpen, handleDrawerToggle, setFilter}) {
  const isMobile = useMediaQuery('(max-width:600px)');
  const drawerWidth = 240;
  
  const menuItems = ['All', 'Starred', 'Expired', 'Shopping List', 'Analytic'];
  const actions = ['Help', 'Logout'];

  const handleFilterChange = (filter) => {
    setFilter(filter);
  }

  const drawer = (
    <Box sx={{ width: drawerWidth }} role="presentation">
      <Toolbar />
      <Divider />
      <List>
        {menuItems?.map((text, index) => (
          <ListItem key={text} onClick={() => handleFilterChange(text)} disablePadding>
            <ListItemButton>
              <ListItemIcon>{index % 2 === 0 ? <InboxIcon /> : <MailIcon />}</ListItemIcon>
              <ListItemText primary={text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      <Divider />
      <List>
        {actions?.map((text, index) => (
          <ListItem key={text} disablePadding>
            <ListItemButton onClick={() => handleFilterChange(text)}>
              <ListItemIcon>{index % 2 === 0 ? <InboxIcon /> : <MailIcon />}</ListItemIcon>
              <ListItemText primary={text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <Box >
      <Drawer
        variant={isMobile ? 'temporary' : 'permanent'}
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{ keepMounted: true }} // Better open performance on mobile.
        sx={{
          display: { xs: 'block', sm: 'none' },
          '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
        }}
      >
        {drawer}
      </Drawer>
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: 'none', sm: 'block' },
          '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
        }}
        open
      >
        {drawer}
      </Drawer>
    </Box>
  );
}

export default Sidebar;
