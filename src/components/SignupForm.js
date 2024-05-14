import * as React from "react";

import { useState } from "react";
import { useEffect } from "react";

import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import { LoadingButton } from "@mui/lab";
import SaveIcon from "@mui/icons-material/Save";
import {
  useCheckUsernameMutation,
  useGetCSRFTokenQuery,
  useSignupMutation,
} from "../features/api/apiSlice";
import { Header } from "./Header.jsx";
import SpinnerGIF from "./icons/SpinnerGIF";
import { useNavigate } from "react-router-dom";

const label =
  "I agree to the terms of the QDrive service and acknowledge that I can receive emails on product updates from QDrive.";

const PASSWORD = "password";
const PHONE = "phone";
const USERNAME = "username";
const EMAIL = "email";
const LASTNAME = "lastname";
const FIRSTNAME = "firstname";
const TERMS = "terms";

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const MessageSnackBar = ({ msg, severity, setMessage }) => {
  const [open, setOpen] = useState(true);
  const handleClose = () => {
    setOpen(false);
    setMessage(() => ({ show: false, msg: "", severity: null }));
  };
  console.log({ msg, severity });
  return (
    <Snackbar
      open={open}
      autoHideDuration={6000}
      onClose={handleClose}
      anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
    >
      <Alert onClose={handleClose} severity={severity} sx={{ width: "100%" }}>
        {msg}
      </Alert>
    </Snackbar>
  );
};

const TextField = ({
  label,
  value,
  onChange,
  onBlur,
  name,
  type,
  style,
  error,
  errorText,
}) => {
  return (
    <div className="flex flex-col w-full h-[80px]">
      <label className="text-[#716B61] text-sm w-full text-left font-thin h-[20px]">
        {label}
      </label>
      <input
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        type={type}
        name={name}
        className={`w-full h-[40px] rounded-none border 
                    ${error ? "border-[red]" : "border-[#C9C5BD]"}
                    focus:border-black hover:border-black 
                    outline-[#428BFF] outline-offset-2`}
      />
      {error && (
        <span className="text-left text-[red] font-thin font-sans text-xs w-full h-[20px]">
          {errorText}
        </span>
      )}
    </div>
  );
};

