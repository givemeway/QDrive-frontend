/* global forge */
/* global axios */
/* global async */
import { Box, Button, Divider, Stack } from "@mui/material";
import React, { useState, useContext } from "react";

import CloudDownloadIcon from "@mui/icons-material/CloudDownloadRounded";
import ShareIcon from "@mui/icons-material/ShareRounded";
import FolderUpload from "./FolderUpload.js";
import FilesUpload from "./FileUpload.js";
import DeleteItems from "./DeleteItems.js";
import DownloadItems from "./Download.js";
import { UploadContext, ItemSelectionContext } from "./Context.js";

function CustomButton({ children }) {
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
    >
      {children}
    </Button>
  );
}

export default React.memo(function UploadMenu() {
  const [upload, setUpload] = useState(null);
  console.log("upload menu rendered");
  const { fileIds, directories } = useContext(ItemSelectionContext);

  return (
    <>
      <Stack sx={{ marginBottom: 0, padding: 0, height: "100%" }}>
        <Box
          display="flex"
          flexDirection="row"
          alignItems="center"
          alignContent="center"
          sx={{
            height: "100%",
            background: "#F9F9F9",
            border: "1px solid #DBDBDB",
            margin: 0,
            padding: 0,
          }}
        >
          <UploadContext.Provider value={upload}>
            <FolderUpload setUpload={setUpload} />
          </UploadContext.Provider>

          <Divider orientation="vertical" />

          <UploadContext.Provider value={upload}>
            <FilesUpload setUpload={setUpload} />
          </UploadContext.Provider>

          <Divider orientation="vertical" />
          {(fileIds.length > 0 || directories.length > 0) && (
            <>
              <DownloadItems />
              <Divider orientation="vertical" />

              <CustomButton>
                <ShareIcon
                  color="primary"
                  sx={{ cursor: "pointer", fontSize: 25 }}
                />
              </CustomButton>
              <Divider orientation="vertical" />
              <DeleteItems />
              <Divider orientation="vertical" />
            </>
          )}
        </Box>
      </Stack>
      {/* <UploadProgressDrawer /> */}
    </>
  );
});
