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
import { useNavigate, useParams, Navigate } from "react-router-dom";

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
  const [failed, setFailed] = useState({ files: [], folders: [] });
  const navigate = useNavigate();
  const params = useParams();
  const subpath = params["*"];
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
    setOpen(true);
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
        navigate(0);
        console.log(res.data);
        setFailed(res.data);
        setIsDeleting(false);
      })();
    }
  }, [isDeleting]);

  const handleClose = (e, reason) => {
    setOpen(false);
  };

  const action = (
    <React.Fragment>
      {!isDeleting && (
        <>
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
          </IconButton>{" "}
        </>
      )}
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

      <Snackbar
        open={open}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        onClose={handleClose}
        action={action}
        message={
          <Box
            display="flex"
            flexDirection="row"
            alignItems="center"
            justifyContent="flex-start"
            gap={2}
          >
            {isDeleting && <CircularProgress />}
            {isDeleting && (
              <Typography>
                Deleting {fileIds.length + directories.length} items
              </Typography>
            )}
            {!isDeleting && (
              <>
                <Typography>
                  Deleted {fileIds.length + directories.length} items
                </Typography>
                {failed.files.length > 0 ||
                  (failed.folders.length > 0 && (
                    <Typography>
                      Deletion Failed for {failed.files + failed.folders} items
                    </Typography>
                  ))}
              </>
            )}
          </Box>
        }
      ></Snackbar>
    </>
  );
};

export default React.memo(DeleteItems);
