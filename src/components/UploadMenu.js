import { Box, Divider, Stack } from "@mui/material";
import React from "react";
import CreateNewFolderIcon from "./CreateFolder.js";
import FolderUpload from "./FolderUpload.js";
import FilesUpload from "./FileUpload.js";
import DeleteItems from "./DeleteItems.js";
import DownloadItems from "./DownloadItems.js";

import Share from "./Share.js";
import MoveItems from "./MoveItems.js";
import RenameItem from "./RenameItem.js";
import CopyItems from "./CopyItems.js";
import { useRecoilValue } from "recoil";
import { itemsSelectedAtom, tabSelectedAtom } from "../Recoil/Store/atoms.js";

export default React.memo(function UploadMenu() {
  console.log("upload menu rendered");
  const { fileIds, directories } = useRecoilValue(itemsSelectedAtom);
  const tabSelected = useRecoilValue(tabSelectedAtom);

  return (
    <div className="h-full w-full">
      {tabSelected !== 4 && (
        <div className="flex flex-row justify-start items-center h-full bg-[#F9F9F9] border box-border m-0 p-0">
          <FolderUpload />
          <Divider orientation="vertical" />
          <FilesUpload />
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
            </>
          )}
        </div>
      )}
      {tabSelected === 4 && <Box></Box>}
    </div>
  );
});
