import { Box, Stack } from "@mui/material";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import Table from "./DataTable";
import Menu from "./UploadMenu";

const url = "/app/browseFolder";
const csrfurl = "/app/csrftoken";

async function fetchCSRFToken(csrfurl) {
  const response = await fetch(csrfurl);
  const { CSRFToken } = await response.json();
  return CSRFToken;
}

export default function MainPanel() {
  const [data, setData] = useState([]);
  const [dataLoaded, setDataLoaded] = useState(false);
  const params = useParams();
  const subpath = params["*"];
  useEffect(() => {
    let homedir;
    let curDir;
    if (subpath.length === 0) {
      homedir = "/";
      curDir = "/";
    } else {
      curDir = subpath.split("/").slice(1).join("/");
      console.log(curDir);
      if (curDir.length === 0) {
        curDir = "/";
      }
      homedir = subpath.split("/")[0];
      console.log(homedir);
    }
    console.log(homedir, curDir);
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
            console.log(data);
            setDataLoaded(true);
            return data;
          });
        })
        .catch((err) => console.log(err));
    });
  }, [subpath]);
  return (
    <>
      <Stack flexDirection="column">
        <Menu />
        {dataLoaded && <Table data={data} />}
      </Stack>
      <Stack></Stack>
    </>
  );
}
