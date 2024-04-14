import { useState, useEffect } from "react";
import Header from "./HomePageHeader";
import { useNavigate } from "react-router-dom";
import MessageSnackBar from "./Snackbar/SnackBar";
import { CustomBlueButton } from "./Buttons/BlueButton";
import { GreyButton } from "./Buttons/GreyButton";
import SpinnerGIF from "./icons/SpinnerGIF";
import { useDispatch, useSelector } from "react-redux";
import {
  useGetCSRFTokenQuery,
  useLoginMutation,
  useVerifySessionMutation,
} from "../features/api/apiSlice";
import { setSession } from "../features/session/sessionSlice";
import { HorizontalLineDividedByText } from "./HorizontalLine";

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
  const [warning, setWarning] = useState(false);
  const [error, setError] = useState(false);
  const [success, setSuccess] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const CSRF = useGetCSRFTokenQuery();
  const [verifySessionQuery, verifySessionStatus] = useVerifySessionMutation();
  const session = useSelector((state) => state.session);

  const [loginQuery, loginStatus] = useLoginMutation();

  const { isLoading, isError, isSuccess, data } = loginStatus;

  console.log(CSRF);

  const handleChange = (event) => {
    setLoginForm((prev) => {
      return { ...prev, [event.target.name]: event.target.value };
    });
  };
  const handleClick = (e) => {
    setWarning(false);
    setError(false);
    setSuccess(false);
    const { valid, encodedData } = validateLoginForm(loginForm);
    if (valid && CSRF.data?.CSRFToken) {
      console.log(CSRF.data?.CSRFToken);
      console.log({ CSRFToken: CSRF.data?.CSRFToken, encodedData });
      loginQuery({ CSRFToken: CSRF.data?.CSRFToken, encodedData });
    }
  };

  useEffect(() => {
    if (
      CSRF.data?.CSRFToken &&
      CSRF.isSuccess &&
      (session.isLoggedIn === false && session.isLoggedOut === false
        ? true
        : session.isLoggedOut)
    ) {
      verifySessionQuery({ CSRFToken: CSRF.data?.CSRFToken });
    }
  }, [CSRF?.data, CSRF.isSuccess]);

  useEffect(() => {
    if (data?.success) {
      dispatch(setSession({ isLoggedIn: true, isLoggedOut: false }));
      navigate("/dashboard/home");
    } else if (
      loginStatus?.error?.status === 401 ||
      loginStatus?.error?.status === 403
    ) {
      setWarning(true);
    } else if (loginStatus?.error?.originalStatus === 500) {
      setError(true);
    }
  }, [isLoading, isError, isSuccess, data]);

  useEffect(() => {
    if (verifySessionStatus.isSuccess && verifySessionStatus.data?.success) {
      dispatch(setSession({ isLoggedIn: true, isLoggedOut: false }));
      navigate("/dashboard/home");
    }
  }, [
    verifySessionStatus.isError,
    verifySessionStatus.isSuccess,
    verifySessionStatus.data,
  ]);

  return (
    <div className="w-screen h-screen flex flex-col">
      <div className="w-full">
        <Header />
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
          <div className="w-[300px] flex flex-col gap-2 p-2 shadow-md">
            <div className="w-full">
              <h3 className="text-center font-semibold text-md text-[#716B61]">
                Sign In to QDrive
              </h3>
            </div>
            <div className="flex flex-col justify-start items-center">
              <label className="text-[#716B61] text-xs w-full text-left pb-1">
                Email
              </label>
              <input
                placeholder=" email / username"
                value={loginForm.username}
                onChange={handleChange}
                type="email"
                name="username"
                className="w-full h-[50px] rounded-none border border-[#C9C5BD] focus:border-black
                 hover:border-black outline-[#428BFF] outline-offset-2 "
              />
            </div>
            <div className="flex flex-col justify-center items-center ">
              <label className="text-[#716B61] text-xs w-full text-left  pb-1">
                Password
              </label>
              <input
                placeholder=" password"
                value={loginForm.password}
                onChange={handleChange}
                type="password"
                name="password"
                className="w-full h-[50px]  border border-[#C9C5BD] focus:border-black
                 hover:border-black outline-[#428BFF] outline-4 outline-offset-2"
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
                text={"Login"}
                onClick={handleClick}
                style={{ width: "100%", height: 50 }}
              />
            )}
            {warning && (
              <MessageSnackBar
                severity={"warning"}
                msg={"Username or password incorrect!"}
                setMessage={setWarning}
              />
            )}
            {success && (
              <MessageSnackBar
                severity={"success"}
                msg={"Login Successful!"}
                setMessage={setSuccess}
              />
            )}
            {error && (
              <MessageSnackBar
                severity={"error"}
                msg={"Something Went wrong. Try again!"}
                setMessage={setError}
              />
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
      )}
    </div>
  );
};
export default Login;
