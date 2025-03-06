import React, { useState } from 'react';
import { Box,Typography, Button, TextField, List, ListItem, IconButton, ListItemText } from '@mui/material';
import Header from '../../../../components/Header';
import Sidebar from '../../../../components/Sidebar';
import Footer from '../../../../components/Footer';
import { ArrowUpward, ArrowDownward, Delete } from '@mui/icons-material';

function ShoppingList({ handleDrawerToggle, mobileOpen, setFilter, drawerWidth}) {

    const [items, setItems] = useState([]);
    const [newItem, setNewItem] = useState('');

    const handleAddItem = () => {
        if (newItem.trim() === '') return;
        setItems([...items, newItem]);
        setNewItem('');
    };

    const handleDeleteItem = (index) => {
        const updatedItems = [...items];
        updatedItems.splice(index, 1);
        setItems(updatedItems);
    };

    const moveItem = (index, direction) => {
        const updatedItems = [...items];
        const targetIndex = index + direction;
        if (targetIndex < 0 || targetIndex >= updatedItems.length) return;
        [updatedItems[index], updatedItems[targetIndex]] = [updatedItems[targetIndex], updatedItems[index]];
        setItems(updatedItems);
    };
    
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

                <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
                    <TextField
                        label="New Item"
                        variant="outlined"
                        value={newItem}
                        onChange={(e) => setNewItem(e.target.value)}
                        fullWidth
                    />
                    <Button variant="contained" onClick={handleAddItem}>
                        Add
                    </Button>
                </Box>

                <List>
                    {items.map((item, index) => (
                        <ListItem
                            key={index}
                            secondaryAction={
                                <Box>
                                    <IconButton onClick={() => moveItem(index, -1)}>
                                        <ArrowUpward />
                                    </IconButton>
                                    <IconButton onClick={() => moveItem(index, 1)}>
                                        <ArrowDownward />
                                    </IconButton>
                                    <IconButton onClick={() => handleDeleteItem(index)}>
                                        <Delete />
                                    </IconButton>
                                </Box>
                            }
                        >
                            <ListItemText primary={item} />
                        </ListItem>
                    ))}
                </List>
            </Box>
            <Footer />
        </Box>
    );
}

export default ShoppingList;