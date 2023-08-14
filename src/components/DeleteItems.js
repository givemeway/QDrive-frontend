/*global axios */

import React, { useEffect, useState, useContext } from "react";
import { Button, SnackbarContent, Typography, Box } from "@mui/material";
import Snackbar from "@mui/material/Snackbar";
import DeleteIcon from "@mui/icons-material/DeleteRounded";
import { deleteItemsURL, csrftokenURL } from "../config";
import { ItemSelectionContext } from "./Context";
import CircularProgress from "@mui/material/CircularProgress";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";

async function fetchCSRFToken(csrfurl) {
  const response = await fetch(csrfurl);
  const { CSRFToken } = await response.json();
  return CSRFToken;
}

const DeleteItems = () => {
  const [CSRFToken, setCSRFToken] = useState("");
  const { fileIds, directories } = useContext(ItemSelectionContext);
  const [isDeleting, setIsDeleting] = useState(false);
  const [open, setOpen] = React.useState(false);

  const handleClick = () => {
    setOpen(true);
  };

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setOpen(false);
  };
  console.log("delete item rendered");
  useEffect(() => {
    fetchCSRFToken(csrftokenURL)
      .then((csrftoken) => setCSRFToken(csrftoken))
      .catch((err) => console.log(err));
  }, []);

  const handleDelete = (e) => {
    e.preventDefault();
    e.stopPropagation();
    console.log(fileIds, directories);
    setIsDeleting(true);
  };

  useEffect(() => {
    if (
      isDeleting &&
      CSRFToken.length > 0 &&
      (fileIds.length > 0 || directories.length > 0)
    ) {
      const headers = {
        "X-CSRF-Token": CSRFToken,
        "Content-Type": "application/x-www-form-urlencoded",
      };
      const body = {
        fileIds: JSON.stringify([...fileIds]),
        directories: JSON.stringify([...directories]),
      };
      (async () => {
        const res = await axios.post(deleteItemsURL, body, {
          headers: headers,
        });
        console.log(res.data);
        setIsDeleting(false);
      })();
    }
  }, [isDeleting]);
  const action = (
    <React.Fragment>
      <Button color="secondary" size="small" onClick={handleClose}>
        UNDO
      </Button>
      <IconButton
        size="small"
        aria-label="close"
        color="inherit"
        onClick={handleClose}
      >
        <CloseIcon fontSize="small" />
      </IconButton>
    </React.Fragment>
  );
  return (
    <>
      <Button
        onClick={handleDelete}
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
      >
        <DeleteIcon color="primary" sx={{ cursor: "pointer", fontSize: 25 }} />
      </Button>
      {isDeleting && (
        <Snackbar
          open={true}
          anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
          onClose={handleClick}
        >
          <SnackbarContent
            message={
              <Box
                display="flex"
                flexDirection="row"
                alignItems="center"
                justifyContent="flex-start"
                gap={2}
              >
                <CircularProgress />
                <Typography>
                  Deleting {fileIds.length} files & {directories.length} folders
                </Typography>
              </Box>
            }
            action={action}
          ></SnackbarContent>
        </Snackbar>
      )}
    </>
  );
};

export default React.memo(DeleteItems);
