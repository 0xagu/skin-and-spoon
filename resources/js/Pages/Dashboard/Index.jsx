import React, { useState } from 'react';
import { Box, Typography, TextField, Button, Autocomplete, CircularProgress, InputAdornment, IconButton, Popover } from '@mui/material';
import Sidebar from '../../components/Sidebar.jsx';
import Footer from '../../components/Footer.jsx';
import Header from '../../components/Header.jsx';
import CardByWeek from './Partials/CardByWeek';
import { useQuery } from '@tanstack/react-query';
import api from '../../api/axios';
import ShoppingList from '../ShoppingList';
import Analytic from '../Analytic';
import { useSelector } from 'react-redux';
import AIChat from '../AIChat';
import SearchIcon from '@mui/icons-material/Search';
import dayjs from 'dayjs';
import AddIcon from '@mui/icons-material/Add';
import isoWeek from 'dayjs/plugin/isoWeek';
import weekday from 'dayjs/plugin/weekday';
import AddItemModal from './Partials/AddItemModal.jsx';
import ClearIcon from "@mui/icons-material/Clear";
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';

function Dashboard() {
  const drawerWidth = 90;
  dayjs.extend(isoWeek);
  dayjs.extend(weekday);
  const filter = useSelector((state) => state.filter);

  console.log("filter:",filter);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [open, setOpen] = useState(false);
  const [viewDetailId, setViewDetailId] = useState('');

  const currentYear = dayjs().year();
  const currentWeek = dayjs().isoWeek();

  const [activeYearTab, setActiveYearTab] = useState(currentYear);
  const [activeWeekTab, setActiveWeekTab] = useState(currentWeek);
  
  const [selectedDay, setSelectedDay] = useState(dayjs().format('ddd'));
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedCategoryUUID, setSelectedCategoryUUID] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedDate, setSelectedDate] = useState(dayjs());

  const handleClickDatePopover = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseDatePopover = () => {
    setAnchorEl(null);
  };

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
  
    let messageStart = "You have to finish ";
  
    if (parts.length === 1) {
      return <span>{messageStart}{parts[0]} by today.</span>;
    } else if (parts.length === 2) {
      return <span>{messageStart}{parts[0]} and {parts[1]} by today.</span>;
    } else if (parts.length === 3) {
      return <span>{messageStart}{parts[0]}, {parts[1]} and {parts[2]} by today.</span>;
    } else {
      return (
        <span>
          {messageStart}
          {parts.slice(0, 3).map((part, index) => (
            <span key={index}>
              {index > 0 ? ", " : ""}
              {part}
            </span>
          ))}
          {" and more... by today."}
        </span>
      );
    }
  };

  const handleOpen = (mode = 'add', id = null) => {
    if (mode === 'add') {
      setViewDetailId(null);
    } else if (mode === 'view' && id) {
      setViewDetailId(id);
    }
    setOpen(true);
  };
  
  const handleClose = () => setOpen(false);

  const handleDayClick = (day) => {
    setSelectedDay(day);
  };

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };
  
  if (filter?.filter === "Shopping List") {
    return (
      <ShoppingList 
        handleDrawerToggle={handleDrawerToggle} 
        mobileOpen={mobileOpen} 
        // setFilter={setFilter} 
        drawerWidth={drawerWidth}
      />
    );
  } else if (filter?.filter === "Analytic") {
    return (
      <Analytic
        handleDrawerToggle={handleDrawerToggle} 
        mobileOpen={mobileOpen} 
        // setFilter={setFilter} 
        drawerWidth={drawerWidth}
      />
    )
  } else if (filter?.filter === "AI Chat") {
    return (
      <AIChat
        handleDrawerToggle={handleDrawerToggle} 
        mobileOpen={mobileOpen} 
        drawerWidth={drawerWidth}
      />
    );
  }

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
      <Header handleDrawerToggle={handleDrawerToggle}/>

      {/* MAIN CONTENT */}
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
        <Typography variant="h4">
          DASHBOARD
        </Typography>

        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2, px: 2 }}>
          <Typography variant="h4" sx={{ cursor: 'pointer' }} onClick={() => setActiveWeekTab(activeWeekTab - 1)}>
            &lt; Prev
          </Typography>
          <Typography variant="h4" sx={{ cursor: 'pointer' }} onClick={() => setActiveWeekTab(activeWeekTab + 1)}>
            Next &gt;
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2, width: '100%' }}>
        {daysOfWeek?.map((day, index) => {
          const dayDate = dayjs(startOfWeek).add(index, 'day'); 
          const isSelected = selectedDay === day.day; 
          const isToday = dayDate.isSame(dayjs(), 'day');

            return (
              <Typography
                key={day.date}
                onClick={() => handleDayClick(day.day)}
                sx={{
                  flex: 1,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center', 
                  textAlign: 'center',
                  gap: 1,
                  cursor: 'pointer',
                  p: 1,
                  borderRadius: 2,
                  bgcolor: isSelected ? 'primary.main' : 'transparent',
                  color: isSelected ? 'white' : 'inherit',
                  fontWeight: isSelected ? 'bold' : 'normal',
                  position: 'relative',
                }}
              >
                {isSelected ? `${day.day} ${dayDate.format('DD MMM, YYYY')}` : day.day}

                {/* Custom underline with padding */}
                {isToday && !isSelected && (
                  <Box
                    sx={{
                      position: 'absolute',
                      bottom: -2, // Adjust the distance from text
                      left: 0,
                      right: 0,
                      height: '2px',
                      bgcolor: 'primary.main', // Change the color of the underline as needed
                      mx: 0.5,
                      width: '50%',
                      transform: 'translateX(50%)',
                    }}
                  />
                )}

                {/* Show dot if hasExpiryItem is true */}
                {day.hasExpiryItem && (
                  <span 
                    style={{
                      width: 6, 
                      height: 6, 
                      backgroundColor: 'red', 
                      borderRadius: '50%',
                      display: 'inline-block'
                    }}
                  />
                )}
              </Typography>
            );
          })}

          {/* Search Icon */}
          <Box sx={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
            <IconButton onClick={handleClickDatePopover}>
              <SearchIcon sx={{ cursor: 'pointer' }} />
            </IconButton>
          </Box>
        </Box>

       {/* Popover with Date Picker */}
        {/* Popover with Date Picker */}
      <Popover
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
      >
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DateCalendar
            value={selectedDate}
            onChange={handleDateChange}
            sx={{ p: 2 }} // Add padding for spacing
          />
        </LocalizationProvider>
      </Popover>


        {/* Quick Updates */}
        <Typography variant="body1" sx={{ mt: 2 }}>
          {formatUsedUpMessage(usedUpCounts)}
        </Typography>

        {/* Wrapped both sections inside a single bordered container */}
        <Box sx={{ 
          mt: 3, 
          p: 2, 
          border: '2px solid black', 
          borderRadius: '12px' 
        }}>

          {/* Row for Category Selection, Search Bar, and Add Button */}
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: 2, 
            mb: 2 
          }}>
            {/* Category Selection */}
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
                <TextField
                  {...params}
                  label="Category"
                  variant="outlined"
                  InputProps={{
                    ...params.InputProps,
                    endAdornment: (
                      <>
                        {isLoading ? <CircularProgress color="inherit" size={20} /> : null}
                        {params.InputProps.endAdornment}
                      </>
                    ),
                  }}
                />
              )}
            />

            {/* Search Bar (Takes More Space) */}
            <TextField 
              sx={{ flex: 2, height: '56px' }} // Set height explicitly
              fullWidth 
              placeholder="Search..." 
              variant="outlined" 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                sx: { height: '56px' }, // Ensures input height is consistent
                endAdornment: searchTerm && ( // Show clear button only if there's text
                  <InputAdornment position="end">
                    <IconButton onClick={() => setSearchTerm("")} edge="end">
                      <ClearIcon />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            {/* Add Button (Same Width & Height as Search Bar) */}
            <Button 
              variant="contained" 
              sx={{ flex: 1, minWidth: '150px', height: '56px' }} // Match height
              startIcon={<AddIcon />}
              onClick={() => handleOpen('add')} 
            >
              Add
            </Button>
          </Box>

          {/* Render the content of the active tab */}
          <Box sx={{ mt: 2 }}>
            <CardByWeek
              year={activeYearTab} 
              week={activeWeekTab} 
              day={selectedDay}
              category={selectedCategoryUUID}
              searchTerm={searchTerm}
            />
          </Box>
        </Box>

      </Box>

      <Sidebar mobileOpen={mobileOpen} handleDrawerToggle={handleDrawerToggle} 
      // setFilter={setFilter}
      />
      <Footer />

      <AddItemModal 
        open={open} 
        handleClose={handleClose} 
        data={viewDetailId ? itemDetail : null}
      />
    </Box>
  );
}

export default Dashboard;
