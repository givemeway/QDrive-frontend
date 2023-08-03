import { Stack, TextField, Button, Box } from "@mui/material";
import { useState, useEffect } from "react";
import Header from "./HomePageHeader";
const loginURL = "https://192.168.29.34:3001/app/login";
const csrftokenURL = `https://192.168.29.34:3001/app/csrftoken`;

const Login = () => {
  const [loginForm, setLoginForm] = useState({ username: "", password: "" });
  const [formSubmitted, setFormSubmitted] = useState(false);
  const handleChange = (event) => {
    setLoginForm((prev) => {
      return { ...prev, [event.target.name]: event.target.value };
    });
  };
  const handleClick = (e) => {
    setFormSubmitted(true);
  };
  const postLogin = (loginURL, options) => {
    fetch(loginURL, options)
      .then((res) => {
        if (res.status == 401 || res.status == 403) {
          alert("Username or password incorrect!");
          throw Error("Username or password incorrect");
        } else if (res.status == 200) {
          return res.json();
        } else if (res.status == 500) {
          alert("Something Went wrong. Try again!");
          throw Error("Something Went wrong. Try again!");
        }
      })
      .then((data) => console.log(data))
      .catch((err) => console.log(err));
  };
  useEffect(() => {
    console.log("here");
    async function fetchData() {
      const encodedData = btoa(`${loginForm.username}:${loginForm.password}`);

      const response = await fetch(csrftokenURL);
      const { CSRFToken } = await response.json();
      const headers = {
        Authorization: `Basic ${encodedData}`,
        "X-CSRF-Token": CSRFToken,
      };

      const options = {
        method: "POST",
        credentials: "include",
        mode: "cors",
        headers: headers,
      };
      return options;
    }
    if (loginForm.username.length > 0 && loginForm.password.length > 0) {
      fetchData().then((options) => {
        console.log(options);
        postLogin(loginURL, options);
      });
    }
  }, [formSubmitted]);
  return (
    <>
      <Header />
      <Box sx={{ width: 300, padding: 3 }}>
        <Stack spacing={2}>
          <TextField
            label="Username / Email"
            name="username"
            variant="outlined"
            value={loginForm.username}
            onChange={handleChange}
          />
          <TextField
            label="Password"
            variant="outlined"
            name="password"
            value={loginForm.password}
            onChange={handleChange}
          />
          <Button variant="contained" onClick={handleClick}>
            Login
          </Button>
        </Stack>
      </Box>
    </>
  );
};
export default Login;
