import { createTheme } from "@mui/material/styles";

export const appTheme = createTheme({
  palette: {
    mode: "dark",
    background: {
      default: "hsl(222.2, 84%, 4.9%)",
      paper: "hsl(222.2, 84%, 4.9%)",
    },
    text: {
      primary: "hsl(210, 40%, 98%)",
      secondary: "hsl(215, 20.2%, 65.1%)",
    },
    primary: {
      main: "hsl(217.2, 91.2%, 59.8%)",
      contrastText: "hsl(222.2, 47.4%, 11.2%)",
    },
    secondary: {
      main: "hsl(0, 62.8%, 30.6%)",
      contrastText: "hsl(210, 40%, 98%)",
    },
    error: {
      main: "hsl(0, 62.8%, 30.6%)",
      contrastText: "hsl(210, 40%, 98%)",
    },
    divider: "hsl(217.2, 32.6%, 17.5%)",
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: "0.5rem",
          textTransform: "none",
          padding: "8px 24px",
          "&.Mui-disabled": {
            backgroundColor: "hsl(217.2, 32.6%, 17.5%)",
            color: "hsl(215, 20.2%, 65.1%)",
          },
          "&:hover": {
            backgroundColor: "hsl(217.2, 91.2%, 40%)",
          },
          "&.MuiButton-active": {
            backgroundColor: "hsl(217.2, 91.2%, 35%)",
            boxShadow: "0 0 0 2px hsl(224.3, 76.3%, 48%)",
            transform: "scale(0.98)",
          },
        },
      },
    },

    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: "0.5rem",
          backgroundColor: "hsl(222.2, 84%, 4.9%)",
          color: "hsl(210, 40%, 98%)",
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          "& .MuiOutlinedInput-notchedOutline": {
            borderColor: "hsl(217.2, 32.6%, 17.5%)",
          },
          "&:hover .MuiOutlinedInput-notchedOutline": {
            borderColor: "hsl(217.2, 32.6%, 17.5%)",
          },
          "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
            borderColor: "hsl(224.3, 76.3%, 48%)",
          },
        },
        input: {
          color: "hsl(210, 40%, 98%)",
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          padding: "6px 10px",
        },
      },
    },
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          "&::-webkit-scrollbar": {
            width: "4px",
            height: "4px",
          },
          "&::-webkit-scrollbar-thumb": {
            backgroundColor: "hsl(0, 62.8%, 30.6%)",
            borderRadius: "10px",
            border: "3px solid hsl(222.2, 84%, 4.9%)",
          },
          "&::-webkit-scrollbar-track": {
            backgroundColor: "hsl(0, 62.8%, 30.6%)",
            borderRadius: "10px",
          },
        },
      },
    },
  },
});
