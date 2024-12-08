import { useState, useEffect } from "react";
import { Header } from "./Header.jsx";
import { Link, useNavigate } from "react-router-dom";
import MessageSnackBar from "./Snackbar/SnackBar";
import { CustomBlueButton } from "./Buttons/BlueButton";
import { GreyButton } from "./Buttons/GreyButton";
import SpinnerGIF from "./icons/SpinnerGIF";
import { useDispatch, useSelector } from "react-redux";
import "./PasswordFieldWithMask.css";

import { useSsoLoginMutation } from "../features/api/apiSlice";
import { setSession } from "../features/session/sessionSlice";
import { HorizontalLineDividedByText } from "./HorizontalLine";
import "./Login.css";
import { setNotify } from "../features/notification/notifySlice";
import { setUserData } from "../features/avatar/avatarSlice.js";

const validateLoginForm = (loginform) => {
  if (loginform.username.length > 0) {
    return true;
  } else {
    return false;
  }
};

const SSO = () => {
  const [loginForm, setLoginForm] = useState({ username: "" });
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const notify = useSelector((state) => state.notification);

  const [ssoQuery, ssoStatus] = useSsoLoginMutation();

  const { isLoading, isError, isSuccess, data, error } = ssoStatus;

  const handleChange = (event) => {
    setLoginForm((prev) => {
      return { ...prev, [event.target.name]: event.target.value };
    });
  };
  const handleClick = (e) => {
    const valid = validateLoginForm(loginForm);
    if (valid) {
      ssoQuery({ username: loginForm.username });
    }
  };

  useEffect(() => {
    if (data?.success) {
      window.location.href = data?.url;
    } else if (error?.status === 404 || error?.status === 500) {
      dispatch(
        setNotify({
          show: true,
          msg: error?.data?.msg,
          severity: "warning",
        })
      );
    } else if (error?.originalStatus === 500) {
      dispatch(
        setNotify({
          show: true,
          msg: "Something Went wrong. Try again!",
          severity: "error",
        })
      );
    }
  }, [isLoading, isError, isSuccess, data, error]);

  return (
    <div className="w-screen h-screen flex flex-col">
      <div className="w-full">
        <Header isLogin={false} isSignup={true} />
      </div>

      <div className="w-full grow flex flex-row justify-center items-center">
        <div className=" flex flex-col gap-2 pr-7 pl-7 pt-5 pb-5 w-full md:w-[480px] sm:w-[480px] custom-shadow h-auto">
          <div className="w-full">
            <h3 className="text-center font-semibold text-md text-[#716B61]">
              Single Sign On ( SSO)
            </h3>
            {error?.status === 401 && !error?.status?.status && (
              <div className="cancellation-banner">
                <p className="cancellation-p">
                  {error?.data?.msg}
                  <span>
                    {" "}
                    Click to{" "}
                    <Link to={"/login"} className="cancellation-link">
                      login
                    </Link>
                  </span>
                </p>
              </div>
            )}
          </div>
          <div className="flex flex-col justify-start items-center">
            <label className="text-[#716B61] text-sm w-full text-left pb-1">
              Email / Username
            </label>
            <input
              placeholder=" email / username"
              value={loginForm.username}
              onChange={handleChange}
              type="email"
              name="username"
              className="password-input"
              style={{ height: 50 }}
            />
          </div>

          {isLoading && (
            <GreyButton
              text={
                <div className="flex justify-center items-center">
                  <SpinnerGIF style={{ width: 40, height: 40 }} />
                </div>
              }
              style={{ width: "100%", height: 50 }}
            ></GreyButton>
          )}
          {!isLoading && (
            <CustomBlueButton
              text={"Sign in"}
              onClick={handleClick}
              style={{ width: "100%", height: 50 }}
            />
          )}
          {notify.show && (
            <MessageSnackBar severity={notify.severity} msg={notify.msg} />
          )}

          <HorizontalLineDividedByText text={"Or"} />

          <div className="w-full flex justify-center items-center">
            <button
              className="text-[#1F74FE] text-sm"
              onClick={() => navigate("/signup")}
            >
              Create New Account
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
export default SSO;
