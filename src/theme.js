import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  typography: {
    fontFamily: "Lato",
  },
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
