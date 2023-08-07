import { Grid, Box, Typography } from "@mui/material";
import CircularProgress from "@mui/material/CircularProgress";

import NavigatePanel from "./Panel";
import Header from "./Header";
import MainPanel from "./MainPanel";
import Menu from "./UploadMenu";

import { useEffect, useState } from "react";
import { useParams, useLocation } from "react-router-dom";

const url = "/app/browseFolder";
const csrfurl = "/app/csrftoken";

async function fetchCSRFToken(csrfurl) {
  const response = await fetch(csrfurl);
  const { CSRFToken } = await response.json();
  return CSRFToken;
}

const Dashboard = () => {
  const [data, setData] = useState([]);
  const [breadCrumb, setBreadCrumb] = useState(["/"]);
  const [dataLoaded, setDataLoaded] = useState(false);
  const params = useParams();
  const subpath = params["*"];
  useEffect(() => {
    let homedir;
    let curDir;
    let breadCrumbQueue;
    if (subpath.length === 0) {
      homedir = "/";
      curDir = "/";
      setBreadCrumb(["/"]);
    } else {
      curDir = subpath.split("/").slice(1).join("/");
      breadCrumbQueue = [...subpath.split("/")];
      setBreadCrumb(["/", ...breadCrumbQueue]);
      if (curDir.length === 0) {
        curDir = "/";
      }
      homedir = subpath.split("/")[0];
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
  }, [subpath]);
  return (
    <Grid container columns={2} wrap="nowrap">
      <Grid item sx={{ width: 200, height: "100vh" }}>
        <NavigatePanel />
      </Grid>
      <Grid item sx={{ width: "100%", height: "100vh" }}>
        <Grid container sx={{ height: "100%" }}>
          <Grid item xs={12} sx={{ height: "25%" }}>
            {dataLoaded && <Header queue={breadCrumb} />}
          </Grid>
          <Grid item xs={12}>
            <Menu />
          </Grid>
          <Grid
            item
            xs={12}
            sx={{ height: "60%", overflowY: "auto", overflowX: "hidden" }}
          >
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
              <MainPanel data={data} />
            )}
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default Dashboard;
