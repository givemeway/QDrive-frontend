import DriveFileMoveIcon from "@mui/icons-material/DriveFileMove";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import DriveFileRenameOutlineIcon from "@mui/icons-material/DriveFileRenameOutline";
import DeleteIcon from "@mui/icons-material/DeleteRounded";
import ShareIcon from "@mui/icons-material/ShareRounded";
import CloudDownloadIcon from "@mui/icons-material/CloudDownloadRounded";
import InfoIcon from "@mui/icons-material/Info";

import { ContextButton } from "../Buttons/ContextButton";
import ContextModal from "../Modal/ContextMenuModal";
import { useDispatch, useSelector } from "react-redux";
import { setOperation } from "../../features/operation/operationSlice";
import { MOVE, COPY, SHARE, DELETE, DOWNLOAD } from "../../config";
import { setEdit } from "../../features/rename/renameSlice";
import { useRecoilValue } from "recoil";
import { itemsSelectedAtom } from "../../Recoil/Store/atoms";
import { useEffect, useState } from "react";
import { setFileDetails } from "../../features/itemdetails/fileDetails.Slice";
import { get_url } from "../../util";

const TableContextMenu = ({ style, open, onClose, buttonRef }) => {
  const { fileIds, directories } = useRecoilValue(itemsSelectedAtom);
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
  const rename = useSelector((state) => state.rename);
  const dispatch = useDispatch();
  const handleCopy = () => {
    dispatch(
      setOperation({
        ...operation,
        type: COPY,
        open: true,
      })
    );
    onClose();
  };
  const handleMove = () => {
    dispatch(
      setOperation({
        ...operation,
        type: MOVE,
        open: true,
      })
    );
    onClose();
  };
  const handleShare = () => {
    dispatch(setOperation({ ...operation, type: SHARE, open: true }));
    onClose();
  };
  const handleRename = () => {
    dispatch(setEdit({ ...rename, mode: "edit", editStart: true }));
    onClose();
  };
  const handleDelete = () => {
    dispatch(setOperation({ ...operation, type: DELETE, open: true }));
    onClose();
  };
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
  const ItemSelected = () => {
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
          <p className="w-full  text-md text-left font-sans font-semibold text-ellipsis">
            {directories[0].folder}
          </p>
        </div>
      );
    } else {
      return (
        <div className="flex border-b justify-center items-center p-2 w-full h-40px">
          <p className="w-full  text-md text-left font-sans font-semibold">
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
        <ItemSelected />
        <ContextButton onClick={handleMove}>
          <DriveFileMoveIcon />
          Move
        </ContextButton>
        <ContextButton onClick={handleCopy}>
          <ContentCopyIcon />
          Copy
        </ContextButton>
        {!selectionType.multiple && (
          <ContextButton onClick={handleRename}>
            <DriveFileRenameOutlineIcon />
            Rename
          </ContextButton>
        )}
        <ContextButton onClick={handleShare}>
          <ShareIcon />
          Share
        </ContextButton>
        <ContextButton onClick={handleDelete}>
          <DeleteIcon />
          Delete
        </ContextButton>
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

export default TableContextMenu;
