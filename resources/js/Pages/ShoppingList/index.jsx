import React, { useState } from 'react';
import { Box,Typography, Button, TextField, List, ListItem, IconButton, ListItemText } from '@mui/material';
import Header from '../../components/Header';
import Sidebar from '../../components/Sidebar';
import Footer from '../../components/Footer';
import authApi from '../../api/axios';
import { ArrowUpward, ArrowDownward, Delete } from '@mui/icons-material';
import { useQueryClient, useQuery } from '@tanstack/react-query';

function ShoppingList({ handleDrawerToggle, mobileOpen, setFilter, drawerWidth}) {
    const [newItem, setNewItem] = useState('');
    const queryClient = useQueryClient();

    const { data: shoppingLists = [] } = useQuery({
        queryKey: ['shoppingLists'],
        queryFn: async () => {
            const response = await authApi.get('/shopping/list');
            return response.data.data ?? [];
        }
    });

    const handleAddItem = (shoppingListUuid) => {
        if (newItem.trim() === '') return;

        authApi.post('/shopping/list/create', {
            shopping_list_uuid: shoppingListUuid,
            name: newItem,
            quantity: 1,
            priority: 0,
            order: shoppingLists.find(list => list.uuid === shoppingListUuid)?.shopping_list.length + 1 || 1
        })
        .then((response) => {
            queryClient.invalidateQueries(['shoppingLists']);
            setNewItem('');
        })
        .catch((error) => console.error('Error adding item:', error));
    };

    const handleDeleteItem = (shoppingListUuid, itemUuid) => {
        authApi.post('/shopping/list/delete', { id: itemUuid })
            .then(() => {
                queryClient.invalidateQueries(['shoppingLists']);
            })
            .catch((error) => console.error('Error deleting item:', error));
    };

    const moveItem = (shoppingListUuid, index, direction) => {
        queryClient.setQueryData(['shoppingLists'], (oldLists) => {
            return oldLists.map(list => {
                if (list.uuid !== shoppingListUuid) return list;
    
                const updatedItems = [...list.shopping_list];
                const targetIndex = index + direction;
    
                if (targetIndex < 0 || targetIndex >= updatedItems.length) return list;
    
                // Swap items in the array
                [updatedItems[index], updatedItems[targetIndex]] = [updatedItems[targetIndex], updatedItems[index]];
    
                // Assign new order numbers
                updatedItems.forEach((item, i) => (item.order = i + 1));
    
                // Send API request to update only the moved item
                const movedItem = updatedItems[targetIndex];  // The item that moved
    
                authApi.post('/shopping/list/update', {
                    id: movedItem.uuid,
                    name: movedItem.name,
                    quantity: movedItem.quantity,
                    priority: movedItem.priority,
                    order: movedItem.order,
                })
                .catch((error) => console.error('Error updating order:', error));
    
                return { ...list, shopping_list: updatedItems };
            });
        });
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
                
                {shoppingLists.map((list) => (
                    <Box key={list.uuid} sx={{ mb: 4, border: '1px solid #ddd', p: 2, borderRadius: '8px' }}>
                        <Typography variant="h6">{list.name}</Typography>
                        <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
                            <TextField
                                label="New Item"
                                variant="outlined"
                                value={newItem}
                                onChange={(e) => setNewItem(e.target.value)}
                                fullWidth
                            />
                            <Button variant="contained" onClick={() => handleAddItem(list.uuid)}>
                                Add
                            </Button>
                        </Box>

                        <List>
                            {list.shopping_list.map((item, index) => (
                                <ListItem
                                    key={item.uuid}
                                    secondaryAction={
                                        <Box>
                                            <IconButton onClick={() => moveItem(list.uuid, index, -1)}>
                                                <ArrowUpward />
                                            </IconButton>
                                            <IconButton onClick={() => moveItem(list.uuid, index, 1)}>
                                                <ArrowDownward />
                                            </IconButton>
                                            <IconButton onClick={() => handleDeleteItem(list.uuid, item.uuid)}>
                                                <Delete />
                                            </IconButton>
                                        </Box>
                                    }
                                >
                                    <ListItemText primary={item.name} />
                                </ListItem>
                            ))}
                        </List>
                    </Box>
                ))}              
            </Box>
            <Footer />
        </Box>
    );
}

export default ShoppingList;