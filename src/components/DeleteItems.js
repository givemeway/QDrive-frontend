/*global axios */

import React, { useEffect, useState, useContext } from "react";
import { Button } from "@mui/material";
import DeleteIcon from "@mui/icons-material/DeleteRounded";
import { deleteItemsURL, csrftokenURL } from "../config";
import { ItemSelectionContext } from "./Context";

async function fetchCSRFToken(csrfurl) {
  const response = await fetch(csrfurl);
  const { CSRFToken } = await response.json();
  return CSRFToken;
}

const DeleteItems = () => {
  const [CSRFToken, setCSRFToken] = useState("");
  const { fileIds, directories } = useContext(ItemSelectionContext);
  const [isDeleting, setIsDeleting] = useState(false);
  console.log("delete item rendered");
  useEffect(() => {
    fetchCSRFToken(csrftokenURL)
      .then((csrftoken) => setCSRFToken(csrftoken))
      .catch((err) => console.log(err));
  }, []);

  const handleClick = (e) => {
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
  return (
    <Button
      onClick={handleClick}
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
  );
};

export default React.memo(DeleteItems);
