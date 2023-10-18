import React, { useContext } from "react";
import { Button } from "@mui/material";
import CloudDownloadIcon from "@mui/icons-material/CloudDownloadRounded";

import { ItemSelectionContext } from "./UseContext";

import useDownload from "./hooks/DownloadItemsHook";

const Download = () => {
  const { fileIds, directories } = useContext(ItemSelectionContext);
  const [initDownload] = useDownload(fileIds, directories);

  console.log("download items rendered");

  const handleClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    initDownload();
  };

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
    </>
  );
};

export default React.memo(Download);
