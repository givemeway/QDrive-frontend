import { Grid, Box, Typography } from "@mui/material";
import CircularProgress from "@mui/material/CircularProgress";

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
} from "./Context";

import { csrftokenURL } from "../config";

import React, { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import useFetchCSRFToken from "./hooks/FetchCSRFToken";
import useFetchItems from "./hooks/FetchCurrentDirectoryItems";
import useFetchSearchItems from "./hooks/FetchSearchItems";

const Dashboard = () => {
  const [data, setData] = useState([]);
  const [breadCrumb, setBreadCrumb] = useState(["/"]);
  const [dataLoaded, setDataLoaded] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [isSearch, setIsSearch] = useState(false);
  const csrftoken = useFetchCSRFToken(csrftokenURL);
  const [nav, setNav] = useState("");
  const [edit, setEdit] = useState({
    editStart: undefined,
    editStop: undefined,
    edited: undefined,
    editing: undefined,
    val: "",
  });
  const [itemDeletion, setItemDeletion] = useState({
    isOpen: false,
    isDeleting: false,
    isDeleted: false,
    itemsDeleted: 0,
    total: 0,
    itemsFailed: 0,
  });
  const [itemsSelected, setItemsSelection] = useState({
    fileIds: [],
    directories: [],
  });

  const params = useParams();
  const location = useLocation();
  const subpath = params["*"];
  console.log("dashboard rendered ", subpath);
  const [items, breadCrumbQueue, getItems, itemsLoaded] = useFetchItems(
    subpath,
    csrftoken
  );

  const [searchResult, initSearch, searchLoaded, searchParam] =
    useFetchSearchItems(subpath, csrftoken);

  useEffect(() => {
    if (itemsLoaded) {
      setData(items);
      setBreadCrumb(breadCrumbQueue);
      setDataLoaded(true);
    }
  }, [breadCrumbQueue, items, itemsLoaded]);

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
      getItems();
    } else if (path[0] === "search") {
      setSearchValue(searchParam);
      setIsSearch(true);
      initSearch();
    }
  }, [subpath]);
  return (
    <Grid container columns={2} wrap="nowrap">
      <Grid item sx={{ width: 240, height: "100vh" }}>
        <NavigatePanel nav={nav} setNav={setNav} />
      </Grid>
      <Grid item sx={{ width: "100%", height: "100vh", overflowY: "hidden" }}>
        <Grid container sx={{ height: "100%" }}>
          <Grid item xs={12} sx={{ height: "20%", margin: 0, padding: 0 }}>
            <Header
              queue={breadCrumb}
              searchValue={searchValue}
              search={isSearch}
            />
          </Grid>
          <Grid item xs={12} sx={{ height: "5%", margin: 0, padding: 0 }}>
            <SnackBarContext.Provider value={{ setItemDeletion }}>
              <UploadFolderContenxt.Provider value={{ setData }}>
                <ItemSelectionContext.Provider value={itemsSelected}>
                  <PathContext.Provider value={subpath}>
                    <EditContext.Provider value={{ edit, setEdit }}>
                      <Menu />
                    </EditContext.Provider>
                  </PathContext.Provider>
                </ItemSelectionContext.Provider>
              </UploadFolderContenxt.Provider>
            </SnackBarContext.Provider>
          </Grid>
          <Grid item xs={12} sx={{ height: "75%", margin: 0, padding: 0 }}>
            {!dataLoaded ? (
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
              <SnackBarContext.Provider
                value={{ itemDeletion, setItemDeletion }}
              >
                <UploadFolderContenxt.Provider value={data}>
                  <ItemSelectionContext.Provider
                    value={{ itemsSelected, setItemsSelection }}
                  >
                    <PathContext.Provider value={location.pathname}>
                      <EditContext.Provider value={{ edit, setEdit }}>
                        <MainPanel />
                      </EditContext.Provider>
                    </PathContext.Provider>
                  </ItemSelectionContext.Provider>
                </UploadFolderContenxt.Provider>
              </SnackBarContext.Provider>
            )}
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default React.memo(Dashboard);
