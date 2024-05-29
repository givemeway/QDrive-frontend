import React from "react";
import CreateNewFolderIcon from "./CreateFolder.js";
import FolderUpload from "./FolderUpload.js";
import FilesUpload from "./FileUpload.js";

import { useRecoilValue } from "recoil";
import { tabSelectedAtom } from "../Recoil/Store/atoms.js";

export default React.memo(function UploadMenu() {
  console.log("upload menu rendered");
  const tabSelected = useRecoilValue(tabSelectedAtom);

  return (
    <>
      {tabSelected !== 4 && (
        <div className="flex justify-start items-center h-[80px] gap-2">
          <FolderUpload />
          <FilesUpload />
          <CreateNewFolderIcon />
        </div>
      )}
    </>
  );
});
