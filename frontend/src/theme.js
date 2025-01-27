// src/theme.js

import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    primary: {
      main: "#CC5803", // Primary Color
    },
    secondary: {
      main: "#E2711D", // Secondary Color
    },
    warning: {
      main: "#FF9505", // Warning Color
    },
    success: {
      main: "#FFB627", // Success Color
    },
    info: {
      main: "#FFC971", // Info Color
    },
    background: {
      default: "#ffffff", // Default background color
      paper: "#F5F5F5", // Paper background color
    },
  },
  typography: {
    fontFamily: "'Roboto', 'Helvetica', 'Arial', sans-serif", // Font family
    h1: {
      fontSize: "3rem",
    },
    h2: {
      fontSize: "2.5rem",
    },
    h3: {
      fontSize: "2rem",
    },
    h4: {
      fontSize: "1.75rem",
    },
    h5: {
      fontSize: "1.5rem",
    },
    h6: {
      fontSize: "1.25rem",
    },
  },
});

export default theme;
