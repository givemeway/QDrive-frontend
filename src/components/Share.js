import Header from "./HomePageHeader";
import {
  Button,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  ListItemButton,
  Link,
  CircularProgress,
  TextField,
  Stack,
  Snackbar,
} from "@mui/material";
import FolderIcon from "@mui/icons-material/FolderRounded";
import FileOpenIcon from "@mui/icons-material/FileOpenRounded";
import ShareIcon from "@mui/icons-material/ShareRounded";
import { ItemSelectionContext } from "./UseContext";
import { useContext, useRef, useEffect, useState } from "react";
import { csrftokenURL, getShareLinkURL, host } from "../config";
import { Modal, Box, Typography } from "@mui/material";
import { FixedSizeList } from "react-window";
async function fetchCSRFToken(csrfurl) {
  const response = await fetch(csrfurl);
  const { CSRFToken } = await response.json();
  return CSRFToken;
}

export default function Share({ shareImmediate }) {
  const { fileIds, directories } = useContext(ItemSelectionContext);
  console.log(fileIds, directories);
  const [type, setType] = useState("");
  const [CSRFToken, setCSRFToken] = useState("");
  const [shareURL, setShareURL] = useState("");
  const [share, setShare] = useState(false);
  const [isGenerating, setIsGenerating] = useState(0);
  const [open, setOpen] = useState(false);
  const [snackbarOpen, setsnakbarOpen] = useState(false);
  const handleClose = () => setOpen(false);
  const items = useRef([]);

  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    overflow: "auto",
    bgcolor: "background.paper",
    border: "2px solid #6EA5CE",
    boxShadow: 24,
    p: 4,
  };

  function renderRows(props) {
    const { index, style } = props;

    return (
      <ListItem
        style={style}
        key={items.current[index].id}
        component="div"
        disablePadding
      >
        <ListItemIcon>
          {items.current[index].type === "file" && (
            <FileOpenIcon sx={{ color: "#A1C9F7", fontSize: 30 }} />
          )}
          {items.current[index].type === "folder" && (
            <FolderIcon sx={{ color: "#A1C9F7", fontSize: 30 }} />
          )}
        </ListItemIcon>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-start",
            gap: 0,
            alignItems: "flex-start",
          }}
        >
          <ListItemText primary={`${items.current[index].name}`} />
        </Box>
      </ListItem>
    );
  }

  const createShare = () => {
    if (items.current.length === 1) {
      if (items.current[0].type === "file") {
        setType("fi");
        setShare(true);
        setIsGenerating(1);
      } else if (items.current[0].type === "folder") {
        setType("fo");
        setShare(true);
        setIsGenerating(1);
      }
    } else {
      setType("t");
      setShare(true);
      setIsGenerating(1);
    }
  };

  const copyLink = async (txt) => {
    await navigator.clipboard.writeText(txt);
    handleClose();
    setIsGenerating(3);
    setsnakbarOpen(true);
  };

  const showShareWindow = () => {
    setOpen(true);
  };

  useEffect(() => {
    if (shareURL.length > 0) {
      setIsGenerating(2);
    }
  }, [shareURL]);

  useEffect(() => {
    console.log("click triggered");
    items.current = [
      ...fileIds.map((file) => ({
        id: file.id,
        name: file.file,
        type: "file",
      })),
      ...directories.map((folder) => ({
        id: folder.uuid,
        name: folder.folder,
        type: "folder",
      })),
    ];

    fetchCSRFToken(csrftokenURL)
      .then((csrftoken) => {
        if (shareImmediate === true) {
          setOpen(true);
        }
        setCSRFToken(csrftoken);
      })
      .catch((err) => console.log(err));
  }, [directories, fileIds, shareImmediate]);

  useEffect(() => {
    if (share && CSRFToken !== "" && type !== "") {
      const headers = {
        "X-CSRF-Token": CSRFToken,
        "Content-Type": "application/json",
      };
      const body = {
        files: fileIds,
        directories: directories,
      };
      console.log(body);
      const options = {
        method: "POST",
        credentials: "include",
        headers: headers,
        body: JSON.stringify(body),
      };

      fetch(getShareLinkURL + `/?t=${type}`, options)
        .then((res) => res.json())
        .then((data) => {
          const { url } = data;
          setShareURL(url);
          setIsGenerating(2);
          console.log(url, isGenerating);
        })
        .catch((err) => console.error(err));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [share]);

  return (
    <>
      <Button
        onClick={() => showShareWindow()}
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
        <ShareIcon color="primary" sx={{ cursor: "pointer", fontSize: 25 }} />
      </Button>
      {open && (
        <Modal
          open={open}
          onClose={handleClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={style}>
            <Typography variant="h6" component="h2">
              Share
            </Typography>
            <Divider orientation="horizontal" />
            <FixedSizeList
              itemCount={items.current.length}
              itemSize={50}
              height={150}
              width={"100%"}
            >
              {renderRows}
            </FixedSizeList>
            <Divider orientation="horizontal" />
            {isGenerating === 0 && (
              <Link
                variant={"a"}
                onClick={createShare}
                sx={{ cursor: "pointer" }}
                underline="none"
              >
                Create Link
              </Link>
            )}
            {isGenerating === 1 && (
              <Box
                display={"flex"}
                flexDirection={"row"}
                justifyContent={"flex-start"}
                alignItems={"center"}
              >
                <CircularProgress />
                <Typography>Generating Link</Typography>
              </Box>
            )}
            {isGenerating === 2 && shareURL.length > 0 && (
              <Stack>
                <Link
                  variant={"a"}
                  sx={{ cursor: "pointer" }}
                  underline="none"
                  onClick={() => {
                    copyLink(shareURL);
                  }}
                >
                  Copy Link
                </Link>
                <TextField
                  value={shareURL}
                  placeholder={shareURL}
                  variant="outlined"
                  size="small"
                ></TextField>
              </Stack>
            )}
          </Box>
        </Modal>
      )}
      {isGenerating === 3 && (
        <Snackbar
          anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
          autoHideDuration={6000}
          open={snackbarOpen}
          onClose={() => {
            setsnakbarOpen(false);
          }}
          message="Link Copied to Clipboard!"
        />
      )}
    </>
  );
}
