import React, { useState, useEffect } from "react";
import { Box, TextField, Button, Typography, Paper, Dialog, DialogTitle, DialogContent, DialogActions } from "@mui/material";
import { useSelector } from "react-redux";
import api from "../../../../api/axios";

function AIChatDialog({ open, onClose, item }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const filter = useSelector((state) => state.filter);

  useEffect(() => {
    if (open && item) {
      const firstMessage = {
        sender: "user",
        text: `Suggest me how to utilize the rest of ${item?.name}.`,
      };
      setMessages([firstMessage]);

      // Send a structured request to backend
      handleSendMessage(null, "first_message"); // Sending first message as null
    }
  }, [open, item]);

  const handleSendMessage = async (userMessage, messageCode = null) => {
    if (!userMessage?.trim() && !messageCode) return;

    const newMessage = { sender: "user", text: userMessage || "Fetching suggestions..." };
    setMessages((prev) => [...prev, newMessage]);
    setInput("");

    try {
      const response = await api.post("/chat/ask", {
        message: userMessage,
        message_code: messageCode,
        item_id: item?.uuid,
      });

      const botMessage = { sender: "bot", text: response.data.message };
      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error("Error fetching AI response:", error);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>AI Chat</DialogTitle>
      <DialogContent>
        <Paper sx={{ height: 400, overflowY: "auto", p: 2, mb: 2 }}>
          {messages.map((msg, index) => (
            <Typography
              key={index}
              align={msg.sender === "user" ? "right" : "left"}
              sx={{
                background: msg.sender === "user" ? "#d1e7dd" : "#f8d7da",
                padding: 1,
                borderRadius: 1,
                marginBottom: 1,
              }}
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
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="secondary">
          Close
        </Button>
        <Button variant="contained" onClick={handleSendMessage}>
          Send
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default AIChatDialog;
