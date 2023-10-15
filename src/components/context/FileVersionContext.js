import { Stack, Button } from "@mui/material";
import DriveFileMoveIcon from "@mui/icons-material/DriveFileMove";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import DriveFileRenameOutlineIcon from "@mui/icons-material/DriveFileRenameOutline";
import DeleteIcon from "@mui/icons-material/DeleteRounded";
import ShareIcon from "@mui/icons-material/ShareRounded";
import CloudDownloadIcon from "@mui/icons-material/CloudDownloadRounded";
import useOutSideClick from "../useOutsideClick";
import InfoIcon from "@mui/icons-material/Info";
import { ItemSelectionContext, RightClickContext } from "../Context";
import { useContext, useEffect } from "react";
import useDownload from "../hooks/DownloadItemsHook";
import useInitRename from "../hooks/InitRenameItemHook";

const MOVE = "move";
const COPY = "copy";

const overlayStyle = {
  position: "absolute",
  display: "flex",
  flexDirection: "column",
  background: "#FFFFFF",
  border: "1px solid #CCCCCC",
  boxSizing: "border-box",
  zIndex: 100,
  width: 150,
};
const overlayButtonStyle = {
  textDecoration: "none",
  textTransform: "none",
  display: "flex",
  flexDirection: "row",
  justifyContent: "flex-start",
  gap: 2,
  alignItems: "center",
  fontSize: "1.1rem",
  color: "rgb(128, 128, 128)",
  "&:hover": { backgroundColor: "#F5EFE5" },
  width: "100%",
};

const FileVersionSelectionOverlayMenu = () => {
  const {
    setOpenContext,
    setOpen,
    setMode,
    setActivity,
    coords,
    setShare,
    ref,
    setEdit,
  } = useContext(RightClickContext);

  const { fileIds, directories } = useContext(ItemSelectionContext);
  const [initDownload, isDownload] = useDownload(fileIds, directories);
  const [initRename] = useInitRename(setEdit);

  useOutSideClick(ref, () => {
    setOpenContext(null);
  });

  const handleDownload = () => {
    initDownload();
  };

  const handleRename = () => {
    initRename();
    setOpenContext(null);
  };

  useEffect(() => {
    if (isDownload) {
      setOpenContext(null);
    }
  }, [isDownload, setOpenContext]);

  useOutSideClick(ref, () => {
    setOpenContext(null);
  });

  return (
    <Stack
      sx={{ ...overlayStyle, top: coords.y, left: coords.x, gap: 0 }}
      ref={ref}
    >
      <Button
        sx={overlayButtonStyle}
        variant="text"
        onClick={() => {
          setOpen(true);
          setMode(MOVE);
          setOpenContext(null);
        }}
      >
        <DriveFileMoveIcon />
        Move
      </Button>
      <Button
        sx={overlayButtonStyle}
        variant="text"
        onClick={() => {
          setOpen(true);
          setMode(COPY);
          setOpenContext(null);
        }}
      >
        <ContentCopyIcon />
        Copy
      </Button>
      <Button sx={overlayButtonStyle} variant="text" onClick={handleRename}>
        <DriveFileRenameOutlineIcon />
        Rename
      </Button>
      <Button
        sx={overlayButtonStyle}
        variant="text"
        onClick={() => {
          setOpenContext(null);
          setShare(true);
        }}
      >
        <ShareIcon />
        Share
      </Button>
      <Button
        sx={overlayButtonStyle}
        variant="text"
        onClick={() => setOpenContext(null)}
      >
        <DeleteIcon />
        Delete
      </Button>
      <Button sx={overlayButtonStyle} variant="text" onClick={handleDownload}>
        <CloudDownloadIcon />
        Download
      </Button>
      <Button
        sx={overlayButtonStyle}
        variant="text"
        onClick={() => {
          setActivity(true);
          setOpenContext(null);
        }}
      >
        <InfoIcon />
        File Info
      </Button>
    </Stack>
  );
};

export default FileVersionSelectionOverlayMenu;
