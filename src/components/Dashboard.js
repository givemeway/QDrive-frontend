import Search from "./SearchFilesFolders";
import SnackBar from "./Snackbar/SnackBar.js";

import NavigatePanel from "./Panel";
import Header from "./Header";
import MainPanel from "./MainPanel";
import Menu from "./UploadMenu";

import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import AccountPage from "./AccountPage.js";

import { useRecoilState } from "recoil";
import { snackBarAtom } from "../Recoil/Store/atoms.js";
import { StatusNotification } from "./StatusNotification.js";
import SpinnerGIF from "./icons/SpinnerGIF.js";
import {
  useGetCSRFTokenQuery,
  useVerifySessionMutation,
} from "../features/api/apiSlice.js";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setCSRFToken } from "../features/csrftoken/csrfTokenSlice.jsx";
import { setSession } from "../features/session/sessionSlice.js";

const Dashboard = () => {
  const [searchValue, setSearchValue] = useState("");
  const [isSearch, setIsSearch] = useState(false);
  const [notify, setNotify] = useRecoilState(snackBarAtom);
  const params = useParams();
  const subpath = params["*"];
  const [mode, setMode] = useState("");
  const dispatch = useDispatch();
  const CSRFTokenStatus = useGetCSRFTokenQuery();
  const [userSession, userSessionStatus] = useVerifySessionMutation();
  const session = useSelector((state) => state.session);
  const navigate = useNavigate();
  const { open } = useSelector((state) => state.navigatePanel);
  const { isLoading, isSuccess, isError, data } = CSRFTokenStatus;
  const searchRef = useRef();
  const containerRef = useRef();

  console.log("Dashboard rendered");

  useEffect(() => {
    if (
      isSuccess &&
      data &&
      (session.isLoggedIn === false && session.isLoggedOut === false
        ? true
        : session.isLoggedOut)
    ) {
      userSession({ CSRFToken: data?.CSRFToken });
    }
  }, [isSuccess, data]);

  useEffect(() => {
    if (userSessionStatus.isSuccess && userSessionStatus.data?.success) {
      dispatch(setSession({ isLoggedIn: true, isLoggedOut: true }));
    } else if (userSessionStatus.isError) {
      navigate("/login");
    }
  }, [
    userSessionStatus.isSuccess,
    userSessionStatus.data,
    userSessionStatus.isError,
  ]);

  useEffect(() => {
    setIsSearch(false);
    setSearchValue("");
    const path = subpath.split("/");
    if (path[0] === "home") {
      setMode("BROWSE");
    } else if (path[0] === "search") {
      setIsSearch(true);
      setMode("SEARCH");
    } else if (path[0] === "deleted") {
      setMode("DELETED");
    } else if (path[0] === "photos") {
      setMode("PHOTOS");
    } else if (path[0] === "share") {
      setMode("SHARE");
    } else if (path[0] === "account") {
      setMode("ACCOUNT");
    }
  }, [subpath]);

  console.log(subpath);

  useEffect(() => {
    if (isSuccess) {
      dispatch(setCSRFToken(data.CSRFToken));
    }
  }, [isSuccess, data]);

  useEffect(() => {
    console.log(containerRef.current?.getBoundingClientRect());
    console.log(searchRef.current?.getBoundingClientRect());
  }, []);

  return (
    <>
      {session.isLoggedIn && (
        <div
          className="w-screen h-screen flex flex-row gap-0"
          ref={containerRef}
        >
          <div className="w-[240px] hidden h-screen md:block">
            <NavigatePanel />
          </div>

          <div className="h-screen w-full md:grow flex flex-col pl-4 pr-4">
            <div className="w-full h-[60px] pt-4 mb-2" ref={searchRef}>
              <Search searchValue={searchValue} />
            </div>

            {mode === "BROWSE" && (
              <div className="w-full h-[80px]">
                <Menu />
              </div>
            )}
            {mode === "ACCOUNT" && (
              <div className="w-full h-full">
                <AccountPage />
              </div>
            )}
            {(mode === "BROWSE" || mode === "SEARCH") && (
              <div className="w-full h-[50px]">
                <Header search={isSearch} />
              </div>
            )}
            {isLoading && (
              <div className="w-full flex justify-center items-center">
                <SpinnerGIF style={{ width: 50, height: 50 }} />
              </div>
            )}
            {isSuccess &&
              (mode === "BROWSE" ||
                mode === "PHOTOS" ||
                mode === "SHARE" ||
                mode === "DELETED") && <MainPanel mode={mode} />}
            {isError && <div className="w-full">Something Went Wrong</div>}
          </div>
          {open && (
            <div
              className={`absolute z-[1000]  inset-y-[60px]
                    flex justify-start items-center 
                    w-screen h-screen
                    bg-black bg-opacity-50 md:hidden`}
            >
              <NavigatePanel />
            </div>
          )}
        </div>
      )}

      {notify.show && (
        <SnackBar
          msg={notify.msg}
          severity={notify.severity}
          setMessage={setNotify}
        />
      )}
      <StatusNotification timeout={5000} />
    </>
  );
};

export default React.memo(Dashboard);
