/* global axios */

import * as React from "react";

import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import InputLabel from "@mui/material/InputLabel";
import TextField from "@mui/material/TextField";
import { Button, Checkbox, Typography } from "@mui/material";
import { useState } from "react";
import { useEffect } from "react";
import { styled } from "@mui/material/styles";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { csrftokenURL, validateUsernameURL } from "../config";
import useFetchCSRFToken from "./hooks/FetchCSRFToken";

const formLabelStyle = {
  display: "flex",
  flexDirection: "column",
  alignItems: "flex-start",
};

const label =
  "I agree to the terms of the IDrive service and acknowledge that I can receive emails on product updates from QDrive.";

const PASSWORD = "password";
const PHONE = "phone";
const USERNAME = "username";
const EMAIL = "email";
const LASTNAME = "lastname";
const FIRSTNAME = "firstname";
const TERMS = "terms";

const inputBoxStyle = {
  "& .MuiInputBase-root": {
    borderRadius: "0px",
  },
  "& .MuiFormHelperText-root": {
    marginLeft: 0,
    fontSize: 11,
  },
};

const CustomTextField = styled(TextField)`
  .MuiInputBase-root {
    border-radius: 0px;
  }

  .MuiInputBase-input:focus {
    outline: 3px solid #0061fe !important; /* blue outline on focus */
    border: none !important; /* no border on focus */
  }

  .MuiInputBase-input:hover {
    border: 1px solid black !important; /* black border on hover */
  }
`;

const validateForm = (formInput, setValidForm) => {
  for (const [key, value] of Object.entries(formInput)) {
    if (value.error === true) {
      setValidForm(false);
      return;
    } else if (value.error === undefined) {
      setValidForm(false);
      return;
    } else {
      continue;
    }
  }
  setValidForm(true);
};

const validateFirstName = (firstname, setFormInput) => {
  if (firstname.length == 0) {
    setFormInput((prev) => ({
      ...prev,
      firstname: {
        value: firstname,
        error: true,
        helperText: "Please enter first name",
      },
    }));
  } else {
    setFormInput((prev) => ({
      ...prev,
      firstname: {
        value: firstname,
        error: null,
        helperText: "",
      },
    }));
  }
};

const validateLastName = (lastname, setFormInput) => {
  if (lastname.length == 0) {
    setFormInput((prev) => ({
      ...prev,
      lastname: {
        value: lastname,
        error: true,
        helperText: "Please enter last name",
      },
    }));
  } else {
    setFormInput((prev) => ({
      ...prev,
      lastname: {
        value: lastname,
        error: null,
        helperText: "",
      },
    }));
  }
};

const validatePassword = (password, setFormInput) => {
  if (password.length == 0) {
    setFormInput((prev) => ({
      ...prev,
      password: {
        value: password,
        error: true,
        helperText: "Password enter the password",
      },
    }));
  } else if (password.length < 6) {
    setFormInput((prev) => ({
      ...prev,
      password: {
        value: password,
        error: true,
        helperText: "Password should be more than 6 characters",
      },
    }));
  } else {
    setFormInput((prev) => ({
      ...prev,
      password: {
        value: password,
        error: null,
        helperText: "",
      },
    }));
  }
};

const validatePhone = (phone, setFormInput) => {
  try {
    if (phone.length == 0) {
      setFormInput((prev) => ({
        ...prev,
        phone: {
          value: phone,
          error: true,
          helperText: "Please enter phone number",
        },
      }));
      return;
    }
    const regex = /^[0-9]+$/g;
    if (regex.test(phone)) {
      if (phone.length < 10 || phone.length > 10) {
        setFormInput((prev) => ({
          ...prev,
          phone: {
            value: phone,
            error: true,
            helperText: "Phone number should have 10 digits",
          },
        }));
      } else {
        setFormInput((prev) => ({
          ...prev,
          phone: {
            value: phone,
            error: null,
            helperText: "",
          },
        }));
      }
      return;
    } else {
      setFormInput((prev) => ({
        ...prev,
        phone: {
          value: phone,
          error: true,
          helperText: "Phone number should have only digits",
        },
      }));
    }
  } catch (err) {
    console.error(err);
  }
};
const validateUsername = async (username, setFormInput, CSRFToken) => {
  console.log("inside username");
  if (username.length == 0) {
    setFormInput((prev) => ({
      ...prev,
      username: {
        value: username,
        error: true,
        helperText: "Please enter the username",
      },
    }));
  } else if (username.length < 6) {
    setFormInput((prev) => ({
      ...prev,
      username: {
        value: username,
        error: true,
        helperText: "Username should be 6 or more characters",
      },
    }));
  }
};

