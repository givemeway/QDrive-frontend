import { useState, useEffect } from "react";
import { Header } from "./Header.jsx";
import { Link, useNavigate } from "react-router-dom";
import MessageSnackBar from "./Snackbar/SnackBar";
import { CustomBlueButton } from "./Buttons/BlueButton";
import { GreyButton } from "./Buttons/GreyButton";
import SpinnerGIF from "./icons/SpinnerGIF";
import { useDispatch, useSelector } from "react-redux";
import "./PasswordFieldWithMask.css";

import { setSession } from "../features/session/sessionSlice";
import "./Login.css";
import { setNotify } from "../features/notification/notifySlice";
import { PasswordFieldWithMask } from "./PasswordFieldWithMask";
import { setUserData } from "../features/avatar/avatarSlice.js";
import { useReactivateUserMutation } from "../features/api/apiSlice.js";

const validateLoginForm = (loginform) => {
  if (loginform.username.length > 0 && loginform.password.length > 0) {
    return { valid: true };
  } else {
    return { valid: false };
  }
};

const ReactivatePage = () => {
  const [loginForm, setLoginForm] = useState({ username: "", password: "" });
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const notify = useSelector((state) => state.notification);

  const [reactiveQuery, reactivateStatus] = useReactivateUserMutation();

  const { isLoading, isError, isSuccess, data, error } = reactivateStatus;

  const handleChange = (event) => {
    setLoginForm((prev) => {
      return { ...prev, [event.target.name]: event.target.value };
    });
  };
  const handleClick = (e) => {
    const { valid } = validateLoginForm(loginForm);
    if (valid) {
      reactiveQuery({
        username: loginForm.username,
        password: loginForm.password,
      });
    }
  };

  useEffect(() => {
    if (data?.success) {
      dispatch(setSession({ isLoggedIn: true, isLoggedOut: false }));
      dispatch(
        setNotify({
          show: true,
          msg: "Logged in!",
          severity: "success",
        })
      );
      navigate("/dashboard/home");
    } else if (error?.status === 403 && error?.data?.error === "2FA_REQUIRED") {
      dispatch(setUserData({ ...error?.data }));
      navigate("/verify_code");
    } else if (
      error?.status === 404 ||
      error?.status === 401 ||
      error?.status === 422
    ) {
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
              Reactivate Account
            </h3>
          </div>
          <div className="flex flex-col justify-start items-center">
            <label className="text-[#716B61] text-sm w-full text-left pb-1">
              Email
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

          <div className="flex flex-col justify-center items-center ">
            <label className="text-[#716B61] text-sm w-full text-left  pb-1">
              Password
            </label>

            <PasswordFieldWithMask
              value={loginForm.password}
              onChange={handleChange}
              style={{ height: 50 }}
            />
          </div>
          <div className="w-full h-[20px] flex justify-between items-center">
            <div className="w-auto h-full flex justify-start items-center gap-2">
              <input type="checkbox" />
              <span className="text-[#716B61] text-sm">Remember me</span>
            </div>
            <Link className="text-[#1F74FE] text-sm" to={"/forgot"}>
              Forgot password?
            </Link>
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
              text={"Login"}
              onClick={handleClick}
              style={{ width: "100%", height: 50 }}
            />
          )}
          {notify.show && (
            <MessageSnackBar severity={notify.severity} msg={notify.msg} />
          )}
        </div>
      </div>
    </div>
  );
};
export default ReactivatePage;
