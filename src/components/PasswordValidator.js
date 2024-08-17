import "./PasswordValidator.css";
import "./ForgotPassword.css";
import { CorrectIcon } from "./icons/correctIcon.js";
import { CrossIcon } from "./icons/crossIcon.js";
import { useEffect, useState } from "react";
import { PasswordFieldWithMask } from "./PasswordFieldWithMask.js";

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

  useEffect(() => {
    setPassNotify((prev) => ({ ...prev, isPasswordValid: true }));
  }, []);

  return (
    <div className="password-container">
      <PasswordFieldWithMask
        onChange={handleChange}
        onBlur={handleBlur}
        onFocus={handleFocus}
        value={password}
        className={`${!passNotify.isPasswordValid ? "error" : ""}`}
      />
      <PassErrorNotification passNotify={passNotify} />
      <PassValidNotification isPassFocus={isFocus} validator={validator} />
    </div>
  );
};
