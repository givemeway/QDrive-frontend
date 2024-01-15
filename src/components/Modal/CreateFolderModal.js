import {
  Modal,
  Box,
  Button,
  Fade,
  Backdrop,
  Stack,
  Typography,
  IconButton,
  Divider,
  TextField,
} from "@mui/material";
import { useContext, useEffect, useState } from "react";
import FolderIcon from "../icons/FolderIcon";
import { svgIconStyle } from "../fileFormats/FileFormat";
import CloseIcon from "@mui/icons-material/Close";
import { useConstant } from "@react-spring/shared";
import { NotificationContext, PathContext } from "../UseContext";
import useCreateFolder from "../hooks/CreateFolderHook";
import { useNavigate } from "react-router";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { snackBarAtom, subpathAtom } from "../../Recoil/Store/atoms";

const mainContainerStyle = {
  position: "absolute",
  display: "flex",
  flexDirection: "column",
  justifyContent: "space-between",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 450,
  height: 200,
  bgcolor: "background.paper",
  border: "2px solid #737373",
  //   boxShadow: 10,
  margin: 0,
  padding: 0,
  p: 4,
};

const rowFlex = {
  display: "flex",
  flexDirection: "row",
  alignItems: "center",
  gap: 1,
  justifyContent: "space-between",
};

const colFlex = {
  display: "flex",
  flexDirection: "column",
  alignItems: "flex-start",
  justifyContent: "center",
  gap: 1,
};

const createButtonStyle = {
  background: "#0061FEE0",
  fontWeight: 900,
  color: "#F2F7FF",
  "&:hover": { background: "#0061FE" },
  textTransform: "none",
};

const cancelButtonStyle = {
  background: "#F5EFE5E0",
  color: "#1A1918",
  textTransform: "none",
  width: 75,
  fontWeight: 900,
  "&:hover": { background: "#F5EFE5" },
};

export default function CreateFolderModal({ open, setOpen }) {
  const [text, setText] = useState("");
  const navigate = useNavigate();
  const [create, setCreate] = useState(false);

  // const subpath = useContext(PathContext);
  const subpath = useRecoilValue(subpathAtom);
  // const NotifyStatus = useContext(NotificationContext);
  const NotifyStatus = useSetRecoilState(snackBarAtom);

  const [createFolder, createFolderResponse] = useCreateFolder(subpath);
  const handleChange = (e) => {
    setText(() => e.target.value);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleCreate = () => {
    if (text !== "") {
      setCreate(true);
      createFolder(text);
    }
  };

  useEffect(() => {
    if (create && createFolderResponse?.done && createFolderResponse.success) {
      NotifyStatus(() => ({
        show: true,
        msg: "Folder Created",
        severity: "success",
      }));
      navigate(subpath + `/${text}`);
      setOpen(false);
    } else if (
      create &&
      createFolderResponse?.done &&
      !createFolderResponse.success
    ) {
      if (createFolderResponse?.status === 409) {
        NotifyStatus(() => ({
          show: true,
          msg: `Folder ${text} exists!`,
          severity: "warning",
        }));
      } else {
        NotifyStatus(() => ({
          show: true,
          msg: createFolderResponse.msg,
          severity: "error",
        }));
      }
      setOpen(false);
    }
  }, [createFolderResponse.success, create, createFolderResponse.done]);

  return (
    <>
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        open={open}
        onClose={handleClose}
        closeAfterTransition
        slots={{ backdrop: Backdrop }}
        slotProps={{
          backdrop: {
            timeout: 500,
          },
        }}
      >
        <Fade in={open}>
          <Box sx={mainContainerStyle}>
            <Stack sx={colFlex}>
              <Box sx={{ ...rowFlex, width: "100%" }}>
                <Box
                  sx={{
                    ...rowFlex,
                    justifyContent: "flex-start",
                    width: "100%",
                  }}
                >
                  <FolderIcon
                    style={{
                      ...svgIconStyle,
                      margin: 0,
                      backgroundColor: "transparent",
                      boxShadow: 0,
                      fontSize: 24,
                      margin: -5,
                    }}
                  />
                  <Typography
                    sx={{
                      textAlign: "left",
                      fontWeight: 600,
                      fontSize: 18,
                      color: "#1A1918",
                    }}
                  >
                    Create Folder
                  </Typography>
                </Box>
                <IconButton onClick={handleClose}>
                  <CloseIcon />
                </IconButton>
              </Box>
              <Divider orientation="horizontal" />
              <Box sx={{ ...colFlex, width: "100%", marginTop: 2 }}>
                <Typography align="left">Name</Typography>
                <TextField
                  placeholder={"Folder Name"}
                  onChange={handleChange}
                  value={text}
                  fullWidth
                  size="small"
                ></TextField>
              </Box>
              <Box
                sx={{
                  ...rowFlex,
                  justifyContent: "flex-end",
                  gap: 1,
                  width: "100%",
                }}
              >
                <Button
                  disableRipple
                  variant="contained"
                  sx={cancelButtonStyle}
                  onClick={handleClose}
                >
                  Cancel
                </Button>
                <Button
                  disableRipple
                  variant="contained"
                  sx={createButtonStyle}
                  onClick={handleCreate}
                >
                  Create
                </Button>
              </Box>
            </Stack>
          </Box>
        </Fade>
      </Modal>
    </>
  );
}
