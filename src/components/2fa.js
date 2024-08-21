import { useEffect, useState, useRef } from "react";
import "./2fa.css";
import useOutSideClick from "./hooks/useOutsideClick";
import CloseIcon from "@mui/icons-material/Close";
import {
  useConfirmPasswordMutation,
  useEnableOTPMutation,
  useVerifyOTPMutation,
} from "../features/api/apiSlice";
import SpinnerGIF from "./icons/SpinnerGIF";
import { PasswordFieldWithMask } from "./PasswordFieldWithMask";
import { Link } from "react-router-dom";
import { Image } from "./Image";

const TwoFA_Step_One = ({ onClose, setNext }) => {
  const handleClick = () => {
    setNext((prev) => enableActiveWindow(prev, "step_2_active"));
  };
  return (
    <div className="step-one">
      <h2 className="step-one-title">Enable two-step verification</h2>
      <CloseIcon className="step-one-close" onClick={onClose} />
      <p className="step-one-p">
        Two-step verification adds an extra layer of protection to your account.
        Whenever you sign in to the QDrive website or link a new device, you’ll
        need to enter both your password and also a security code sent to your
        mobile phone.
      </p>
      <button className="step-one-button" onClick={handleClick}>
        Get Started
      </button>
    </div>
  );
};

const enableActiveWindow = (obj, key) => {
  return Object.fromEntries(
    Object.entries(obj).map(([k, v]) => {
      if (k === key) {
        return [k, true];
      } else {
        return [k, false];
      }
    })
  );
};

const TwoFA_Step_Four = ({ onClose, url, setNext }) => {
  const handleClick = () => {
    setNext((prev) => enableActiveWindow(prev, "step_5_active"));
  };

  const handleBack = () => {
    setNext((prev) => enableActiveWindow(prev, "step_3_active"));
  };
  return (
    <div className="step-one">
      <h2 className="step-one-title">Enable two-step verification</h2>
      <CloseIcon className="step-one-close" onClick={onClose} />
      <p className="step-one-p" style={{ marginBottom: "1rem" }}>
        An authenticator app lets you generate security codes on your phone
        without needing to receive text messages.
      </p>
      <h2 className="step-one-p">To configure your authenticator app:</h2>
      <ul className="step-four-ul">
        <li className="step-four-li">Add a new time-based token.</li>
        <li className="step-four-li">Use your app to scan the barcode below</li>
      </ul>
      <img src={url} style={{ height: 150, width: 150 }} />
      <div className="step-four-button-container">
        <button className="step-4-back-button" onClick={handleBack}>
          Back
        </button>
        <button
          className="step-one-button"
          onClick={handleClick}
          style={{ position: "static" }}
        >
          Next
        </button>
      </div>
    </div>
  );
};

const TwoFA_Step_Five = ({ onClose, setNext, mode }) => {
  const [value, setValue] = useState("");
  const [query, queryStatus] = useVerifyOTPMutation();
  const { error, isError, isSuccess, isLoading, data, status } = queryStatus;
  const handleChange = (e) => {
    setValue(e.currentTarget.value);
  };
  const handleClick = () => {
    // setNext((prev) => enableActiveWindow(prev, "step_6_active"));
    if (mode.totp) {
      query({ token: value, mfa: "totp", is2FAConfig: true });
    } else if (mode.email) {
      query({ token: value, mfa: "email", is2FAConfig: true });
    }
  };

  const handleBack = () => {
    setNext((prev) => enableActiveWindow(prev, "step_4_active"));
  };

  useEffect(() => {
    if (isSuccess && !isError && data) {
      setNext((prev) => enableActiveWindow(prev, "step_6_active"));
    }
  }, [isError, isSuccess, data, error, isLoading]);

  return (
    <div className="step-one">
      <h2 className="step-one-title">Enable two-step verification</h2>
      <CloseIcon className="step-one-close" onClick={onClose} />
      <p className="step-one-p" style={{ marginBottom: "1rem" }}>
        Enter the security code generated by your mobile authenticator app to
        make sure it’s configured correctly.
      </p>
      <h2 className="step-one-p" style={{ marginBottom: "1rem" }}>
        To configure your authenticator app:
      </h2>
      <div className="step-6-input-container">
        <input
          placeholder="6-digit code"
          className="step-6-input"
          name="sixdigits"
          value={value}
          onChange={handleChange}
        />
      </div>
      {error && isError && (
        <span className="step-five-error"> Invalid Code</span>
      )}
      <div className="step-four-button-container">
        <button className="step-4-back-button" onClick={handleBack}>
          Back
        </button>
        <button
          className="step-one-button"
          onClick={handleClick}
          style={{ position: "static" }}
        >
          {!isLoading && <>Next</>}
          {isLoading && <SpinnerGIF style={{ width: 20, height: 20 }} />}
        </button>
      </div>
    </div>
  );
};

