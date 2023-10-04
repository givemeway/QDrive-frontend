/* global axios */

import React, { useState, useContext, useEffect } from "react";
import {
  Button,
  Box,
  Stack,
  Snackbar,
  SnackbarContent,
  Typography,
} from "@mui/material";
import CloudDownloadIcon from "@mui/icons-material/CloudDownloadRounded";
import CircularProgress from "@mui/material/CircularProgress";
import LinearProgress from "@mui/material/LinearProgress";

import { ItemSelectionContext } from "./Context";
import { downloadItemsURL, csrftokenURL, get_download_zip } from "../config.js";

import { styled } from "@mui/material/styles";

const FullWidthLinearProgress = styled(LinearProgress)({
  width: "100%",
});

async function fetchCSRFToken(csrfurl) {
  const response = await fetch(csrfurl);
  const { CSRFToken } = await response.json();
  return CSRFToken;
}

const Download = ({ startImmediate, setDownload }) => {
  const { fileIds, directories } = useContext(ItemSelectionContext);
  const [CSRFToken, setCSRFToken] = useState("");
  const [startDownload, setStartDownload] = useState(false);
  const [open, setOpen] = useState(false);
  console.log("download items triggered");
  const handleClose = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };
  const handleClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setStartDownload(true);
  };
  useEffect(() => {
    fetchCSRFToken(csrftokenURL)
      .then((csrftoken) => {
        setCSRFToken(csrftoken);
        if (startImmediate) setStartDownload(true);
      })
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
        "Content-Type": "application/json",
      };
      const body = {
        files: fileIds,
        directories: directories,
      };
      const options = {
        method: "POST",
        credentials: "include",
        headers: headers,
        body: JSON.stringify(body),
      };

      fetch(get_download_zip, options)
        .then((res) => res.json())
        .then((data) => {
          const { key } = data;
          window.open(
            `https://localhost:3001/app/downloadItems?key=${key}&dl=1`,
            "_parent"
          );
          setDownload(false);
        })
        .catch((err) => console.error(err));

      // (async () => {
      //   let rs_src = fetch(downloadItemsURL, options).then(async (response) => {
      //     console.log(response.body);
      //     return response.body;
      //   });

      //   // create writable stream for file
      //   const opts = {
      //     suggestedName: "QDrive.zip",
      //     types: [
      //       {
      //         description: "Zip Files",
      //         accept: {
      //           "application/zip": [".zip"],
      //         },
      //       },
      //     ],
      //   };
      //   let ws_dest = window.showSaveFilePicker(opts).then((handle) => {
      //     setOpen(true);
      //     return handle.createWritable();
      //   });

      //   // create transform stream for decryption
      //   let ts_dec = new TransformStream({
      //     async transform(chunk, controller) {
      //       controller.enqueue(chunk);
      //     },
      //   });
      //   // stream cleartext to file
      //   let rs_clear = rs_src.then((s) => s.pipeThrough(ts_dec));
      //   return (await rs_clear).pipeTo(await ws_dest);
      // })().then(() => setOpen(false));
    }
  }, [startDownload, CSRFToken]);
  return (
    <>
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
      <Snackbar
        open={open}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        onClose={handleClose}
      >
        <SnackbarContent
          message={
            <Box
              sx={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "flex-between",
                alignItems: "center",
              }}
            >
              <CircularProgress />
              <Typography>Downloading...</Typography>
            </Box>
          }
        />
      </Snackbar>
    </>
  );
};

export default React.memo(Download);
