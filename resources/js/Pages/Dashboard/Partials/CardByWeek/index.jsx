import React, { useState } from 'react';
import { Typography, Box, Grid2, IconButton, CircularProgress, Dialog, DialogContent, Menu, MenuItem, DialogTitle,  DialogActions, Button } from '@mui/material';
import CardItem from './CardItem.jsx/index.jsx';
import { useQuery } from '@tanstack/react-query';
import api from '../../../../api/axios';
import { useQueryClient, useMutation } from '@tanstack/react-query';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import NotificationsIcon from '@mui/icons-material/Notifications';
import NotificationsOffIcon from '@mui/icons-material/NotificationsOff';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import placeholder from '../../../../../assets/images/placeholder.jpg';
import PhotoLibraryIcon from '@mui/icons-material/PhotoLibrary';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Mousewheel } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import CloseIcon from '@mui/icons-material/Close';
import { motion } from 'framer-motion';
import AddItemModal from '../AddItemModal.jsx/index.jsx';
import AIChatDialog from '../AIChatDialog.jsx/index.jsx';

const CardByWeek = ({ year, week, day, handleViewDetail, category, searchTerm }) => {
  const queryClient = useQueryClient();
  const [openImgSwiper, setOpenImgSwiper] = useState(false);
  const [quantities, setQuantities] = useState({});
  const [anchorEl, setAnchorEl] = useState(null);
  const [openEditItemModal, setOpenEditItemModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [openDelModal, setOpenDelModal] = useState(false);
  const [isImgLoaded, setIsImgLoaded] = useState(false);
  const [openAIDialog, setOpenAIDialog] = useState(false);

  const handleOpenModal = (item) => {
    setSelectedItem(item);
    setOpenDelModal(true);
  };

  const handleImageLoad = () => {
    setIsImgLoaded(true);
  };

  const { data: items, isLoading } = useQuery({
    queryKey: ['items', year, week, day, category, searchTerm],
    queryFn: async () => {
      const response = await api.get(`/list/get-items-by-day`,
        {
          params: { 
            year, 
            week, 
            day, 
            filter: JSON.stringify({
              category: category || '',
              searchTerm: searchTerm || ''
            })
          },
        }
      );
      return response.data ?? {};
    },
    enabled: !!year && !!week && !!day,
  });

  const mutation = useMutation({
    mutationFn: async (id) => {
        const response = await api.post('/list/update-favourite', { id });
        return response.data;
    },
    onSuccess: () => {
        queryClient.invalidateQueries(['items']);
    },
    onError: (error) => {
        console.error('Error updating item:', error);
    },
  });

  const handleUpdateFavourite = (id) => {
    mutation.mutate(id);
  };

  const mutationNofication = useMutation({
    mutationFn: async (id) => {
        const response = await api.post('/list/update-notification', { id });
        return response.data;
    },
    onSuccess: () => {
        queryClient.invalidateQueries(['items']);
    },
    onError: (error) => {
        console.error('Error updating item:', error);
    },
  });

  const handleUpdateNotification = (id) => {
    mutationNofication.mutate(id);
  };

  const mutationUpdateQuantity = useMutation({
    mutationFn: async (uuid) => {
        const response = await api.post('/list/update-used-quantity', { id: uuid });
        return response.data;
    },
    onSuccess: () => {
        queryClient.invalidateQueries(['items']);
    },
    onError: (error) => {
        console.error('Error updating quantity:', error);
    },
  });

  const handleUseItem = (uuid, currentQuantity) => {
    if (currentQuantity <= 0) return;

    setQuantities((prev) => ({
      ...prev,
      [uuid]: Math.max(0, currentQuantity - 1),
    }));

    mutationUpdateQuantity.mutate(uuid, {
      onError: () => {
        setQuantities((prev) => ({
          ...prev,
          [uuid]: currentQuantity,
        }));
      },
    });
  };

  const mutationAddToShoppingList = useMutation({
    mutationFn: async ({ id, category_id, name, quantity, priority, order }) => {
      const response = await api.post('/shopping/list/update', { 
        id, 
        category_id, 
        name, 
        quantity, 
        priority, 
        order 
      });
      return response.data;
    },
  });
  
  const handleAddToShoppingList = (row) => {
    const { name, quantity } = row;
  
    mutationAddToShoppingList.mutate({
      category_id: row?.item_category?.uuid,
      name,
      quantity
    });
  };

  const MotionCircularProgress = motion(CircularProgress);

  const handleMoreOptions = (event, row) => {
    setAnchorEl(event.currentTarget);
    setSelectedItem(row);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  const handleEditItem = () => {
    setOpenEditItemModal(true);
    handleCloseMenu();
  };

  const handleCloseModal = () => {
    setOpenEditItemModal(false);
    setTimeout(() => {
        setSelectedItem(null);
    }, 200); 
  };

  const DeleteItemModal = ({ selectedItem, open, onClose }) => {
    const queryClient = useQueryClient();
  
    const handleDelete = async () => {
      try {
        await api.post("/list/delete-item", { id: selectedItem?.uuid });
        queryClient.invalidateQueries(["items"]);
        queryClient.invalidateQueries(["weekData"]);
        onClose(); // Close modal after deletion
      } catch (error) {
        console.error("Error deleting item:", error);
      }
    };
  
    return (
      <Dialog open={open} onClose={onClose}>
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>Are you sure you want to delete {selectedItem?.name}</DialogContent>
        <DialogActions>
          <Button onClick={onClose} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleDelete} color="error">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    );
  };

  const handleAISuggest = async (row) => {
    setOpenAIDialog(true);
    setSelectedItem(row);
  };

  return (
    <Box sx={{ width: '100%' }}>
        <Grid2 container spacing={2}>
        {isLoading ? (
          <Box
            sx={{ 
              display: "flex", 
              justifyContent: "center", 
              alignItems: "center", 
              height: "10vh", 
              width: "100%" 
            }}
          >
            <CircularProgress />
          </Box>
          
        ) :items?.items && items?.items?.length > 0 ? (
            items?.items?.map((row, index) => (
              <Grid2 item size={12} key={index}>
                <Box 
                  sx={{ 
                    border: '1px solid #ddd', 
                    p: 2, 
                    display: 'flex', 
                    alignItems: 'stretch', 
                    borderRadius: 2,
                    gap: 2
                  }}
                >
                  {/* Left - Image (Takes full height & remains square) */}
                  <Box 
                    sx={{ 
                      position: 'relative', 
                      aspectRatio: '1 / 1', 
                      minWidth: 130, 
                      maxWidth: 130, 
                      maxHeight: 130,
                      flexShrink: 0, 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center', 
                      overflow: 'hidden',
                      borderRadius: 3,
                      backgroundColor: "#f0f0f0"
                    }}
                  >
                    {/* Main Image */}
                    <img 
                      src={row?.img_preview?.[0]?.temporary_url || placeholder} 
                      alt="Item" 
                      style={{ 
                        width: '100%', 
                        height: '100%', 
                        objectFit: 'cover', 
                        borderRadius: 8 ,
                        top: 0,
                        left: 0,
                        opacity: isImgLoaded ? 1 : 0,
                        transition: 'opacity 0.3s ease-in-out',
                      }} 
                      onLoad={handleImageLoad}
                    />

                    {/* Show Image Icon if More Than One Image */}
                    {row?.img_preview?.length > 1 && (
                      <IconButton 
                        sx={{ 
                          position: 'absolute', 
                          bottom: 5, 
                          right: 5, 
                          background: 'rgba(0,0,0,0.5)', 
                          color: 'white',
                        }} 
                        onClick={() => setOpenImgSwiper(row?.uuid)}
                      >
                        <PhotoLibraryIcon sx={{ fontSize: 16 }}/>
                      </IconButton>
                    )}
                  </Box>

                  {/* Image Viewer Modal */}
                  <Dialog open={openImgSwiper === row?.uuid} onClose={() => setOpenImgSwiper(null)} maxWidth="md" fullWidth>
                    <DialogContent sx={{ position: 'relative', p: 2, display: 'flex', justifyContent: 'center' }}>
                      <IconButton 
                        sx={{ position: 'absolute', top: 10, right: 10, color: 'black', zIndex: 10  }} 
                        onClick={() => {
                          setOpenImgSwiper(null)
                          
                        }}
                      >
                        <CloseIcon />
                      </IconButton>

                      {/* Swiper Slider */}
                      <Swiper 
                        lazy={true}
                        pagination={{
                          type: 'fraction',
                        }}
                        navigation={true}
                        mousewheel={true}
                        modules={[Pagination, Navigation, Mousewheel]}
                        spaceBetween={10} 
                        slidesPerView={1} 
                        loop 
                        style={{
                          '--swiper-navigation-color': '#1c252c',
                          '--swiper-pagination-color': '#1c252c',
                        }}
                      >
                        {row?.img_preview?.map((img, index) => (
                          <SwiperSlide key={index} style={{ display: 'flex', justifyContent: 'center' }}>
                            <img 
                              src={img?.temporary_url} 
                              alt={`Slide ${index}`} 
                              style={{ width: '100%', maxHeight: '70vh', objectFit: 'contain', borderRadius: 8 }}
                            />
                          </SwiperSlide>
                        ))}
                      </Swiper>
                    </DialogContent>
                  </Dialog>

                  {/* Middle - Info */}
                  <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', minHeight: 80 }}>
                    <Typography variant="h6">{row.name}</Typography>
                    
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Typography 
                        variant="body2" 
                        sx={{ 
                          color: row?.freshness >= 0 ? 'text.secondary' : 'red', 
                          fontWeight: row?.freshness < 0 ? 'bold' : 'normal' 
                        }}
                      >
                        {row?.freshness >= 0 
                          ? `Fresh for ${row.freshness} more day(s).` 
                          : 'Expired!'}
                      </Typography>

                      <Typography 
                        variant="body2" 
                        sx={{ 
                          fontStyle: 'italic', 
                          cursor: 'pointer',
                          color: 'text.secondary',
                          '&:hover': { color: 'primary.main' } 
                        }}
                        onClick={() => handleAISuggest(row)}
                      >
                        AI Suggest?
                      </Typography>
                    </Box>

                    <AIChatDialog open={openAIDialog} onClose={() => setOpenAIDialog(false)} item={selectedItem}/>

                    {/* Buttons */}
                    <Box sx={{ display: 'flex', gap: 1, mt: 1, alignItems: 'center' }}>
                      {/* Category Name with Black Background */}
                      <Box sx={{ 
                        bgcolor: 'black', 
                        color: 'white', 
                        borderRadius: 25, 
                        px: 2, 
                        py: 0.5, 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center',
                      }}>
                        <Typography variant="body2">
                          {row?.item_category?.name}
                        </Typography>
                      </Box>

                      <Typography 
                        variant="body2" 
                        sx={{ 
                          cursor: "pointer", 
                          borderRadius: "20px", 
                          px: 1.5, 
                          py: 0.5, 
                          transition: "background-color 0.2s ease-in-out",
                          "&:hover": { backgroundColor: "rgba(76, 175, 80, 0.2)" } // Light green hover
                        }}
                        onClick={() => handleAddToShoppingList(row)}
                      >
                        + Add to shopping list
                      </Typography>
                      {/* Icons */}
                      <IconButton onClick={() => handleUpdateFavourite(row?.uuid)} size="small">
                        {row.priority === 1 ? (
                          <FavoriteIcon sx={{ color: 'red' }} fontSize="small" />
                        ) : (
                          <FavoriteBorderIcon fontSize="small" />
                        )}
                      </IconButton>

                      <IconButton onClick={() => handleUpdateNotification(row?.uuid)} size="small">
                        {row.notification === 1 ? (
                          <NotificationsIcon sx={{ color: "orange" }} fontSize="small" />
                        ) : (
                          <NotificationsOffIcon color="default" fontSize="small" />
                        )}
                      </IconButton>
                      <IconButton onClick={(event) => handleMoreOptions(event, row)} size="small">
                        <MoreVertIcon fontSize="small" />
                      </IconButton>
                      {/* Dropdown Menu */}
                      <Menu anchorEl={anchorEl} 
                        open={Boolean(anchorEl)} 
                        onClose={handleCloseMenu}
                      >
                        <MenuItem onClick={handleEditItem} >Edit</MenuItem>
                        <MenuItem onClick={() => handleOpenModal(row)}>Delete</MenuItem>
                      </Menu>

                      <AddItemModal 
                        open={openEditItemModal} 
                        handleClose={handleCloseModal} 
                        data={selectedItem} 
                      />
                    </Box>
                  </Box>

                  <Box 
                    sx={{ 
                      textAlign: 'center', 
                      display: 'flex', 
                      flexDirection: 'column', 
                      justifyContent: 'center', 
                      alignItems: 'center',
                      gap: 2
                    }}
                  >
                    <Box 
                        sx={{ 
                          position: "relative", 
                          display: "inline-flex", 
                          cursor: "pointer",
                          borderRadius: "50%", 
                          padding: 2,
                          transition: "background-color 0.2s ease-in-out",
                          "&:hover": { 
                              backgroundColor: "rgba(0, 0, 0, 0.04)",
                              
                          }
                        }}
                        onClick={() => handleUseItem(row?.uuid, row.left_over_quantity)}
                    >
                      {/* Background Progress (Gray) */}
                      <CircularProgress
                        variant="determinate"
                        value={100}
                        size={60}
                        thickness={5}
                        sx={{ color: "#e0e0e0", position: "absolute" }}
                      />

                      {/* Foreground Progress (Green) with Animation */}
                      <MotionCircularProgress
                        variant="determinate"
                        value={(quantities[row?.uuid] ?? row.left_over_quantity) / row.quantity * 100}
                        size={60}
                        thickness={5}
                        sx={{ color: "#4caf50"  }}
                        whileTap={{ scale: 0.9 }}
                        whileHover={{ scale: 1.1, backgroundColor: "rgba(76, 175, 80, 0.2)" }}
                        transition={{ duration: 0.2 }}
                      />

                      {/* Centered Leftover Quantity */}
                      <Box
                        sx={{
                          position: "absolute",
                          top: 0,
                          left: 0,
                          width: "100%",
                          height: "100%",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center"
                        }}
                      >
                        <Typography variant="body2" sx={{ fontWeight: "bold" }}>
                          {quantities[row?.uuid] ?? row.left_over_quantity}
                        </Typography>
                      </Box>
                    </Box>

                    {/* Unit Below */}
                    <Typography variant="body2" color="textSecondary">{row.unit} left</Typography>
                  </Box>

                  {/* detail card */}
                  <Grid2 container direction="column" spacing={2}>
                    {row?.items?.map((item, index) => (
                      <Grid2 item xs={12} sm={4} key={index}>
                        <CardItem category={item} handleViewDetail={handleViewDetail} handleUpdateFavourite={handleUpdateFavourite} />
                      </Grid2>
                    ))}
                  </Grid2>
                </Box>
              </Grid2>
          ))
          ) : (
            <Box
              sx={{ 
                display: "flex", 
                justifyContent: "center", 
                alignItems: "center", 
                height: "10vh", 
                width: "100%" 
              }}
            >
              <Typography>No data.</Typography>
            </Box>
          )}
        </Grid2>

        <DeleteItemModal selectedItem={selectedItem} open={openDelModal} onClose={() => setOpenDelModal(false)} />
    </Box>
  );
};

export default CardByWeek;