const TwoFA_Step_Three = ({ onClose, setNext, setURL, setMode }) => {
  const [checked, setChecked] = useState({
    email: true,
    totp: false,
  });

  const [query, queryStatus] = useEnableOTPMutation();
  const { error, isError, isSuccess, isLoading, data, status } = queryStatus;

  const handleChange = (e) => {
    if (e.currentTarget.name === "totp" && e.currentTarget.checked) {
      setMode({ email: false, totp: true });

      setChecked({ email: false, totp: true });
    }
    if (e.currentTarget.name === "email" && !e.currentTarget.checked) {
      setMode({ email: false, totp: true });

      setChecked({ email: false, totp: true });
    }
    if (e.currentTarget.name === "email" && e.currentTarget.checked) {
      setMode({ email: true, totp: false });

      setChecked({ email: true, totp: false });
    }
    if (e.currentTarget.name === "email" && !e.currentTarget.checked) {
      setMode({ email: true, totp: false });

      setChecked({ email: true, totp: false });
    }
  };
  const handleClick = () => {
    query({ totp: checked.totp, sms: false, email: checked.email });
  };

  useEffect(() => {
    if (isSuccess && !isError && data) {
      setURL(data.authURL);
      if (checked.totp) {
        setNext((prev) => enableActiveWindow(prev, "step_4_active"));
      } else {
        setNext((prev) => enableActiveWindow(prev, "step_5_active"));
      }
    }
  }, [isSuccess, data, isError, error]);

  return (
    <div className="step-one">
      <h2 className="step-one-title">Enable two-step verification</h2>
      <CloseIcon className="step-one-close" onClick={onClose} />
      <p className="step-one-p" style={{ fontWeight: 600 }}>
        How would you like to receive your security codes?
      </p>
      <div className="step-three-radio-container">
        <div
          className={`step-three-radio ${
            checked.email ? "step-three-radio-active" : ""
          }`}
        >
          <div className="step-three-radio-input">
            <input
              type="radio"
              checked={checked.email}
              onChange={handleChange}
              name="email"
              style={{ cursor: "pointer" }}
            />
          </div>
          <div className="step-three-radio-label-container">
            <label className="step-three-radio-label">Use email messages</label>
            <label className="step-three-radio-text">
              Security Codes will be sent to your email
            </label>
          </div>
        </div>
        <div
          className={`step-three-radio ${
            checked.totp ? "step-three-radio-active" : ""
          }`}
        >
          <div className="step-three-radio-input">
            <input
              type="radio"
              checked={checked.totp}
              onChange={handleChange}
              name="totp"
              style={{ cursor: "pointer" }}
            />
          </div>
          <div className="step-three-radio-label-container">
            <label className="step-three-radio-label">Use a mobile app</label>
            <label className="step-three-radio-text">
              Security Codes will be generated by an authenticator app.
            </label>
          </div>
        </div>
      </div>
      {isError && error && <>Error: Something Went Wrong {error.data}</>}
      <button className="step-one-button" onClick={handleClick}>
        {!isLoading && <>Next</>}
        {isLoading && <SpinnerGIF style={{ width: 20, height: 20 }} />}
      </button>
    </div>
  );
};

