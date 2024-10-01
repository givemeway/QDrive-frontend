import CloudDownloadIcon from "@mui/icons-material/CloudDownloadRounded";
import InfoIcon from "@mui/icons-material/Info";

import { ContextButton } from "../Buttons/ContextButton";
import ContextModal from "../Modal/ContextMenuModal";
import { useDispatch, useSelector } from "react-redux";
import { setOperation } from "../../features/operation/operationSlice";
import { DOWNLOAD } from "../../config";
import { useRecoilValue } from "recoil";
import { itemsSelectedAtom } from "../../Recoil/Store/atoms";
import { useEffect, useState } from "react";
import { setFileDetails } from "../../features/itemdetails/fileDetails.Slice";
import { get_url } from "../../util";

const ShareTableContextMenu = ({ style, open, onClose, buttonRef }) => {
  //   const { fileIds, directories } = useRecoilValue(itemsSelectedAtom);
  const { fileIds, directories } = useSelector((state) => state.selected);

  const [selectionType, setSelectionType] = useState({
    file: undefined,
    folder: undefined,
    multiple: undefined,
  });

  useEffect(() => {
    if (fileIds.length === 1 && directories.length === 0) {
      setSelectionType({ file: true, folder: false, multiple: false });
    } else if (fileIds.length === 0 && directories.length === 1) {
      setSelectionType({ file: false, folder: true, multiple: false });
    } else {
      setSelectionType({ file: false, folder: false, multiple: true });
    }
  }, [fileIds, directories]);

  const operation = useSelector((state) => state.operation);
  const dispatch = useDispatch();

  const handleDownload = () => {
    if (selectionType.file) {
      const { file, device, dir, id } = fileIds[0];
      const fileData = { filename: file, directory: dir, device, uuid: id };
      const url = get_url(fileData);
      window.open(url, "_parent");
    } else if (selectionType.folder || selectionType.multiple) {
      dispatch(
        setOperation({
          ...operation,
          type: DOWNLOAD,
          status: "initialized",
          data: { files: fileIds, directories: directories },
        })
      );
    }
    onClose();
  };

  const handleFileInfo = () => {
    dispatch(setFileDetails({ open: true, file: fileIds[0] }));
    onClose();
  };
  const ItemSelected = ({ fileIds, directories }) => {
    const total = fileIds.length + directories.length;
    if (fileIds.length === 1 && directories.length === 0) {
      return (
        <div className="flex border-b justify-center items-center p-2 w-full h-40px">
          <p className="w-full  text-md text-left font-sans font-semibold truncate">
            {fileIds[0].file}
          </p>
        </div>
      );
    }
    if (fileIds.length === 0 && directories.length === 1) {
      return (
        <div className="flex border-b justify-center items-center p-2 w-full h-40px">
          <p className="w-full  text-md text-left font-sans font-semibold truncate">
            {directories[0].folder}
          </p>
        </div>
      );
    } else {
      return (
        <div className="flex border-b justify-center items-center p-2 w-full h-40px">
          <p className="w-full  text-md text-left font-sans font-semibold truncate">
            {total} selected
          </p>
        </div>
      );
    }
  };
  return (
    <>
      <ContextModal
        style={style}
        open={open}
        onClose={onClose}
        buttonRef={buttonRef}
      >
        <ItemSelected fileIds={fileIds} directories={directories} />

        <ContextButton onClick={handleDownload}>
          <CloudDownloadIcon />
          Download
        </ContextButton>
        {!selectionType.multiple && selectionType.file && (
          <ContextButton onClick={handleFileInfo}>
            <InfoIcon />
            File Info
          </ContextButton>
        )}
      </ContextModal>
    </>
  );
};

export default ShareTableContextMenu;
