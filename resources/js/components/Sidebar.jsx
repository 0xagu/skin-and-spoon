import { Box, Drawer, List, ListItem, ListItemButton, ListItemIcon, Divider, useMediaQuery } from '@mui/material';
import { Search as SearchIcon, Category as CategoryIcon, ShoppingCart as ShoppingCartIcon, HelpOutline as HelpOutlineIcon } from '@mui/icons-material';
import { useDispatch } from 'react-redux';
import { setFilter } from '../store/action';

function Sidebar({ mobileOpen, handleDrawerToggle }) {
  const dispatch = useDispatch();
  const isMobile = useMediaQuery('(max-width:600px)');
  const drawerWidth = 90;

  const menuItems = [
    { text: 'All', icon: <CategoryIcon sx={{ color: 'black', fontSize: 24 }} /> },
    { text: 'Category', icon: <SearchIcon sx={{ color: 'black', fontSize: 24 }} /> },
    { text: 'Shopping List', icon: <ShoppingCartIcon sx={{ color: 'black', fontSize: 24 }} /> },
    { text: 'Help', icon: <HelpOutlineIcon sx={{ color: 'black', fontSize: 24 }} /> }
  ];

  const handleFilterChange = (filter) => {
    dispatch(setFilter(filter));
  };

  const drawer = (
    <Box 
      sx={{ 
        width: drawerWidth,
        overflowX: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: '100vh',
        position: 'absolute',
        top: 0,
        left: 0,
        zIndex: 1300,
        paddingTop: 1,
        paddingBottom: 1,
      }} 
      role="presentation"
    >
      <List>
        <ListItem  disablePadding>
          <ListItemButton>
            <ListItemIcon
              sx={{
                backgroundColor: 'rgba(0, 0, 0, 0.1)',
                borderRadius: '50%',
                width: 45,
                height: 45,
                minWidth: 45,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                
              }}
            >
              logo
            </ListItemIcon>
          </ListItemButton>
        </ListItem>
      </List>
      <List>
        {menuItems.map(({ text, icon }) => (
          <ListItem key={text} onClick={() => handleFilterChange(text)} disablePadding>
            <ListItemButton>
              <ListItemIcon
                sx={{
                  backgroundColor: 'rgba(0, 0, 0, 0.1)',
                  borderRadius: '50%',
                  width: 45,
                  height: 45,
                  minWidth: 45,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  
                }}
              >
                {icon}
              </ListItemIcon>
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      <Divider />
    </Box>
  );

  return (
    <Box>
      <Drawer
        variant={isMobile ? 'temporary' : 'permanent'}
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{ keepMounted: true }}
        sx={{
          '& .MuiDrawer-paper': {
            boxSizing: 'border-box',
            width: drawerWidth,
            overflowX: 'hidden',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100vh',
            position: 'absolute',
            top: 0,
            left: 0,
            zIndex: 1300,
          },
        }}
      >
        {drawer}
      </Drawer>
    </Box>
  );
}

export default Sidebar;
