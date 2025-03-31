import React, { useState } from 'react';
import { Box, Typography, TextField, Button, Autocomplete, CircularProgress, InputAdornment, IconButton, Popover } from '@mui/material';
import Sidebar from '../../components/Sidebar.jsx';
import Footer from '../../components/Footer.jsx';
import Header from '../../components/Header.jsx';
import CardByWeek from '../Dashboard/Partials/CardByWeek/index.jsx';
import { useQuery } from '@tanstack/react-query';
import api from '../../api/axios';
import { useSelector } from 'react-redux';
import SearchIcon from '@mui/icons-material/Search';
import dayjs from 'dayjs';
import AddIcon from '@mui/icons-material/Add';
import isoWeek from 'dayjs/plugin/isoWeek';
import weekday from 'dayjs/plugin/weekday';
import AddItemModal from '../Dashboard/Partials/AddItemModal.jsx/index.jsx';
import ClearIcon from "@mui/icons-material/Clear";
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';

function ItemByDate({ handleDrawerToggle, mobileOpen, drawerWidth }) {
  dayjs.extend(isoWeek);
  dayjs.extend(weekday);

  const filter = useSelector((state) => state.filter);

  const [open, setOpen] = useState(false);
  const [viewDetailId, setViewDetailId] = useState('');
  const [selectedDay, setSelectedDay] = useState(dayjs().format('ddd'));
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedCategoryUUID, setSelectedCategoryUUID] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const currentYear = dayjs().year();
  const currentWeek = dayjs().isoWeek();
  const [activeYearTab, setActiveYearTab] = useState(currentYear);
  const [activeWeekTab, setActiveWeekTab] = useState(currentWeek);

  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedDate, setSelectedDate] = useState(dayjs());

  const handleClickDatePopover = (event) => setAnchorEl(event.currentTarget);
  const handleCloseDatePopover = () => setAnchorEl(null);
  
  const handleDateChange = (newDate) => {
    if (!newDate) return;
    setSelectedDate(newDate);
    setActiveYearTab(newDate.year());
    setActiveWeekTab(newDate.isoWeek());
    handleCloseDatePopover();
  };

  const { data: usedUpCounts } = useQuery({
    queryKey: ['usedUpItems'],
    queryFn: async () => {
      const response = await api.get('/list/get-used-up-counts-by-today');
      return response.data || [];
    }
  });

  const formatUsedUpMessage = (usedUpCounts) => {
    if (!usedUpCounts || usedUpCounts.length === 0) return "No items finished today.";
  
    const parts = usedUpCounts.map(({ category, count }) => (
      <strong key={category}>{count} {category}</strong>
    ));
  
    return <span>You have to finish {parts.slice(0, 3).join(', ')}{parts.length > 3 ? " and more" : ""} by today.</span>;
  };

  const handleOpen = (mode = 'add', id = null) => {
    setViewDetailId(mode === 'view' && id ? id : null);
    setOpen(true);
  };
  const handleClose = () => setOpen(false);
  const handleDayClick = (day) => setSelectedDay(day);

  const { data: weekData } = useQuery({
    queryKey: ['weekData', activeYearTab, activeWeekTab],
    queryFn: async () => {
      const response = await api.get(`/list/get-week-days-items-info?year=${activeYearTab}&week=${activeWeekTab}`);
      return response.data;
    },
    enabled: !!activeYearTab && !!activeWeekTab,
  });

  const startOfWeek = dayjs(weekData?.startOfWeek || dayjs());
  const daysOfWeek = weekData?.daysOfWeek || [];

  const { data: categories = [], isLoading } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const response = await api.get('/list/get-all-category');
      return response.data || [];
    }
  });

  return (
    <Box sx={{ display: 'flex' }}>
      <Header handleDrawerToggle={handleDrawerToggle} />
      <Box component="main" sx={{ flexGrow: 1, p: 3, marginLeft: `${drawerWidth}px`, width: `calc(100% - ${drawerWidth}px)`, marginTop: '64px' }}>
        <Typography variant="h4">DASHBOARD</Typography>

        <Typography variant="body1" sx={{ mt: 2 }}>
          {formatUsedUpMessage(usedUpCounts)}
        </Typography>

        <Box sx={{ mt: 3, p: 2, border: '2px solid black', borderRadius: '12px' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
            <Autocomplete
              options={categories.map(cat => cat.name)}
              value={selectedCategory}
              onChange={(event, newValue) => {
                setSelectedCategory(newValue || '');
                setSelectedCategoryUUID(categories.find(cat => cat.name === newValue)?.uuid || '');
              }}
              loading={isLoading}
              sx={{ flex: 1, minWidth: '150px', height: '56px' }}
              renderInput={(params) => (
                <TextField {...params} label="Category" variant="outlined" />
              )}
            />
            <TextField
              sx={{ flex: 2, height: '56px' }}
              fullWidth
              placeholder="Search..."
              variant="outlined"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                endAdornment: searchTerm && (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setSearchTerm("")}><ClearIcon /></IconButton>
                  </InputAdornment>
                ),
              }}
            />
            <Button variant="contained" sx={{ flex: 1, minWidth: '150px', height: '56px' }} startIcon={<AddIcon />} onClick={() => handleOpen('add')}>
              Add
            </Button>
          </Box>

          <Box sx={{ mt: 2 }}>
            <CardByWeek year={activeYearTab} week={activeWeekTab} day={selectedDay} category={selectedCategoryUUID} searchTerm={searchTerm} />
          </Box>
        </Box>
      </Box>

      <Sidebar mobileOpen={mobileOpen} handleDrawerToggle={handleDrawerToggle} />
      <Footer />
      <AddItemModal open={open} handleClose={handleClose} data={viewDetailId} />
    </Box>
  );
}

export default ItemByDate;
