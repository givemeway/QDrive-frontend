import "./PasswordValidator.css";
import "./ForgotPassword.css";
import { CorrectIcon } from "./icons/correctIcon.js";
import { CrossIcon } from "./icons/crossIcon.js";
import { useState } from "react";
import { EyeIcon } from "./icons/Eye.js";
import { EyeCrossIcon } from "./icons/EyeCross.js";

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

const PassErrorNotification = ({ passNotify }) => {
  const { isFirstFieldEmpty, isFormSubmitted, isPasswordValid } = passNotify;
  if (isFormSubmitted && isFirstFieldEmpty) {
    return <span className="password-dont-match">Please enter a password</span>;
  }

  if (isFormSubmitted && !isPasswordValid) {
    return (
      <span className="password-dont-match">
        Please meet all password requirements below
      </span>
    );
  }

  if (isPasswordValid) {
    return;
  }
};

const PassValidNotification = ({ isPassFocus, validator }) => {
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

export const PasswordValidator = ({ setFormInput }) => {
  const [password, setPassword] = useState("");
  const [isFocus, setIsFocus] = useState(false);
  const [validator, setValidator] = useState({
    isLenValid: false,
    isAlpha: false,
    isSpecial: false,
    isNumber: false,
  });
  const [passNotify, setPassNotify] = useState({
    isFormSubmitted: false,
    isFirstFieldEmpty: true,
    isPasswordValid: undefined,
  });

  const [showPass, setShowPass] = useState(false);

  const handleChange = (e) => {
    const pass = e.currentTarget.value;
    setPassword(pass);
    setValidator({
      isAlpha: verifyAlpha(pass),
      isLenValid: verifyPassLen(pass),
      isSpecial: verifySpecial(pass),
      isNumber: verifyNumber(pass),
    });
    setPassNotify((prev) => ({ ...prev, isFormSubmitted: false }));
    if (pass.length === 0) {
      setPassNotify((prev) => ({ ...prev, isFirstFieldEmpty: true }));
    }
    if (pass.length > 0) {
      setPassNotify((prev) => ({ ...prev, isFirstFieldEmpty: false }));
    }
    if (
      verifyAlpha(pass) &&
      verifyNumber(pass) &&
      verifySpecial(pass) &&
      verifyPassLen(pass)
    ) {
      setPassNotify((prev) => ({ ...prev, isPasswordValid: true }));
    } else {
      setPassNotify((prev) => ({ ...prev, isPasswordValid: false }));
    }
  };
  const handleFocus = () => {
    setIsFocus(true);
  };

  const handleBlur = () => {
    setPassNotify((prev) => ({
      ...prev,
      isFormSubmitted: true,
      isEditing: false,
    }));
    setFormInput((prev) => ({
      ...prev,
      password: { value: password, error: !passNotify.isPasswordValid },
    }));
  };

  const showPassword = () => {
    setShowPass((prev) => !prev);
  };
  return (
    <div className="password-container">
      <div className="w-full flex justify-start items-center flex-row relative">
        <input
          type={`${!showPass ? "password" : "text"}`}
          onChange={handleChange}
          value={password}
          className="password-input"
          onFocus={handleFocus}
          onBlur={handleBlur}
          name="password"
        />
        {!showPass && (
          <EyeIcon
            style={{
              style: {
                position: "absolute",
                right: "10px",
                cursor: "pointer",
              },
            }}
            onClick={showPassword}
          />
        )}
        {showPass && (
          <EyeCrossIcon
            style={{
              style: { position: "absolute", right: "10px", cursor: "pointer" },
            }}
            onClick={showPassword}
          />
        )}
      </div>
      <PassErrorNotification passNotify={passNotify} />
      <PassValidNotification isPassFocus={isFocus} validator={validator} />
    </div>
  );
};
