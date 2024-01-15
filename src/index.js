import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { BrowserRouter } from "react-router-dom";
import { SnackbarProvider } from "notistack";
import { ThemeProvider } from "@emotion/react";
import theme from "./theme.js";
import { RecoilRoot } from "recoil";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <RecoilRoot>
    <BrowserRouter>
      <ThemeProvider theme={theme}>
        <SnackbarProvider>
          <App />
        </SnackbarProvider>
      </ThemeProvider>
    </BrowserRouter>
  </RecoilRoot>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
