import React, { useState } from 'react';
import { Box, TextField, Button, Typography, Paper } from '@mui/material';
import { useSelector } from 'react-redux';
import Header from '../../components/Header';
import Sidebar from '../../components/Sidebar';
import Footer from '../../components/Footer';
import api from '../../api/axios';
function AIChat({ handleDrawerToggle, mobileOpen, drawerWidth }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const filter = useSelector((state) => state.filter);

  const handleSendMessage = async () => {
    if (!input.trim()) return;

    const newMessage = { sender: 'user', text: input };
    setMessages((prev) => [...prev, newMessage]);
    setInput('');

    try {
      const response = await api.post('/chat/ask', { message: input });
      const botMessage = { sender: 'bot', text: response.data.message };
      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error('Error fetching AI response:', error);
    }
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <Header handleDrawerToggle={handleDrawerToggle} />
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
        <Typography variant="h5" gutterBottom>
          AI Chat
        </Typography>
        <Paper sx={{ height: 400, overflowY: 'auto', p: 2, mb: 2 }}>
          {messages.map((msg, index) => (
            <Typography
              key={index}
              align={msg.sender === 'user' ? 'right' : 'left'}
              sx={{ background: msg.sender === 'user' ? '#d1e7dd' : '#f8d7da', padding: 1, borderRadius: 1, marginBottom: 1 }}
            >
              {msg.text}
            </Typography>
          ))}
        </Paper>
        <TextField
          fullWidth
          variant="outlined"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your message..."
        />
        <Button sx={{ mt: 2 }} variant="contained" onClick={handleSendMessage}>
          Send
        </Button>
      </Box>
      <Sidebar mobileOpen={mobileOpen} handleDrawerToggle={handleDrawerToggle} />
      <Footer />
    </Box>
  );
}

export default AIChat;