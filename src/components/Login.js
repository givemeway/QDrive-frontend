import { useState, useEffect, useRef } from "react";
import { Header } from "./Header.jsx";
import { Link, useLocation, useNavigate } from "react-router-dom";
import MessageSnackBar from "./Snackbar/SnackBar";
import { CustomBlueButton } from "./Buttons/BlueButton";
import { GreyButton } from "./Buttons/GreyButton";
import SpinnerGIF from "./icons/SpinnerGIF";
import { useDispatch, useSelector } from "react-redux";
import "./PasswordFieldWithMask.css";
import { GoogleLogin } from "@react-oauth/google";

import {
  useGetCSRFTokenQuery,
  useGoogleOneTapMutation,
  useLoginMutation,
  useVerifySessionMutation,
} from "../features/api/apiSlice";
import { setSession } from "../features/session/sessionSlice";
import { HorizontalLineDividedByText } from "./HorizontalLine";
import "./Login.css";
import { setNotify } from "../features/notification/notifySlice";
import { PasswordFieldWithMask } from "./PasswordFieldWithMask";
import { setUserData } from "../features/avatar/avatarSlice.js";

const validateLoginForm = (loginform) => {
  if (loginform.username.length > 0 && loginform.password.length > 0) {
    const encodedData = btoa(`${loginform.username}:${loginform.password}`);
    return { valid: true, encodedData };
  } else {
    return { valid: false, encodedData: null };
  }
};

const Login = () => {
  const [loginForm, setLoginForm] = useState({ username: "", password: "" });
  const [googleButtonWidth, setGoogleButtonWidth] = useState(363);
  const location = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const CSRF = useGetCSRFTokenQuery();
  const rowWidth = useRef(null);

  const notify = useSelector((state) => state.notification);

  const [verifySessionQuery, verifySessionStatus] = useVerifySessionMutation();
  const [loginQuery, loginStatus] = useLoginMutation();
  const [oneTapQuery, oneTapStatus] = useGoogleOneTapMutation();

  const { isLoading, isError, isSuccess, data, error } = loginStatus;

  const handleChange = (event) => {
    setLoginForm((prev) => {
      return { ...prev, [event.target.name]: event.target.value };
    });
  };
  const handleClick = (e) => {
    const { valid, encodedData } = validateLoginForm(loginForm);
    if (valid && CSRF.data?.CSRFToken) {
      loginQuery({ CSRFToken: CSRF.data?.CSRFToken, encodedData });
    }
  };

  const oneTapCallBack = (token) => {
    oneTapQuery(token);
  };
  useEffect(() => {
    if (oneTapStatus.isSuccess) {
      navigate("/dashboard/home");
    } else if (oneTapStatus.isError && oneTapStatus.error?.status === 404) {
      navigate(`/login?error=${oneTapStatus.error?.data?.msg}`);
    } else if (oneTapStatus.error?.originalStatus === 500) {
      dispatch(
        setNotify({
          show: true,
          msg: "Something Went wrong. Try again!",
          severity: "error",
        })
      );
    }
  }, [
    oneTapStatus.isError,
    oneTapStatus.isSuccess,
    oneTapStatus.data,
    oneTapStatus.error,
  ]);

  useEffect(() => {
    verifySessionQuery();
    const handleResize = () => {
      if (rowWidth.current) {
        setGoogleButtonWidth(rowWidth.current.offsetWidth);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);
  useEffect(() => {
    const key = new URLSearchParams(location.search);
    if (key.has("error")) {
      dispatch(
        setNotify({ show: true, severity: "warning", msg: key.get("error") })
      );
    }
  }, [location.search]);

  useEffect(() => {
    if (rowWidth.current) {
      setGoogleButtonWidth(rowWidth.current.offsetWidth);
    }
  }, [rowWidth.current]);

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
      console.log(error?.status, error?.status?.status);
      if (error?.status) {
        dispatch(
          setNotify({
            show: true,
            msg: error?.data?.msg,
            severity: "warning",
          })
        );
      }
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

  useEffect(() => {
    if (verifySessionStatus.isSuccess && verifySessionStatus.data?.success) {
      dispatch(setSession({ isLoggedIn: true, isLoggedOut: false }));
      if (verifySessionStatus.isSuccess && verifySessionStatus.data) {
        dispatch(setUserData({ ...verifySessionStatus?.data }));
      }
      navigate("/dashboard/home");
    }
    if (
      verifySessionStatus.isError &&
      verifySessionStatus.error &&
      verifySessionStatus.error?.data?.error === "2FA_REQUIRED"
    ) {
      dispatch(setUserData({ ...verifySessionStatus?.error?.data }));
      navigate("/verify_code");
    }
  }, [
    verifySessionStatus.isError,
    verifySessionStatus.isSuccess,
    verifySessionStatus.data,
  ]);

  return (
    <div className="w-screen h-screen flex flex-col">
      <div className="w-full">
        <Header isLogin={false} isSignup={true} />
      </div>
      {(CSRF.isLoading || verifySessionStatus.isLoading) && (
        <div className="w-full grow flex justify-center items-center">
          <SpinnerGIF style={{ width: 50, height: 50 }} />
        </div>
      )}
      {CSRF.isError && (
        <div className="w-full grow flex justify-center items-center">
          <span>Something Went wrong try again</span>
        </div>
      )}
      {CSRF.isSuccess && verifySessionStatus.isError && CSRF.data && (
        <div className="w-full grow flex flex-row justify-center items-center">
          <div className=" flex flex-col gap-2 pr-7 pl-7 pt-5 pb-5 w-[420px] md:w-[420px] sm:w-[420px] custom-shadow h-auto">
            <div className="w-full">
              <h3 className="text-center font-semibold text-md text-[#716B61]">
                Sign In to QDrive
              </h3>
              {error?.status === 401 && !error?.status?.status && (
                <div className="cancellation-banner">
                  <p className="cancellation-p">
                    {error?.data?.msg}.
                    <span>
                      {" "}
                      Click to{" "}
                      <Link to={"/reactivate"} className="cancellation-link">
                        reactivate
                      </Link>
                    </span>
                  </p>
                </div>
              )}
              {error?.status === 403 && error?.data?.error === "SSO_USER" && (
                <div className="cancellation-banner">
                  <p className="cancellation-p">
                    {error?.data?.msg}
                    <span>
                      {" "}
                      click to{" "}
                      <Link to={"/login/sso"} className="cancellation-link">
                        login
                      </Link>
                    </span>
                  </p>
                </div>
              )}
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
                style={{ width: "100%", height: 45, marginBottom: 8 }}
              />
            )}
            {notify.show && (
              <MessageSnackBar severity={notify.severity} msg={notify.msg} />
            )}

            <HorizontalLineDividedByText text={" Or sign in with "} />
            <div className="w-full mt-2 mb-6" ref={rowWidth}>
              <GoogleLogin
                onSuccess={(response) => {
                  oneTapCallBack(response.credential);
                }}
                onError={(err) => console.log(err)}
                width={googleButtonWidth}
                useOneTap={true}
              />
            </div>
            <HorizontalLineDividedByText text={""} />

            <div className="w-full flex justify-center items-center mt-3">
              <button
                className="text-[#1F74FE] text-md font-semibold"
                onClick={() => navigate("/signup")}
              >
                Create New Account
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
export default Login;
