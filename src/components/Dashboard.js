import Search from "./SearchFilesFolders";
import SnackBar from "./Snackbar/SnackBar.js";

import NavigatePanel from "./Panel";
import Header from "./Header";
import MainPanel from "./MainPanel";
import Menu from "./UploadMenu";

import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import AccountPage from "./AccountPage.js";

import { StatusNotification } from "./StatusNotification.js";
import SpinnerGIF from "./icons/SpinnerGIF.js";
import { useVerifySessionMutation } from "../features/api/apiSlice.js";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setSession } from "../features/session/sessionSlice.js";
import "./Dashboard.css";
import { setUserData } from "../features/avatar/avatarSlice.js";

const Dashboard = () => {
  const [searchValue, setSearchValue] = useState("");
  const [isSearch, setIsSearch] = useState(false);
  const notify = useSelector((state) => state.notification);
  const params = useParams();
  const subpath = params["*"];
  const [mode, setMode] = useState("");
  const dispatch = useDispatch();
  const [userSession, userSessionStatus] = useVerifySessionMutation();
  const session = useSelector((state) => state.session);
  const navigate = useNavigate();
  const { open } = useSelector((state) => state.navigatePanel);
  const { isLoading, isSuccess, isError, data } = userSessionStatus;
  const [isClosing, setIsClosing] = useState(false);
  const searchRef = useRef();
  const containerRef = useRef();

  console.log("Dashboard rendered");

  useEffect(() => {
    userSession();
  }, []);

  useEffect(() => {
    if (isSuccess && data) {
      dispatch(setUserData({ ...data }));
      dispatch(setSession({ isLoggedIn: true, isLoggedOut: true }));
    } else if (isError) {
      navigate("/login");
    }
  }, [isSuccess, data, isError]);

  useEffect(() => {
    if (!open) {
      setIsClosing(true);

      setTimeout(() => {
        setIsClosing(false);
      }, 300);
    }
  }, [open]);

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

  // useEffect(() => {
  //   if (isSuccess) {
  //     dispatch(setCSRFToken(data.CSRFToken));
  //   }
  // }, [isSuccess, data]);

  return (
    <>
      {session.isLoggedIn && (
        <div className="dashboard-container" ref={containerRef}>
          <div className="panel-container">
            <NavigatePanel />
          </div>

          <div className="dashboard-body-container">
            <div className="dashboard-search-container" ref={searchRef}>
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
            {mode === "BROWSE" && (
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
                mode === "SEARCH" ||
                mode === "DELETED") && <MainPanel mode={mode} />}
            {isError && <div className="w-full">Something Went Wrong</div>}
          </div>
          <div
            className={`panel-container-mobile ${
              open ? "panel-grow" : isClosing ? "delay-close" : "panel-hide"
            }`}
          >
            <NavigatePanel />
          </div>
        </div>
      )}

      {notify.show && <SnackBar msg={notify.msg} severity={notify.severity} />}
      <StatusNotification timeout={5000} />
    </>
  );
};

export default React.memo(Dashboard);
