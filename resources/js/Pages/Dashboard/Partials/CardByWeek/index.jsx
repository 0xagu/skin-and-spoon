import React, { useState } from 'react';
import { Typography, Box, Grid2, Button } from '@mui/material';
import CardItem from './CardItem.jsx/index.jsx';
import AddItemModal from '../AddItemModal.jsx/index.jsx';
import { useQuery } from '@tanstack/react-query';
import api from '../../../../api/axios';
import { useQueryClient, useMutation } from '@tanstack/react-query';
const CardByWeek = ({ filter, year, week }) => {
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();

  const handleOpen = (mode = 'add', id = null) => {
    if (mode === 'add') {
      setViewDetailId(null);
    } else if (mode === 'view' && id) {
      setViewDetailId(id);
    }
    setOpen(true);
  };
  
  const handleClose = () => setOpen(false);

  const [viewDetailId, setViewDetailId] = useState('');

  const { data: items } = useQuery({
    queryKey: ['items', year, week],
    queryFn: async () => {
      const response = await api.get(`/list/get`,
        {
          params: { year, week }
        }
      );
      const result = response.data;
      return typeof result === 'object' ? result : {};
    }
  });

  const { data: itemDetail } = useQuery({
    queryKey: ['itemDetail', viewDetailId],
    queryFn: async () => {
      const response = await api.post(`/list/detail`, {
        id: viewDetailId
      });
      const result = response.data;
      return typeof result === 'object' ? result : {};
    },
    enabled: !!viewDetailId
  });

  const handleViewDetail = (id) => {
    handleOpen('view', id);
  };

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
  return (
    <Box>
      <Box>
        <Grid2 container spacing={2}>
        {items && items.length > 0 ? (
          items.map((row, index) => (
            <Grid2 item xs={12} sm={4} key={index}>
              <Box sx={{ border: '1px solid #ddd', p: 2 }}>
                <Box 
                  sx={{
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center'
                  }}
                >
                <Typography variant="h6" gutterBottom>{row?.category_name}</Typography>
                <Button 
                  onClick={() => handleOpen('add')} 
                  variant="contained" 
                  sx={{ ml: 2 }}
                >
                  +
                </Button>
              </Box>
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
          <Typography>No data.</Typography>
        )}
        </Grid2>
      </Box>
      <AddItemModal 
        open={open} 
        handleClose={handleClose} 
        data={viewDetailId ? itemDetail : null}
      />
    </Box>
  );
};

export default CardByWeek;
