import { Grid, Box, Typography } from "@mui/material";
import CircularProgress from "@mui/material/CircularProgress";
import Search from "./SearchFilesFolders";
import SnackBar from "./Snackbar/SnackBar.js";

import NavigatePanel from "./Panel";
import Header from "./Header";
import MainPanel from "./MainPanel";
import Menu from "./UploadMenu";
import {
  PathContext,
  ItemSelectionContext,
  UploadFolderContenxt,
  SnackBarContext,
  EditContext,
  FolderExplorerContext,
  NotificationContext,
} from "./UseContext";

import { csrftokenURL, trashTotalURL } from "../config";

import React, { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import useFetchCSRFToken from "./hooks/FetchCSRFToken";
import useFetchItems from "./hooks/FetchCurrentDirectoryItems";
import useFetchSearchItems from "./hooks/FetchSearchItems";
import useFetchTotal from "./hooks/FetchTotalHook";
import { PanelContext } from "./UseContext";
import SpinnerGIF from "./icons/SpinnerGIF";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import {
  breadCrumbAtom,
  dataAtom,
  snackBarAtom,
  subpathAtom,
} from "../Recoil/Store/atoms.js";
import { StatusNotification } from "./StatusNotification.js";
import AvatarMenu from "./AvatarMenu.js";

const Dashboard = () => {
  const setData = useSetRecoilState(dataAtom);
  const setSubPath = useSetRecoilState(subpathAtom);
  const [rowCount, setRowCount] = useState(0);
  const [tabSelected, setTabSelected] = useState(1);
  const setBreadCrumb = useSetRecoilState(breadCrumbAtom);
  const [dataLoaded, setDataLoaded] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [isSearch, setIsSearch] = useState(false);
  const csrftoken = useFetchCSRFToken(csrftokenURL);
  const [total, fetchTotal] = useFetchTotal();

  const [notify, setNotify] = useRecoilState(snackBarAtom);

  const params = useParams();
  const subpath = params["*"];
  setSubPath(subpath);

  console.log("dashboard rendered ", subpath);
  // const [items, breadCrumbQueue, getItems, itemsLoaded] = useFetchItems(
  //   subpath,
  //   csrftoken
  // );

  const [searchResult, initSearch, searchLoaded, searchParam] =
    useFetchSearchItems(subpath, csrftoken);

  // useEffect(() => {
  //   if (itemsLoaded) {
  //     setData(items);
  //     setBreadCrumb(breadCrumbQueue);
  //     setDataLoaded(true);
  //   }
  // }, [breadCrumbQueue, items, itemsLoaded]);

  useEffect(() => {
    if (searchLoaded) {
      setData(searchResult);
      setDataLoaded(true);
    }
  }, [searchLoaded, searchParam, searchResult]);

  useEffect(() => {
    setDataLoaded(false);
    setIsSearch(false);
    setSearchValue("");

    const path = subpath.split("/");
    if (path[0] === "home") {
      // getItems();
      setTabSelected(1);
    } else if (path[0] === "search") {
      setSearchValue(searchParam);
      setIsSearch(true);
      initSearch();
    } else if (path[0] === "deleted") {
      setTabSelected(4);
      setDataLoaded(true);
    }
  }, [subpath]);

  useEffect(() => {
    console.log("total: ", total);
    setRowCount(total);
  }, [total]);

  return (
    <>
      <Grid container columns={2} wrap="nowrap">
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
              {/* <AvatarMenu /> */}
              <Search searchValue={searchValue} />

              {tabSelected !== 4 && <Header search={isSearch} />}
            </Grid>
            {tabSelected !== 4 && (
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
              }}
            >
              {/* {!dataLoaded ? (
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    flexDirection: "column",
                  }}
                >
                  <CircularProgress />
                  <Typography align="center">Loading...</Typography>
                </Box>
              ) : (
                <MainPanel />
              )} */}
              <MainPanel />
            </Grid>
          </Grid>
        </Grid>
      </Grid>
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
