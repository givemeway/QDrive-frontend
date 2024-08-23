import { Header } from "./Header.jsx";
import { useEffect, useState } from "react";
import "./2FA_verification.css";
import { useSelector } from "react-redux";
import { useVerifyOTPMutation } from "../features/api/apiSlice.js";
import { useNavigate } from "react-router-dom";
export const TwoFAVerification = () => {
  const [code, setCode] = useState("");
  const navigate = useNavigate();
  const { isSMS, isEmail, isTOTP } = useSelector((state) => state.avatar);
  const [query, queryStatus] = useVerifyOTPMutation();
  console.log(queryStatus);
  const { error, isError, isSuccess, status } = queryStatus;
  const handleChange = (e) => {
    setCode(e.currentTarget.value);
  };
  const handleSubmit = () => {
    let mfa = "";
    if (isSMS) {
      mfa = "sms";
    } else if (isEmail) {
      mfa = "email";
    } else if (isTOTP) {
      mfa = "totp";
    }
    query({ token: code, mfa, is2FAConfig: false });
  };

  useEffect(() => {
    if (isSuccess) {
      navigate("/dashboard/home");
    }
  }, [isSuccess]);
  return (
    <div className="twoFA_container">
      <div className="twoFA_header">
        <Header isLogin={false} isSignup={true} />
      </div>
      <div className="flex_row_width_full_grow">
        <div className="twoFA_box">
          <h3 className="twoFA_title">Enter QDrive 2-step verification code</h3>
          {isTOTP && (
            <h5 className="twoFA_subheading">
              Enter the code generated by your authenticator app.
            </h5>
          )}
          {isEmail && (
            <h5 className="twoFA_subheading">
              Enter the code sent to your email.
            </h5>
          )}
          {isError && <span className="twoFA_error">Invalid Code</span>}
          <div className="twoFA_input_container">
            <div className="twoFA_code_container">
              <label className=" twoFA_code_label">6-digit code</label>
              <input
                value={code}
                onChange={handleChange}
                type="number"
                name="code"
                className={`twoFA_input ${error ? "twoFA_input_error" : ""}`}
                autoFocus={true}
              />
            </div>
            <div className="twoFA_code_button_container">
              <button
                className={`twoFA_button ${
                  code.length === 0 ? "btn_disabled" : ""
                }`}
                disabled={code.length === 0 ? true : false}
                onClick={handleSubmit}
              >
                Enter
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
