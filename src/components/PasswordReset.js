import Header from "./HomePageHeader";
import "./ForgotPassword.css";
import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  useForgotPassMutation,
  usePassResetMutation,
  useVerifyPassTokenMutation,
} from "../features/api/apiSlice";
import SpinnerGIF from "./icons/SpinnerGIF";
import SnackBar from "./Snackbar/SnackBar.js";
import { CrossIcon } from "./icons/crossIcon.js";
import { CorrectIcon } from "./icons/correctIcon.js";

const verifyPassLen = (pass) => {
  if (pass.length >= 8) return true;
  else return false;
};

const verifyNumber = (pass) => {
  const regex = /\d/g;
  return regex.test(pass);
};

const verifyAlpha = (pass) => {
  const regex = /[a-zA-Z]/g;
  return regex.test(pass);
};

const verifySpecial = (pass) => {
  const regex = /[!@#$%&=-_]/g;
  return regex.test(pass);
};

const PassNotificationOne = ({ passNotify }) => {
  if (passNotify.isFormSubmitted && passNotify.isFirstFieldEmpty) {
    return <span className="password-dont-match">Please enter a password</span>;
  }
  if (passNotify.isFormSubmitted && !passNotify.isPasswordValid) {
    return (
      <span className="password-dont-match">
        Please meet all password requirements below
      </span>
    );
  }
  if (passNotify.isFirstFieldEditing) {
    return;
  }
  if (passNotify.isPasswordValid) {
    return;
  }
};

const PassNotificationTwo = ({ passNotify }) => {
  if (
    passNotify.isSecondFieldSubmitted &&
    !passNotify.isFirstFieldEmpty &&
    passNotify.isSecondFieldEmpty
  ) {
    return (
      <span className="password-dont-match">
        Please retype your new password
      </span>
    );
  }
  if (
    passNotify.isSecondFieldSubmitted &&
    passNotify.isFirstFieldEmpty &&
    passNotify.isSecondFieldEmpty
  ) {
    return <span className="password-dont-match">Please enter a password</span>;
  }
  if (passNotify.isSecondFieldEditing && !passNotify.isPasswordMatch) {
    return <span className="password-dont-match">Passwords don‘t match</span>;
  }
  if (passNotify.isSecondFieldEditing && passNotify.isPasswordMatch) {
    return <span className="password-match">Passwords match</span>;
  }
};

const PasswordValidator = ({ isPassFocus, validator }) => {
  return (
    <>
      {isPassFocus && (
        <ul className="password-validator-container">
          <li className={`${validator.isLenValid ? "valid" : ""}`}>
            {validator.isLenValid ? (
              <CorrectIcon style={{ color: "var(--color-green" }} />
            ) : (
              <CrossIcon style={{ color: "var(--color-greyed" }} />
            )}{" "}
            At least 8 characters
          </li>
          <li className={`${validator.isAlpha ? "valid" : ""}`}>
            {validator.isAlpha ? (
              <CorrectIcon style={{ color: "var(--color-green" }} />
            ) : (
              <CrossIcon style={{ color: "var(--color-greyed" }} />
            )}{" "}
            1 letter
          </li>
          <li className={`${validator.isNumber ? "valid" : ""}`}>
            {validator.isNumber ? (
              <CorrectIcon style={{ color: "var(--color-green" }} />
            ) : (
              <CrossIcon style={{ color: "var(--color-greyed" }} />
            )}{" "}
            1 number
          </li>
          <li className={`${validator.isSpecial ? "valid" : ""}`}>
            {validator.isSpecial ? (
              <CorrectIcon style={{ color: "var(--color-green" }} />
            ) : (
              <CrossIcon style={{ color: "var(--color-greyed" }} />
            )}{" "}
            1 special character
          </li>
        </ul>
      )}
    </>
  );
};

export const PasswordReset = () => {
  const [email, setEmail] = useState("");
  const [notify, setNotify] = useState({
    show: false,
    msg: "",
    severity: null,
  });

  const location = useLocation();
  const token = useRef(null);
  const [isPassFocus, setIsPassFocus] = useState(false);
  const [password, setPassword] = useState("");
  const [reTypePassword, setReTypePassword] = useState("");
  const [validator, setValidator] = useState({
    isLenValid: false,
    isAlpha: false,
    isSpecial: false,
    isNumber: false,
  });

  const [isPassLinkValid, setIsPassLinkValid] = useState(false);
  const [passNotify, setPassNotify] = useState({
    isBothFieldsEmpty: true,
    isFormSubmitted: false,
    isFirstFieldSubmitted: false,
    isSecondFieldSubmitted: false,
    isFirstFieldEmpty: true,
    isSecondFieldEmpty: true,
    isFirstFieldEditing: false,
    isSecondFieldEditing: false,
    isPasswordValid: undefined,
    isPasswordMatch: undefined,
  });

  const [passResetQuery, passResetStatus] = useForgotPassMutation();
  const [verifyPassToken, verifyPassTokenStatus] = useVerifyPassTokenMutation();
  const { isLoading, isError, error, isSuccess, data } = passResetStatus;
  const navigate = useNavigate();

  const handlePassChange = (e) => {
    const pass = e.target.value;
    setPassword(e.target.value);
    setPassNotify((prev) => ({
      ...prev,
      isFirstFieldEmpty: false,
      isFirstFieldEditing: true,
      isFirstFieldSubmitted: false,
    }));

    if (pass.length === 0) {
      setPassNotify((prev) => ({
        ...prev,
        isFirstFieldEmpty: true,
      }));
    } else {
      setPassNotify((prev) => ({
        ...prev,
        isFirstFieldEmpty: false,
        isBothFieldsEmpty: false,
      }));
    }
    if (pass.length !== 0 && password.length !== 0 && pass === password) {
      setPassNotify((prev) => ({
        ...prev,
        isFirstFieldEmpty: false,
        isSecondFieldEmpty: false,
        isBothFieldsEmpty: false,
        isPasswordMatch: true,
      }));
    } else {
      setPassNotify((prev) => ({ ...prev, isPasswordMatch: false }));
    }

    setValidator({
      isAlpha: verifyAlpha(pass),
      isLenValid: verifyPassLen(pass),
      isSpecial: verifySpecial(pass),
      isNumber: verifyNumber(pass),
    });
  };
  const handleReTypePassChange = (e) => {
    const pass = e.target.value;
    setReTypePassword(e.target.value);
    setPassNotify((prev) => ({
      ...prev,
      isSecondFieldEmpty: false,
      isSecondFieldEditing: true,
    }));

    if (pass.length === 0) {
      setPassNotify((prev) => ({
        ...prev,
        isSecondFieldEmpty: true,
        isSecondFieldEditing: false,
        isSecondFieldSubmitted: false,
      }));
    } else {
      setPassNotify((prev) => ({
        ...prev,
        isSecondFieldEmpty: false,
        isBothFieldsEmpty: false,
      }));
    }
    if (pass.length !== 0 && password.length !== 0 && pass === password) {
      setPassNotify((prev) => ({
        ...prev,
        isPasswordMatch: true,
        isFirstFieldEmpty: false,
        isBothFieldsEmpty: false,
        isSecondFieldEmpty: false,
      }));
    } else {
      setPassNotify((prev) => ({ ...prev, isPasswordMatch: false }));
    }
  };
  const submitPass = () => {
    setPassNotify((prev) => ({
      ...prev,
      isFormSubmitted: true,
      isSecondFieldSubmitted: true,
    }));

    if (passNotify.isPasswordMatch && passNotify.isPasswordValid) {
      passResetQuery({ token: token.current, password });
    }
  };

  useEffect(() => {
    if (location.search.length > 0) {
      const param = new URLSearchParams(location.search);
      const email = param.get("email");
      if (email) {
        setEmail(email);
      }
    }
  }, [location.search]);

  useEffect(() => {
    if (
      validator.isAlpha &&
      validator.isLenValid &&
      validator.isNumber &&
      validator.isSpecial
    ) {
      setPassNotify((prev) => ({
        ...prev,
        isFirstFieldEmpty: false,
        isPasswordValid: true,
      }));
    } else {
      setPassNotify((prev) => ({ ...prev, isPasswordValid: false }));
    }
  }, [validator]);

  useEffect(() => {
    if (error && error.originalStatus === 500) {
      setNotify({ show: true, msg: "Something Went Wrong", severity: "error" });
    }
    if (error && error.status === 404) {
      setNotify({ show: true, msg: error.data.msg, severity: "error" });
    }
    if (isSuccess && data) {
      setNotify({ show: true, msg: data.msg, severity: "success" });
      navigate("/login");
    }
  }, [isSuccess, isError, error, data, isLoading]);

  useEffect(() => {
    if (location.search.length > 0) {
      const param = new URLSearchParams(location.search);
      token.current = param.get("token");
    }
    if (token.current) {
      console.log(token.current, ": token");
      verifyPassToken({ token: token.current });
    }
  }, []);

  useEffect(() => {
    if (
      verifyPassTokenStatus.error &&
      verifyPassTokenStatus.error.originalStatus === 500
    ) {
      setNotify({ show: true, msg: "Something Went Wrong", severity: "error" });
    }

    if (
      verifyPassTokenStatus.error &&
      verifyPassTokenStatus.error.status === 404
    ) {
      setNotify({
        show: true,
        msg: verifyPassTokenStatus.error?.data?.msg,
        severity: "error",
      });
    }
    if (verifyPassTokenStatus.data && verifyPassTokenStatus.isSuccess) {
      setIsPassLinkValid(true);
      setEmail(verifyPassTokenStatus.data?.user);
    }
  }, [
    verifyPassTokenStatus.error,
    verifyPassTokenStatus.isError,
    verifyPassTokenStatus.isSuccess,
    verifyPassTokenStatus.isLoading,
    verifyPassTokenStatus.data,
  ]);

  console.log(passNotify);

  return (
    <div className="forgot">
      <Header />
      <div className="forgot-container">
        {isPassLinkValid && (
          <div className="forgot-submit-container ">
            <h2 className="title">Forgot your password?</h2>
            <p className="forgot-p">
              Enter a new password for <strong>{email}</strong>
            </p>
            <span>{}</span>
            <div className="forgot-input-container">
              <span className="forgot-label">New Password</span>
              <input
                type="password"
                name="password"
                value={password}
                onChange={handlePassChange}
                className={`forgot-input ${
                  passNotify.isFormSubmitted && !passNotify.isPasswordValid
                    ? "not-valid"
                    : ""
                }`}
                style={{
                  marginBottom: "0.5rem",
                }}
                onFocus={() => {
                  setIsPassFocus(true);
                }}
                onBlur={() =>
                  setPassNotify((prev) => ({
                    ...prev,
                    isFirstFieldEditing: false,
                  }))
                }
              />
              <PassNotificationOne passNotify={passNotify} />
              <PasswordValidator
                isPassFocus={isPassFocus}
                validator={validator}
              />

              <span className="forgot-label">Retype Password</span>
              <input
                type="password"
                name="confirmPassword"
                value={reTypePassword}
                onChange={handleReTypePassChange}
                className={`forgot-input ${
                  !passNotify.isPasswordMatch &&
                  !passNotify.isSecondFieldEmpty &&
                  passNotify.isFormSubmitted
                    ? "not-valid"
                    : ""
                }`}
                onBlur={() =>
                  setPassNotify((prev) => ({
                    ...prev,
                    isSecondFieldEditing: false,
                  }))
                }
              />
              <PassNotificationTwo passNotify={passNotify} />
            </div>
            <button
              className={`forgot-btn ${isLoading ? "loading" : ""}`}
              onClick={submitPass}
              disabled={isLoading ? true : false}
            >
              {isLoading && (
                <div className="gif-container">
                  <SpinnerGIF style={{ width: 30, height: 30 }} />
                </div>
              )}
              {!isLoading && <>Submit</>}
            </button>
          </div>
        )}
        {verifyPassTokenStatus.isError && (
          <div className="error-container">
            <h2 className="error-title">
              {verifyPassTokenStatus.error?.data?.msg}
            </h2>
          </div>
        )}
        {verifyPassTokenStatus.isLoading && (
          <div className="gif-container">
            <SpinnerGIF style={{ width: 50, height: 50 }} />
          </div>
        )}
      </div>
      {notify.show && (
        <SnackBar
          msg={notify.msg}
          severity={notify.severity}
          setMessage={setNotify}
        />
      )}
    </div>
  );
};