const TwoFA_Step_Two = ({ onClose, email, setNext }) => {
  const [query, queryStatus] = useConfirmPasswordMutation();
  const { error, isError, isSuccess, isLoading, data } = queryStatus;
  const [password, setPassword] = useState("");
  const handleConfirmPassword = () => {
    if (password.length > 0) {
      query({ password });
    }
  };
  const handleInput = (e) => {
    setPassword(e.target.value);
  };

  useEffect(() => {
    if (isSuccess && !isError) {
      setNext((prev) => enableActiveWindow(prev, "step_3_active"));
    }
  }, [isSuccess]);

  return (
    <div className="step-one">
      <h2 className="step-one-title">Enter password to continue</h2>
      <CloseIcon className="step-one-close" onClick={onClose} />
      <p className="step-one-p">
        For security, please enter your password for {email}.
      </p>
      {error && isError && (
        <span className="step-two-error"> Invalid Password</span>
      )}
      <PasswordFieldWithMask
        placeholder="Password"
        name="password"
        type="password"
        className="step-two-input"
        value={password}
        onChange={handleInput}
      />
      <Link
        to={"/forgot"}
        className="step-two-forgotpassword"
        target="_blank"
        rel="noopener noreferrer"
      >
        <span>Forgot your password?</span>
      </Link>
      <button className="step-one-button" onClick={handleConfirmPassword}>
        {!isLoading && <>Next</>}
        {isLoading && <SpinnerGIF style={{ width: 20, height: 20 }} />}
      </button>
    </div>
  );
};

const TwoFA_Step_Six = ({ onClose, setNext }) => {
  return (
    <div className="step-one">
      <h2 className="step-one-title">Enable two-step verification</h2>
      <CloseIcon className="step-one-close" onClick={onClose} />
      <p className="step-one-p">
        From now on, when you sign in to the Qdrive website or link a new
        device, you’ll need to enter a security code from your phone.
      </p>
      <button className="step-one-button" onClick={onClose}>
        Next
      </button>
    </div>
  );
};

export const TwoFA = ({ onClose }) => {
  const ref = useRef(null);
  const [url, setURL] = useState("");
  const [next, setNext] = useState({
    step_1_active: true,
    step_2_active: false,
    step_3_active: false,
    step_4_active: false,
    step_5_active: false,
    step_6_active: false,
  });

  const [mode, setMode] = useState({ email: true, totp: false });

  useOutSideClick(ref, onClose);

  return (
    <div className="modal">
      <div
        className={`twofa-box`}
        ref={ref}
        style={{ height: `${next.step_4_active ? "auto" : ""}` }}
      >
        {next.step_1_active && (
          <TwoFA_Step_One onClose={onClose} setNext={setNext} />
        )}
        {next.step_2_active && (
          <TwoFA_Step_Two
            onClose={onClose}
            email={"sand.kumar.gr@gmail.com"}
            setNext={setNext}
          />
        )}
        {next.step_3_active && (
          <TwoFA_Step_Three
            onClose={onClose}
            setNext={setNext}
            setURL={setURL}
            setMode={setMode}
          />
        )}
        {next.step_4_active && mode.totp && (
          <TwoFA_Step_Four onClose={onClose} setNext={setNext} url={url} />
        )}
        {next.step_5_active && (mode.email || mode.totp) && (
          <TwoFA_Step_Five onClose={onClose} setNext={setNext} mode={mode} />
        )}
        {next.step_6_active && (mode.email || mode.totp) && (
          <TwoFA_Step_Six onClose={onClose} />
        )}
      </div>
    </div>
  );
};