const validateForm = (formInput, setValidForm) => {
  for (const [_, value] of Object.entries(formInput)) {
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
  if (firstname.length === 0) {
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
  if (lastname.length === 0) {
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
  if (password.length === 0) {
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
    if (phone.length === 0) {
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
const validateUsername = async (username, setFormInput) => {
  console.log("inside username");
  if (username.length === 0) {
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

  if (email.length === 0) {
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

  const navigate = useNavigate();

  const [snackBarStatus, setSnackBarStatus] = useState({
    show: false,
    msg: "",
    severity: null,
  });
  const [checkUsername, setCheckUsername] = useState(false);

  const CSRFToken = useGetCSRFTokenQuery();
  const [signupQuery, signupStatus] = useSignupMutation();
  const [checkUsernameQuery, checkUsernameStatus] = useCheckUsernameMutation();

  const handleBlur = (e) => {
    const name = e.target.name;
    let value = e.target.value;
    if (name === TERMS) {
      value = e.target.checked;
    }
    // eslint-disable-next-line default-case
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
    setCheckUsername(false);
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
    if (name === TERMS) {
      validateCheckBox(value, setFormInput);
    }
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setSnackBarStatus(() => ({ show: false, msg: "", severity: null }));
    const { firstname, lastname, password, email, username, phone } = e.target;
    const body = {
      firstname: firstname.value,
      lastname: lastname.value,
      password: password.value,
      email: email.value,
      username: username.value,
      phone: phone.value,
    };

    signupQuery({ body, CSRFToken: CSRFToken.data.CSRFToken });
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
    if (signupStatus.error) {
      if (signupStatus.error?.status === 409) {
        setSnackBarStatus(() => ({
          show: true,
          msg: signupStatus.error.data.msg,
          severity: "warning",
        }));
      } else if (signupStatus.error.originalStatus === 500) {
        setSnackBarStatus(() => ({
          show: true,
          msg: "Something Went Wrong. Please try again",
          severity: "error",
        }));
      }
    }
    if (signupStatus.isSuccess) {
      navigate("/login");
    }
  }, [
    signupStatus.data,
    signupStatus.isError,
    signupStatus.isLoading,
    signupStatus.isError,
    signupStatus.error,
  ]);

  useEffect(() => {
    if (checkUsername && CSRFToken?.data) {
      checkUsernameQuery({
        CSRFToken: CSRFToken.data.CSRFToken,
        value: formInput.username.value,
      });
    }
  }, [CSRFToken.data, checkUsername, formInput.username.value]);

  useEffect(() => {
    if (checkUsernameStatus.isSuccess && checkUsernameStatus.data) {
      if (checkUsernameStatus.data && checkUsernameStatus.data.exist) {
        setFormInput((prev) => ({
          ...prev,
          username: {
            value: formInput.username.value,
            error: true,
            exist: true,
            helperText: `${formInput.username.value} exists!`,
          },
        }));
      } else if (checkUsernameStatus.data && !checkUsernameStatus.data.exist) {
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
    }
  }, [checkUsernameStatus.data, checkUsernameStatus.isSuccess]);

  useEffect(() => {
    validateForm(formInput, setValidForm);
  }, []);

  return (
    <div className="w-screen h-screen flex flex-col justify-start items-center">
      <div className="w-full h-[60px]">
        <Header />
      </div>
      {CSRFToken.isLoading && (
        <div className="flex justify-center items-center">
          <SpinnerGIF style={{ width: 50, height: 50 }} />
        </div>
      )}
      {(CSRFToken.isError || CSRFToken.error) && (
        <div className="flex justify-center items-center">
          <h3 className="font-semibold text-center text-[red] text-lg">
            Something Went Wrong
          </h3>
        </div>
      )}
      {CSRFToken.isSuccess && CSRFToken.data && (
        <div className="flex justify-center items-center grow">
          <form onSubmit={handleSubmit}>
            <div className="w-full sm:w-[400px] h-[406px] flex flex-col p-2 shadow-md">
              <div className="w-full h-[50px] flex justify-center items-center">
                <span className="text-center font-sans font-semibold text-md text-[#716B61]">
                  Join QDrive Today!
                </span>
              </div>
              <div className="flex  justify-start items-center gap-2">
                <TextField
                  label={"First Name"}
                  value={formInput.firstname.value}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  type={"text"}
                  name={"firstname"}
                  error={formInput.firstname.error}
                  errorText={formInput.firstname.helperText}
                />
                <TextField
                  label={"Last Name"}
                  value={formInput.lastname.value}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  type={"text"}
                  name={"lastname"}
                  error={formInput.lastname.error}
                  errorText={formInput.lastname.helperText}
                />
              </div>

              <div className="flex  justify-start items-center gap-2">
                <TextField
                  label={"Email"}
                  value={formInput.email.value}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  type={"email"}
                  name={"email"}
                  error={formInput.email.error}
                  errorText={formInput.email.helperText}
                />
                <TextField
                  label={"Username"}
                  value={formInput.username.value}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  type={"text"}
                  name={"username"}
                  error={formInput.username.error}
                  errorText={formInput.username.helperText}
                />
              </div>
              <div className="flex  justify-start items-center gap-2">
                <TextField
                  label={"Phone"}
                  value={formInput.phone.value}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  type={"tel"}
                  name={"phone"}
                  error={formInput.phone.error}
                  errorText={formInput.phone.helperText}
                />
                <TextField
                  label={"Password"}
                  value={formInput.password.value}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  type={"password"}
                  name={"password"}
                  error={formInput.password.error}
                  errorText={formInput.password.helperText}
                />
              </div>
              <div className="col-span-2 flex justify-start items-center h-[75px] gap-1">
                <input
                  type="checkbox"
                  className="w-[20px] h-[20px] mt-[2px]"
                  name="terms"
                  checked={formInput.terms.value}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />

                <p className="text-justify pl-1 font-sans grow text-wrap text-sm">
                  {label}
                </p>
              </div>
              <div className="col-span-2 flex justify-center items-center  h-[50px] mt-0">
                <LoadingButton
                  disabled={!validForm}
                  variant="contained"
                  fullWidth
                  disableRipple
                  type="submit"
                  loading={signupStatus.isLoading}
                  loadingPosition="start"
                  startIcon={<SaveIcon />}
                  sx={{
                    textTransform: "none",
                    borderRadius: 0,
                    fontWeight: 300,
                    fontSize: 20,
                  }}
                >
                  Agree and sign up
                </LoadingButton>
              </div>
            </div>
          </form>
        </div>
      )}
      {snackBarStatus.show && (
        <MessageSnackBar
          msg={snackBarStatus.msg}
          severity={snackBarStatus.severity}
          setMessage={setSnackBarStatus}
        />
      )}
    </div>
  );
}
