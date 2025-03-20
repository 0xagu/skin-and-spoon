import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    primary: {
      main: "#1c252c", // Change this to your preferred primary color (e.g., Orange)
      contrastText: "#fff", // Text color on primary buttons
    },
    secondary: {
      main: "#FB794F", // Optional: Change secondary color (e.g., Green)
    },
    background: {
        default: "#F2F1ED", // Global background color
        paper: "#F2F1ED", // Background color for cards, modals, etc.
    },
  },
});

export default theme;
