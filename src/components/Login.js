import { Stack, TextField, Button, Box } from "@mui/material";
import CircularProgress from "@mui/material/CircularProgress";
import { useState, useEffect } from "react";
import Header from "./HomePageHeader";
import * as React from "react";
import useValidateLogin from "./hooks/LoginHook";
import { useNavigate } from "react-router-dom";
import MessageSnackBar from "./Snackbar/SnackBar";

const Login = () => {
  const [loginForm, setLoginForm] = useState({ username: "", password: "" });
  const [logging, status, initLogin] = useValidateLogin(loginForm);
  const [warning, setWarning] = useState(false);
  const [error, setError] = useState(false);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleChange = (event) => {
    setLoginForm((prev) => {
      return { ...prev, [event.target.name]: event.target.value };
    });
  };
  const handleClick = (e) => {
    initLogin();
  };

  useEffect(() => {
    if (status === 200) {
      navigate("/dashboard/home");
    } else if (status === 401 || status === 403) {
      setWarning(true);
    } else if (status === 500) {
      setError(true);
    }
  }, [logging, status]);
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
          {warning && (
            <MessageSnackBar
              severity={"warning"}
              msg={"Username or password incorrect!"}
              setMessage={setWarning}
            />
          )}
          {success && (
            <MessageSnackBar
              severity={"success"}
              msg={"Login Successful!"}
              setMessage={setSuccess}
            />
          )}
          {error && (
            <MessageSnackBar
              severity={"error"}
              msg={"Something Went wrong. Try again!"}
              setMessage={setError}
            />
          )}
        </Stack>
      </Box>
    </>
  );
};
export default Login;
