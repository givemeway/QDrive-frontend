import { Box, Divider, Stack } from "@mui/material";
import React, { useState, useContext } from "react";

import CreateNewFolderIcon from "@mui/icons-material/CreateNewFolder";
import FolderUpload from "./FolderUpload.js";
import FilesUpload from "./FileUpload.js";
import DeleteItems from "./DeleteItems.js";
import DownloadItems from "./DownloadItems.js";
import { UploadContext, ItemSelectionContext } from "./Context.js";
import Share from "./Share.js";
import MoveItems from "./MoveItems.js";
import RenameItem from "./RenameItem.js";
import CopyItems from "./CopyItems.js";

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

          <CreateNewFolderIcon
            color="primary"
            sx={{ cursor: "pointer", fontSize: 25 }}
          />

          <Divider orientation="vertical" />
          {(fileIds.length > 0 || directories.length > 0) && (
            <>
              <DownloadItems />
              <Divider orientation="vertical" />
              <MoveItems />
              <Divider orientation="vertical" />
              {fileIds.length + directories.length === 1 && <RenameItem />}
              {fileIds.length + directories.length === 1 && (
                <Divider orientation="vertical" />
              )}
              <CopyItems />
              <Divider orientation="vertical" />
              <Share />
              <Divider orientation="vertical" />
              <DeleteItems />
              <Divider orientation="vertical" />
              <Divider orientation="vertical" />
            </>
          )}
        </Box>
      </Stack>
      {/* <UploadProgressDrawer /> */}
    </>
  );
});
