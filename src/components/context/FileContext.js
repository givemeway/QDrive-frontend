import { Stack, Button } from "@mui/material";
import DriveFileMoveIcon from "@mui/icons-material/DriveFileMove";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import DriveFileRenameOutlineIcon from "@mui/icons-material/DriveFileRenameOutline";
import DeleteIcon from "@mui/icons-material/DeleteRounded";
import ShareIcon from "@mui/icons-material/ShareRounded";
import CloudDownloadIcon from "@mui/icons-material/CloudDownloadRounded";
import useOutSideClick from "../useOutsideClick";

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

const FileSelectionOverlayMenu = ({
  moveItems,
  copyItems,
  handleClose,
  coords,
  setDownload,
  reference,
  setShare,
}) => {
  useOutSideClick(reference, () => {
    handleClose();
  });

  return (
    <Stack
      sx={{ ...overlayStyle, top: coords.y, left: coords.x, gap: 0 }}
      ref={reference}
    >
      <Button
        sx={overlayButtonStyle}
        variant="text"
        onClick={() => {
          moveItems();
          handleClose();
        }}
      >
        <DriveFileMoveIcon />
        Move
      </Button>
      <Button
        sx={overlayButtonStyle}
        variant="text"
        onClick={() => {
          copyItems();
          handleClose();
        }}
      >
        <ContentCopyIcon />
        Copy
      </Button>
      <Button sx={overlayButtonStyle} variant="text" onClick={handleClose}>
        <DriveFileRenameOutlineIcon />
        Rename
      </Button>
      <Button
        sx={overlayButtonStyle}
        variant="text"
        onClick={() => {
          handleClose();
          setShare(true);
        }}
      >
        <ShareIcon />
        Share
      </Button>
      <Button sx={overlayButtonStyle} variant="text" onClick={handleClose}>
        <DeleteIcon />
        Delete
      </Button>
      <Button
        sx={overlayButtonStyle}
        variant="text"
        onClick={() => {
          setDownload(true);
          handleClose();
        }}
      >
        <CloudDownloadIcon />
        Download
      </Button>
    </Stack>
  );
};

export default FileSelectionOverlayMenu;
