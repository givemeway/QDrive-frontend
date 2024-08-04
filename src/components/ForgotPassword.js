import Header from "./HomePageHeader";
import "./ForgotPassword.css";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { usePassResetMutation } from "../features/api/apiSlice";
import SpinnerGIF from "./icons/SpinnerGIF";
import SnackBar from "./Snackbar/SnackBar.js";
import { useDispatch, useSelector } from "react-redux";
import { setNotify } from "../features/notification/notifySlice.js";

export const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const dispatch = useDispatch();
  const notify = useSelector((state) => state.notification);
  const location = useLocation();
  const [passResetQuery, passResetStatus] = usePassResetMutation();
  const { isLoading, isError, error, isSuccess, data } = passResetStatus;

  const handleOnChange = (e) => {
    setEmail(e.target.value);
  };
  const submitPass = () => {
    if (email.length > 0) {
      passResetQuery({ username: email });
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
    if (error && error.originalStatus === 500) {
      dispatch(
        setNotify({
          show: true,
          msg: "Something Went Wrong",
          severity: "error",
        })
      );
    }
    if (error && error.status === 404) {
      dispatch(
        setNotify({ show: true, msg: error.data.msg, severity: "error" })
      );
    }
    if (isSuccess && data) {
      dispatch(setNotify({ show: true, msg: data.msg, severity: "success" }));
    }
  }, [isSuccess, isError, error, data, isLoading, dispatch]);
  console.log(notify);
  return (
    <div className="forgot">
      <Header />
      <div className="forgot-container">
        <div className="forgot-submit-container ">
          <h2 className="title">Forgot your password?</h2>
          <p className="forgot-p">
            Enter your email address to reset your password. You may need to
            check your spam folder or unblock no-reply@qdrive.space.
          </p>
          <div className="forgot-input-container">
            <span className="forgot-label">Email</span>
            <input
              type="email"
              name="email"
              value={email}
              onChange={handleOnChange}
              className="forgot-input"
            />
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
      </div>
      {notify.show && <SnackBar msg={notify.msg} severity={notify.severity} />}
    </div>
  );
};
