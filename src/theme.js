import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  typography: {
    fontFamily: "Lato",
  },
  // components: {
  //   MuiOutlinedInput: {
  //     styleOverrides: {
  //       root: {
  //         "& .Mui-focused .MuiOutlinedInput-notchedOutline": {
  //           border: "none", // remove the border on focus
  //         },
  //       },
  //     },
  //   },
  // },
  palette: {
    primary: {
      light: "#5396CE",
      main: "#0071BC",
      dark: "#005F9F",
      contrastText: "#FFFFFF",
    },
  },
});

export default theme;
