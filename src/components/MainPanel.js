import { Box, Stack } from "@mui/material";
import { useEffect, useState } from "react";
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
  useEffect(() => {
    fetchCSRFToken(csrfurl).then((csrftoken) => {
      console.log(csrftoken);
      const headers = {
        "X-CSRF-Token": csrftoken,
        devicename: "DESKTOP-10RSGE8",
        currentdirectory: "Downloads",
        username: "sandeep.kumar@idriveinc.com",
        sortorder: "ASC",
      };
      console.log(headers);
      const options = {
        method: "POST",
        credentials: "include",
        mode: "cors",
        headers: headers,
      };
      console.log(options);
      fetch(url, options)
        .then((res) => res.json())
        .then((data) => {
          console.log(data);
          setData(data);
        })
        .catch((err) => console.log(err));
    });
  }, []);
  return (
    <>
      <Stack flexDirection="column">
        <Menu />
        {data.length > 0 && <Table data={data} />}
      </Stack>
      <Stack></Stack>
    </>
  );
}
