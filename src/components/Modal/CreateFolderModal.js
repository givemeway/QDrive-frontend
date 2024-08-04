import {
  Modal,
  Box,
  Fade,
  Backdrop,
  Stack,
  Typography,
  IconButton,
  Divider,
  TextField,
} from "@mui/material";
import { useEffect, useState } from "react";
import FolderIcon from "../icons/FolderIcon";
import { svgIconStyle } from "../fileFormats/FileFormat";
import CloseIcon from "@mui/icons-material/Close";
import { useNavigate } from "react-router";
import { GreyButton } from "../Buttons/GreyButton";
import { CustomBlueButton } from "../Buttons/BlueButton";
import { useParams } from "react-router-dom";
import { useCreateFolderMutation } from "../../features/api/apiSlice";
import { useDispatch, useSelector } from "react-redux";
import { setNotify } from "../../features/notification/notifySlice";

const mainContainerStyle = {
  position: "absolute",
  display: "flex",
  flexDirection: "column",
  justifyContent: "space-between",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 450,
  height: 250,
  bgcolor: "background.paper",
  border: "2px solid #737373",
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

export default function CreateFolderModal({ open, setOpen }) {
  const [text, setText] = useState("");
  const params = useParams();
  const subpath = params["*"];
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [createFolderQuery, createFolderStatus] = useCreateFolderMutation();
  const { CSRFToken } = useSelector((state) => state.csrfToken);
  const { isLoading, isSuccess, isError, error } = createFolderStatus;

  const handleChange = (e) => {
    setText(() => e.target.value);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleCreate = () => {
    if (text !== "" && CSRFToken) {
      const data = { CSRFToken, subpath, folder: text };
      createFolderQuery(data);
    }
  };

  useEffect(() => {
    if (isSuccess) {
      dispatch(
        setNotify({
          show: true,
          msg: "Folder Created",
          severity: "success",
        })
      );
      navigate(subpath + `/${text}`);
      setOpen(false);
    }
    if (isError && error?.status === 409) {
      dispatch(
        setNotify({
          show: true,
          msg: `Folder ${text} exists!`,
          severity: "warning",
        })
      );

      setOpen(false);
    }
    if (isError && (error?.status === 401 || error?.status === 403)) {
      dispatch(
        setNotify({
          show: true,
          msg: error?.data?.msg,
          severity: "error",
        })
      );

      setOpen(false);
    }
    if (isError && error?.originalStatus === 500) {
      dispatch(
        setNotify({
          show: true,
          msg: "Something Went wrong try again",
          severity: "error",
        })
      );

      setOpen(false);
    }
  }, [isError, isSuccess, error, isLoading]);

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
                <GreyButton
                  text={"Cancel"}
                  onClick={handleClose}
                  style={{ width: "75px", height: "40px" }}
                />

                <CustomBlueButton
                  text={"Create"}
                  onClick={handleCreate}
                  style={{ width: "75px", height: "40px" }}
                />
              </Box>
            </Stack>
          </Box>
        </Fade>
      </Modal>
    </>
  );
}
