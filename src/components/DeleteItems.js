/*global axios */

import React, { useEffect, useState, useContext } from "react";
import { Button } from "@mui/material";
import DeleteIcon from "@mui/icons-material/DeleteRounded";
import { deleteItemsURL, csrftokenURL, filesFoldersURL } from "../config";
import {
  ItemSelectionContext,
  UploadFolderContenxt,
  SnackBarContext,
} from "./Context";

import { useParams } from "react-router-dom";

async function fetchCSRFToken(csrfurl) {
  const response = await fetch(csrfurl);
  const { CSRFToken } = await response.json();
  return CSRFToken;
}

const DeleteItems = () => {
  const [CSRFToken, setCSRFToken] = useState("");
  const { fileIds, directories } = useContext(ItemSelectionContext);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isDeleted, setIsDeleted] = useState(false);
  const { setData } = useContext(UploadFolderContenxt);
  const { setItemDeletion } = useContext(SnackBarContext);
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
    setItemDeletion((prev) => ({
      ...prev,
      isDeleting: true,
      isOpen: true,
      total: fileIds.length + directories.length,
    }));
    setIsDeleting(true);
    setIsDeleted(false);
  };

  useEffect(() => {
    const path = subpath.split("/");
    if (path[0] === "home" && isDeleted) {
      let homedir;
      let curDir;
      console.log("inside delete component after deletion");
      if (path.length === 1) {
        homedir = "/";
        curDir = "/";
      } else {
        curDir = path.slice(2).join("/");

        if (curDir.length === 0) {
          curDir = "/";
        }
        homedir = path[1];
      }
      const headers = {
        "X-CSRF-Token": CSRFToken,
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
      fetch(filesFoldersURL + "/", options)
        .then((res) => res.json())
        .then((data) => {
          setData(() => {
            return data;
          });
        })
        .catch((err) => console.log(err));
    }
  }, [isDeleted]);

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
      setIsDeleted(false);
      (async () => {
        const res = await axios.post(deleteItemsURL, body, {
          headers: headers,
        });
        setItemDeletion((prev) => ({
          ...prev,
          isDeleting: false,
          itemsFailed: res.data.files.length + res.data.folders.length,
          itemsDeleted: fileIds.length + directories.length,
        }));
        setIsDeleted(true);
        setIsDeleting(false);
      })();
    }
  }, [isDeleting]);

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
    </>
  );
};

export default React.memo(DeleteItems);
