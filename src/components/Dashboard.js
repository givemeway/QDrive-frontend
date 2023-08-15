/*global axios */
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
} from "./Context";

import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const url = "/app/browseFolder";
const csrfurl = "/app/csrftoken";
const searchURL = "/app/search";

async function fetchCSRFToken(csrfurl) {
  const response = await fetch(csrfurl);
  const { CSRFToken } = await response.json();
  return CSRFToken;
}

const Dashboard = () => {
  const [data, setData] = useState([]);
  const [breadCrumb, setBreadCrumb] = useState(["/"]);
  const [dataLoaded, setDataLoaded] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [isSearch, setIsSearch] = useState(false);
  const [itemsSelected, setItemsSelection] = useState({
    fileIds: [],
    directories: [],
  });

  const params = useParams();
  const subpath = params["*"];
  console.log("dashboard rendered");
  useEffect(() => {
    setDataLoaded(false);
    setIsSearch(false);
    setSearchValue("");
    const path = subpath.split("/");
    if (path[0] === "home") {
      let homedir;
      let curDir;
      let breadCrumbQueue;

      if (path.length === 1) {
        homedir = "/";
        curDir = "/";
        setBreadCrumb(["/"]);
      } else {
        curDir = path.slice(2).join("/");
        breadCrumbQueue = [...path.slice(1)];
        setBreadCrumb(["/", ...breadCrumbQueue]);
        if (curDir.length === 0) {
          curDir = "/";
        }
        homedir = path[1];
      }
      fetchCSRFToken(csrfurl).then((csrftoken) => {
        const headers = {
          "X-CSRF-Token": csrftoken,
          "Content-type": "application/x-www-form-urlencoded",
          devicename: homedir,
          currentdirectory: curDir,
          username: "sandeep.kumar@idriveinc.com",
          sortorder: "ASC",
        };
        const options = {
          method: "POST",
          credentials: "include",
          mode: "cors",
          headers: headers,
        };
        fetch(url + "/", options)
          .then((res) => res.json())
          .then((data) => {
            setData(() => {
              setDataLoaded(true);
              return data;
            });
          })
          .catch((err) => console.log(err));
      });
    } else if (path[0] === "search") {
      const initiateSearch = async (value) => {
        try {
          const res = await axios.get(searchURL + `?search=${value}`);
          setData(res.data);
          setDataLoaded(true);
        } catch (err) {
          console.log(err);
          setData([]);
          setDataLoaded(true);
        }
      };
      const param = path.slice(1)[0];
      setIsSearch(true);
      setSearchValue(param);
      initiateSearch(param);
    }
  }, [subpath]);
  return (
    <Grid container columns={2} wrap="nowrap">
      <Grid item sx={{ width: 200, height: "100vh" }}>
        <NavigatePanel />
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
            <UploadFolderContenxt.Provider value={{ setData }}>
              <ItemSelectionContext.Provider value={itemsSelected}>
                <PathContext.Provider value={subpath}>
                  <Menu />
                </PathContext.Provider>
              </ItemSelectionContext.Provider>
            </UploadFolderContenxt.Provider>
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
              <ItemSelectionContext.Provider
                value={{ itemsSelected, setItemsSelection }}
              >
                <MainPanel data={data} />
              </ItemSelectionContext.Provider>
            )}
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default React.memo(Dashboard);
