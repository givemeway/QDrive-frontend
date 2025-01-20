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
import { store } from "./app/store.js";
import { Provider } from "react-redux";
import { GoogleOAuthProvider } from "@react-oauth/google";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <Provider store={store}>
    <GoogleOAuthProvider clientId="430330042593-7uvf1muoueu6emfd5jhqvfr5rqi270bm.apps.googleusercontent.com">
      <RecoilRoot>
        <BrowserRouter>
          <ThemeProvider theme={theme}>
            <SnackbarProvider>
              <App />
            </SnackbarProvider>
          </ThemeProvider>
        </BrowserRouter>
      </RecoilRoot>
    </GoogleOAuthProvider>
  </Provider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
