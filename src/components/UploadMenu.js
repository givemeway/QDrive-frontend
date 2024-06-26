import { Box, Divider, Stack } from "@mui/material";
import React, { useState, useContext } from "react";

// import CreateNewFolderIcon from "@mui/icons-material/CreateNewFolder";
import CreateNewFolderIcon from "./CreateFolder.js";
import FolderUpload from "./FolderUpload.js";
import FilesUpload from "./FileUpload.js";
import DeleteItems from "./DeleteItems.js";
import DownloadItems from "./DownloadItems.js";
import {
  UploadContext,
  ItemSelectionContext,
  PanelContext,
} from "./UseContext.js";
import Share from "./Share.js";
import MoveItems from "./MoveItems.js";
import RenameItem from "./RenameItem.js";
import CopyItems from "./CopyItems.js";
import { useRecoilState, useRecoilValue } from "recoil";
import {
  itemsSelectedAtom,
  tabSelectedAtom,
  uploadAtom,
} from "../Recoil/Store/atoms.js";

export default React.memo(function UploadMenu() {
  const [upload, setUpload] = useRecoilState(uploadAtom);
  console.log("upload menu rendered");
  const { fileIds, directories } = useRecoilValue(itemsSelectedAtom);
  const tabSelected = useRecoilValue(tabSelectedAtom);

  return (
    <Stack sx={{ marginBottom: 0, padding: 0, height: "100%" }}>
      {tabSelected != 4 && (
        <Box
          display="flex"
          flexDirection="row"
          alignItems="center"
          alignContent="center"
          sx={{
            height: "100%",
            background: "#F9F9F9",
            border: "1px solid #DBDBDB",
            boxSizing: "border-box",
            borderLeft: "none",
            margin: 0,
            padding: 0,
          }}
        >
          {/* <UploadContext.Provider value={upload}> */}
          <FolderUpload />
          {/* </UploadContext.Provider> */}

          <Divider orientation="vertical" />

          {/* <UploadContext.Provider value={upload}> */}
          <FilesUpload />
          {/* </UploadContext.Provider> */}
          <Divider orientation="vertical" />

          <CreateNewFolderIcon />

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
      )}
      {tabSelected == 4 && <Box></Box>}
    </Stack>
  );
});
