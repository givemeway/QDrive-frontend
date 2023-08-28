import { Stack, TextField, Button, Box } from "@mui/material";
import CircularProgress from "@mui/material/CircularProgress";
import { useState, useEffect } from "react";
import Header from "./HomePageHeader";
const loginURL = "/app/login";
const csrftokenURL = `/app/csrftoken`;

const validateLogin = (loginURL, options, setLogging) => {
  fetch(loginURL, options)
    .then((res) => {
      if (res.status === 401 || res.status === 403) {
        alert("Username or password incorrect!");
        throw Error("Username or password incorrect");
      } else if (res.status === 200) {
        setLogging(false);
        console.log("Login Successful");
      } else if (res.status === 500) {
        alert("Something Went wrong. Try again!");
        throw Error("Something Went wrong. Try again!");
      }
    })
    .catch((err) => {
      console.log(err);
      setLogging(false);
    });
};

async function fetchCSRFToken(loginForm) {
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

const Login = () => {
  const [loginForm, setLoginForm] = useState({ username: "", password: "" });
  const [loginClicked, setLoginClicked] = useState(false);
  const [logging, setLogging] = useState(false);
  const handleChange = (event) => {
    setLoginForm((prev) => {
      return { ...prev, [event.target.name]: event.target.value };
    });
  };
  const handleClick = (e) => {
    setLoginClicked((prev) => !prev);
    setLogging(true);
  };

  useEffect(() => {
    if (loginForm.username.length > 0 && loginForm.password.length > 0) {
      fetchCSRFToken(loginForm)
        .then((options) => {
          validateLogin(loginURL, options, setLogging);
        })
        .catch((err) => console.log(err));
    }
  }, [loginClicked]);
  return (
    <>
      <Header />
      <Box sx={{ width: 300, padding: 3 }}>
        <Stack spacing={2}>
          <TextField
            label="Username / Email"
            name="username"
            type="email"
            variant="outlined"
            value={loginForm.username}
            onChange={handleChange}
            required={true}
          />
          <TextField
            label="Password"
            variant="outlined"
            name="password"
            type="password"
            value={loginForm.password}
            onChange={handleChange}
            required={true}
          />
          {logging ? (
            <Button variant="outlined">
              <CircularProgress sx={{ fontSize: 10 }} />
            </Button>
          ) : (
            <Button variant="contained" onClick={handleClick}>
              Login
            </Button>
          )}
        </Stack>
      </Box>
    </>
  );
};
export default Login;
