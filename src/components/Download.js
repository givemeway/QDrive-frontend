/* global axios */

import React, { useState, useContext, useEffect } from "react";
import { Button } from "@mui/material";
import CloudDownloadIcon from "@mui/icons-material/CloudDownloadRounded";
import { ItemSelectionContext } from "./Context";
import { downloadItemsURL, csrftokenURL } from "../config.js";

async function fetchCSRFToken(csrfurl) {
  const response = await fetch(csrfurl);
  const { CSRFToken } = await response.json();
  return CSRFToken;
}

const Download = () => {
  const { fileIds, directories } = useContext(ItemSelectionContext);
  const [CSRFToken, setCSRFToken] = useState("");
  const [startDownload, setStartDownload] = useState(false);
  const handleClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setStartDownload(true);
  };
  useEffect(() => {
    fetchCSRFToken(csrftokenURL)
      .then((csrftoken) => setCSRFToken(csrftoken))
      .catch((err) => console.log(err));
  }, []);
  useEffect(() => {
    if (
      startDownload &&
      CSRFToken.length > 0 &&
      (fileIds.length > 0 || directories.length > 0)
    ) {
      const headers = {
        "X-CSRF-Token": CSRFToken,
        "Content-Type": "application/x-www-form-urlencoded",
      };
      const body = {
        files: JSON.stringify(fileIds),
        directories: JSON.stringify(directories),
      };
      axios
        .post(downloadItemsURL, body, { headers: headers })
        .then((res) => console.log(res.data))
        .catch((err) => console.log(err));
    }
  }, [startDownload, CSRFToken]);
  return (
    <Button
      variant="outlined"
      disableRipple
      sx={{
        border: "none",
        boxSizing: "border-box",
        "&:hover": {
          backgroundColor: "#EFF3FA",
          border: "none",
        },
      }}
      onClick={handleClick}
    >
      <CloudDownloadIcon
        color="primary"
        sx={{ cursor: "pointer", fontSize: 25 }}
      />
    </Button>
  );
};

export default React.memo(Download);
