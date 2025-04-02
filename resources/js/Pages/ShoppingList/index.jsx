import React, { useState, useRef, useEffect } from 'react';
import { Box,Typography, Button, TextField, List, ListItem, IconButton, ListItemText,
    Dialog, DialogTitle, DialogContent, DialogActions, Checkbox, FormControlLabel, MenuItem, Select, Grid
 } from '@mui/material';
import authApi from '../../api/axios';
import { ArrowUpward, ArrowDownward, Delete, AddCircle } from '@mui/icons-material';
import { useQueryClient, useQuery } from '@tanstack/react-query';
import { Close } from "@mui/icons-material";
import { LoadScript, Autocomplete } from "@react-google-maps/api";
import { motion, AnimatePresence } from "framer-motion";

function ShoppingList({ drawerWidth}) {
    const [newItem, setNewItem] = useState('');
    const [selectedItem, setSelectedItem] = useState(null);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [createListDialogOpen, setCreateListDialogOpen] = useState(false);
    const [newListName, setNewListName] = useState('');
    const [editedItem, setEditedItem] = useState({
        ...selectedItem,
        unit: selectedItem?.unit || 'pcs',
    });
    const [nameError, setNameError] = useState(false);
    const [showTopShadow, setShowTopShadow] = useState(false);
    const [showBottomShadow, setShowBottomShadow] = useState(false);
    const contentRef = useRef(null);

    const queryClient = useQueryClient();
    const unitOptions = ['pcs', 'kg', 'g', 'L', 'ml', 'pack', 'box'];

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
            id: shoppingListUuid,
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

    const handleDeleteItem = (itemUuid) => {
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
                    list_id: list.uuid
                })
                .catch((error) => console.error('Error updating order:', error));
    
                return { ...list, shopping_list: updatedItems };
            });
        });
    };

    const handleOpenDialog = (item) => {
        setEditedItem({ ...item });
        setDialogOpen(true);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setEditedItem((prev) => ({
            ...prev,
            [name]: value,
        }));
    
        if (name === "name" && value.trim() !== "") {
            setNameError(false); // Remove error when user types
        }
    };
    
    const handleSaveChanges = () => {
        if (!editedItem.name.trim()) {
            setNameError(true);
            return;
        }
    
        authApi.post('/shopping/list/update', {
            id: editedItem.uuid,
            name: editedItem.name,
            quantity: editedItem.quantity || 1,
            priority: editedItem.priority || 0,
            remarks: editedItem.remarks || '',
            location: editedItem.location || ''
        })
        .then(() => {
            queryClient.invalidateQueries(['shoppingLists']);
            setDialogOpen(false);
        })
        .catch((error) => console.error('Error updating item:', error));
    };


    const handleCreateList = () => {
        if (!newListName.trim()) return;
        
        authApi.post('/shopping/', {
            name: newListName
        })
        .then(() => {
            queryClient.invalidateQueries(['shoppingLists']);
            setCreateListDialogOpen(false);
            setNewListName('');
        })
        .catch((error) => console.error('Error creating list:', error));
    };

     useEffect(() => {
        const handleScroll = () => {
            if (!contentRef.current) return;

            const { scrollTop, scrollHeight, clientHeight } = contentRef.current;
            setShowTopShadow(scrollTop > 0);
            setShowBottomShadow(scrollTop + clientHeight < scrollHeight);
        };

        const contentEl = contentRef.current;
        if (contentEl) {
            contentEl.addEventListener("scroll", handleScroll);
            handleScroll();
        }

        return () => contentEl?.removeEventListener("scroll", handleScroll);
    }, [open]);
    
    return (
        <Box 
            component="main"
            sx={{
            flexGrow: 1,
            p: 3,
            marginLeft: { sm: `${drawerWidth}px` },
            width: { sm: `calc(100% - ${drawerWidth}px)` },
            marginTop: '64px',
        }}>
           
            {/* MAIN CONTENT */}
            <Typography variant="h4">
            Shopping List
            </Typography>
            
            {shoppingLists.length > 0 ? (
                // Display lists if they exist
                shoppingLists.map((list) => (
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
                                    component={motion.div}
                                    layout
                                    button 
                                    onClick={() => handleOpenDialog(item)}
                                    secondaryAction={
                                        <Box>
                                            <IconButton 
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    moveItem(list.uuid, index, -1);
                                                }}
                                            >
                                                <ArrowUpward />
                                            </IconButton>
                                            <IconButton 
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    moveItem(list.uuid, index, 1);
                                                }}
                                            >
                                                <ArrowDownward />
                                            </IconButton>
                                            <IconButton 
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleDeleteItem(item.uuid);
                                                }}
                                            >
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
                ))
            ) : (
                <Box 
                    sx={{ 
                        display: 'flex', 
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        border: '1px solid #000',
                        borderRadius: '8px',
                        p: 5,
                        mt: 3,
                        textAlign: 'center'
                    }}
                >
                    <Typography variant="h6" color="text.secondary" sx={{ mb: 2 }}>
                        No shopping lists yet
                    </Typography>
                    <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                        Create your first shopping list to start organizing your shopping items
                    </Typography>
                    <Button 
                        variant="contained" 
                        // startIcon={<AddCircle />}
                        size="large"
                        onClick={() => setCreateListDialogOpen(true)}
                        sx={{ borderRadius: 2 }}
                    >
                        + Create Shopping List
                    </Button>
                </Box>
            )}

            {/* Dialog for Item Details */}
            <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} fullWidth maxWidth="sm">
                {/* Dialog Header */}
                <DialogTitle 
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        position: "relative",
                        fontWeight: "bold",
                        boxShadow: showTopShadow ? "0px 4px 6px rgba(0, 0, 0, 0.1)" : "none",
                        transition: "box-shadow 0.2s ease-in-out",
                    }}
                >
                    <Typography 
                        variant="h6" 
                            fontWeight="bold" 
                            sx={{ 
                                flexGrow: 1, 
                                textAlign: "center" 
                            }}
                    >
                        Edit Item
                    </Typography>
                    <Button onClick={() => setDialogOpen(false)} sx={{
                        position: "absolute",
                        right: 8,
                        top: "50%",
                        transform: "translateY(-50%)",
                        minWidth: 0,
                    }}>
                        <Close />
                    </Button>
                </DialogTitle>
                <DialogContent ref={contentRef}>
                    {editedItem && (
                        <Box display="flex" flexDirection="column" gap={2} mt={1}>
                            <Grid container spacing={2} alignItems="center">
                                <Grid item xs={8}>
                                    <TextField
                                        label="Name"
                                        name="name"
                                        value={editedItem.name}
                                        onChange={handleInputChange}
                                        error={nameError}
                                        helperText={nameError ? "Name is required" : ""}
                                        fullWidth
                                    />
                                </Grid>

                                {/* Priority Checkbox */}
                                <Grid item xs={4}>
                                    <FormControlLabel
                                        control={
                                            <Checkbox
                                                checked={!!editedItem.priority}
                                                onChange={(e) =>
                                                    setEditedItem((prev) => ({
                                                        ...prev,
                                                        priority: e.target.checked ? 1 : 0,
                                                    }))
                                                }
                                            />
                                        }
                                        label="High Priority"
                                    />
                                </Grid>
                            </Grid>

                            <Grid container spacing={2}>
                                {/* Quantity Input */}
                                <Grid item xs={6}>
                                    <TextField
                                        label="Quantity"
                                        name="quantity"
                                        type="number"
                                        value={editedItem.quantity || ''}
                                        onChange={handleInputChange}
                                        fullWidth
                                    />
                                </Grid>

                                {/* Unit Selection */}
                                <Grid item xs={6}>
                                    <Select
                                        name="unit"
                                        value={editedItem.unit}
                                        onChange={(e) => setEditedItem((prev) => ({
                                            ...prev,
                                            unit: e.target.value,
                                        }))}
                                        fullWidth
                                    >
                                        {unitOptions.map((unit) => (
                                            <MenuItem key={unit} value={unit}>
                                                {unit}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </Grid>
                            </Grid>
                            
                            
                            <TextField
                                label="Remarks"
                                name="remarks"
                                value={editedItem.remarks || ''}
                                onChange={handleInputChange}
                                fullWidth
                            />
                            <Grid item xs={12}>
                                <LoadScript googleMapsApiKey="YOUR_GOOGLE_MAPS_API_KEY">
                                    {/* <Autocomplete
                                        onPlaceChanged={() => {
                                            const place = autocompleteRef.current.getPlace();
                                            setEditedItem((prev) => ({
                                                ...prev,
                                                location: place.formatted_address || '',
                                            }));
                                        }}
                                    >
                                        <TextField
                                            label="Location"
                                            value={editedItem.location || ''}
                                            onChange={handleInputChange}
                                            fullWidth
                                        />
                                    </Autocomplete> */}
                                </LoadScript>
                            </Grid>
                        </Box>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
                    <Button variant="contained" onClick={handleSaveChanges}>Save</Button>
                </DialogActions>
            </Dialog>


            {/* Dialog for Creating New List */}
            <Dialog open={createListDialogOpen} onClose={() => setCreateListDialogOpen(false)} fullWidth maxWidth="sm">
                <DialogTitle>Create New Shopping List</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        label="List Name"
                        fullWidth
                        value={newListName}
                        onChange={(e) => setNewListName(e.target.value)}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setCreateListDialogOpen(false)}>Cancel</Button>
                    <Button variant="contained" onClick={handleCreateList}>Create</Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}

export default ShoppingList;