const validateCheckBox = (checkbox, setFormInput) => {
  if (checkbox) {
    console.log("selected");
    setFormInput((prev) => ({
      ...prev,
      terms: {
        value: checkbox,
        error: null,
        helperText: "",
      },
    }));
  } else {
    console.log("not selected", checkbox);

    setFormInput((prev) => ({
      ...prev,
      terms: {
        value: checkbox,
        error: true,
        helperText: "Select the Terms",
      },
    }));
  }
};

const validateEmail = (email, setFormInput) => {
  const emailRegex =
    /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/g;

  if (email.length == 0) {
    setFormInput((prev) => ({
      ...prev,
      email: {
        value: email,
        error: true,
        helperText: "Please enter the email",
      },
    }));

    return;
  }
  if (!emailRegex.test(email)) {
    setFormInput((prev) => ({
      ...prev,
      email: {
        value: email,
        error: true,
        helperText: "Please enter valid email",
      },
    }));
  } else {
    setFormInput((prev) => ({
      ...prev,
      email: {
        value: email,
        error: null,
        helperText: "",
      },
    }));
  }
};

export default function Signup() {
  const [validForm, setValidForm] = useState(false);
  const [formInput, setFormInput] = useState({
    email: { value: "", error: undefined, helperText: "" },
    username: { value: "", error: undefined, exist: undefined, helperText: "" },
    firstname: {
      value: "",
      error: undefined,
      helperText: "",
    },
    lastname: { value: "", error: undefined, helperText: "" },
    phone: { value: "", error: undefined, helperText: "" },
    password: { value: "", error: undefined, helperText: "" },
    terms: { value: false, error: undefined, helperText: "" },
  });

  const CSRFToken = useFetchCSRFToken(csrftokenURL);
  const [checkUsername, setCheckUsername] = useState(false);

  const handleBlur = (e) => {
    const name = e.target.name;
    let value = e.target.value;
    if (name === "terms") {
      value = e.target.checked;
    }
    switch (name) {
      case PASSWORD:
        validatePassword(value, setFormInput);
        break;
      case PHONE:
        validatePhone(value, setFormInput);
        break;
      case USERNAME:
        validateUsername(value, setFormInput);
        setCheckUsername(true);
        break;
      case EMAIL:
        validateEmail(value, setFormInput);
        break;
      case FIRSTNAME:
        validateFirstName(value, setFormInput);
        break;
      case LASTNAME:
        validateLastName(value, setFormInput);
        break;
    }
  };

  const handleChange = (e) => {
    const name = e.target.name;
    let value = e.target.value;
    if (name === TERMS) {
      value = e.target.checked;
    }
    setFormInput((prev) => {
      return {
        ...prev,
        [name]: {
          value: value,
          error: prev[name]["error"],
          helperText: prev[name]["helperText"],
        },
      };
    });
    if (name == TERMS) {
      validateCheckBox(value, setFormInput);
    }
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    e.stopPropagation();
    console.log("submitted");
  };

  useEffect(() => {
    validateForm(formInput, setValidForm);
  }, [
    formInput.email.error,
    formInput.password.error,
    formInput.lastname.error,
    formInput.firstname.error,
    formInput.phone.error,
    formInput.username.error,
    formInput.terms.error,
  ]);

  useEffect(() => {
    console.log(validForm);
  }, [validForm]);

  useEffect(() => {
    (async () => {
      let res;
      if (CSRFToken.length > 0 && checkUsername) {
        try {
          const headers = {
            "X-CSRF-Token": CSRFToken,
          };
          res = await axios.get(
            validateUsernameURL + "?username=" + formInput.username.value,
            {
              headers: headers,
            }
          );
        } catch (err) {
          console.log(err);
        }
      }
      console.log(res?.data);
      if (res?.data && res?.data.exist) {
        setFormInput((prev) => ({
          ...prev,
          username: {
            value: formInput.username.value,
            error: true,
            exist: true,
            helperText: `${formInput.username.value} exists!`,
          },
        }));
      } else if (res?.data && !res?.data.exist) {
        setFormInput((prev) => ({
          ...prev,
          username: {
            value: formInput.username.value,
            error: null,
            exist: false,
            helperText: `${formInput.username.value} available!`,
          },
        }));
      }
      setCheckUsername(false);
    })();
  }, [checkUsername]);

  useEffect(() => {
    validateForm(formInput, setValidForm);
  }, []);

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      noValidate
      sx={{
        display: "grid",
        // border: "1px solid black",
        width: 400,
        // height: 400,
        padding: 2,
        gridTemplateColumns: { sm: "1fr 1fr" },
        gap: 2,
        boxSizing: "content-box",
      }}
    >
      <Stack sx={formLabelStyle}>
        <InputLabel>First name</InputLabel>
        <TextField
          name="firstname"
          variant="outlined"
          fullWidth
          value={formInput.firstname.value}
          onChange={handleChange}
          onBlur={handleBlur}
          error={formInput.firstname.error}
          helperText={
            formInput.firstname.error ? formInput.firstname.helperText : ""
          }
          sx={inputBoxStyle}
        ></TextField>
      </Stack>
      <Stack sx={formLabelStyle}>
        <InputLabel>Last name</InputLabel>
        <TextField
          name="lastname"
          variant="outlined"
          fullWidth
          value={formInput.lastname.value}
          onChange={handleChange}
          onBlur={handleBlur}
          error={formInput.lastname.error}
          helperText={
            formInput.lastname.error ? formInput.lastname.helperText : ""
          }
          sx={inputBoxStyle}
        ></TextField>
      </Stack>
      <Stack sx={formLabelStyle}>
        <InputLabel>Email </InputLabel>
        <TextField
          name="email"
          variant="outlined"
          fullWidth
          value={formInput.email.value}
          onChange={handleChange}
          onBlur={handleBlur}
          error={formInput.email.error}
          helperText={formInput.email.error ? formInput.email.helperText : ""}
          sx={inputBoxStyle}
          type={"email"}
        ></TextField>
      </Stack>
      <Stack sx={formLabelStyle}>
        <InputLabel>Username</InputLabel>
        <TextField
          name="username"
          variant="outlined"
          fullWidth
          value={formInput.username.value}
          onChange={handleChange}
          onBlur={handleBlur}
          error={
            formInput.username.error
              ? formInput.username.error
              : formInput.username.exist
          }
          helperText={
            formInput.username.error
              ? formInput.username.helperText
              : formInput.username.exist
              ? formInput.username.helperText
              : ""
          }
          sx={inputBoxStyle}
        ></TextField>
      </Stack>
      <Stack sx={formLabelStyle}>
        <InputLabel>Phone</InputLabel>
        <TextField
          name="phone"
          variant="outlined"
          fullWidth
          value={formInput.phone.value}
          onChange={handleChange}
          onBlur={handleBlur}
          error={formInput.phone.error}
          helperText={formInput.phone.error ? formInput.phone.helperText : ""}
          sx={inputBoxStyle}
          type={"tel"}
        ></TextField>
      </Stack>
      <Stack sx={formLabelStyle}>
        <InputLabel>Password</InputLabel>
        <TextField
          name="password"
          variant="outlined"
          fullWidth
          value={formInput.password.value}
          onChange={handleChange}
          onBlur={handleBlur}
          error={formInput.password.error}
          helperText={
            formInput.password.error ? formInput.password.helperText : ""
          }
          sx={inputBoxStyle}
          type="password"
        ></TextField>
      </Stack>
      <Box
        sx={{
          gridColumn: "span 2",
          display: "flex",
          flexDirection: "row",
          justifyContent: "flex-start",
          alignItems: "center",
          gap: 0,
        }}
      >
        <Checkbox
          name="terms"
          disableRipple
          onChange={handleChange}
          onBlur={handleBlur}
          checked={formInput.terms.value}
          value={"value"}
        />
        <Typography sx={{ textAlign: "left", fontSize: 12 }}>
          {label}
        </Typography>
      </Box>
      <Box sx={{ gridColumn: "span 2" }}>
        <Button
          disabled={!validForm}
          variant="contained"
          fullWidth
          disableRipple
          type="submit"
          sx={{
            textTransform: "none",
            borderRadius: 0,
            fontWeight: 300,
            fontSize: 20,
          }}
        >
          Agree and sign up
        </Button>
      </Box>
    </Box>
  );
}
