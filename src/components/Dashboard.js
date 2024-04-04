import { Grid } from "@mui/material";

import Search from "./SearchFilesFolders";
import SnackBar from "./Snackbar/SnackBar.js";

import NavigatePanel from "./Panel";
import Header from "./Header";
import MainPanel from "./MainPanel";
import Menu from "./UploadMenu";

import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { useRecoilState } from "recoil";
import { snackBarAtom } from "../Recoil/Store/atoms.js";
import { StatusNotification } from "./StatusNotification.js";
import SpinnerGIF from "./icons/SpinnerGIF.js";
import { useGetCSRFTokenQuery } from "../features/api/apiSlice.js";
import { useDispatch } from "react-redux";
import { setCSRFToken } from "../features/csrftoken/csrfTokenSlice.jsx";

const Dashboard = () => {
  const [tabSelected, setTabSelected] = useState(1);
  const [searchValue, setSearchValue] = useState("");
  const [isSearch, setIsSearch] = useState(false);
  const [notify, setNotify] = useRecoilState(snackBarAtom);
  const params = useParams();
  const subpath = params["*"];
  const [mode, setMode] = useState("");
  const dispatch = useDispatch();
  const CSRFTokenStatus = useGetCSRFTokenQuery();

  const { isLoading, isSuccess, isError, data } = CSRFTokenStatus;

  useEffect(() => {
    console.log(subpath);
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
    } else if (path[0] === "share") {
      setMode("SHARE");
    } else if (path[0] === "photos") {
      setMode("PHOTOS");
    }
  }, [subpath]);

  useEffect(() => {
    if (isSuccess) {
      console.log("set csrf");
      dispatch(setCSRFToken(data.CSRFToken));
    }
  }, [isSuccess, data]);

  return (
    <>
      <div className="w-screen h-screen flex flex-row gap-0">
        <div className="w-[240px] hidden h-screen md:block">
          <NavigatePanel />
        </div>
        <div className="h-screen grow flex flex-col pl-4 pr-4">
          <div className="w-full h-[85px] pt-4">
            <Search searchValue={searchValue} />
          </div>
          {(mode === "BROWSE" || mode === "SEARCH") && (
            <div className="w-full h-[85px]">
              <Header search={isSearch} />
            </div>
          )}
          {mode === "BROWSE" && (
            <div className="w-full h-[85px]">
              <Menu />
            </div>
          )}
          {isLoading && (
            <div className="w-full flex flex-row justify-center items-center grow">
              <SpinnerGIF style={{ width: 50, height: 50 }} />
            </div>
          )}
          {isSuccess && mode !== "" && <MainPanel mode={mode} />}
          {isError && <div className="w-full">Something Went Wrong</div>}
        </div>
      </div>

      {/* <Grid container columns={2} wrap="nowrap">
        <Grid item sx={{ width: 240, height: "100vh" }}>
          <NavigatePanel />
        </Grid>
        <Grid item sx={{ width: "100%", height: "100vh", overflowY: "hidden" }}>
          <Grid container sx={{ height: "100%" }}>
            <Grid
              item
              xs={12}
              sx={{
                height: tabSelected === 4 ? "15%" : "20%",
                margin: 0,
                padding: 0,
              }}
            >
              <Search searchValue={searchValue} />
              {(mode === "BROWSE" || mode === "SEARCH") && (
                <Header search={isSearch} />
              )}
            </Grid>
            {mode === "BROWSE" && (
              <Grid item xs={12} sx={{ height: "5%", margin: 0, padding: 0 }}>
                <Menu />
              </Grid>
            )}
            <Grid
              item
              xs={12}
              sx={{
                height: tabSelected === 4 ? "85%" : "75%",
                margin: 0,
                padding: 0,
                display: "flex",
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              {isLoading && <SpinnerGIF style={{ width: 50, height: 50 }} />}
              {isSuccess && mode !== "" && <MainPanel mode={mode} />}
              {isError && <>Something Went Wrong</>}
            </Grid>
          </Grid>
        </Grid>
      </Grid> */}
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
