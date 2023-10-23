import { Button, Box, Typography } from "@mui/material";
import React, { useState, useEffect, useContext } from "react";
import FolderExplorer from "./FolderExplorer";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import useFetchDeletedItems from "./hooks/FetchDeletedItems";
import { PanelContext, UploadFolderContenxt } from "./UseContext";
import { useNavigate } from "react-router-dom";

const style = {
  display: "flex",
  flexDirection: "column",
  justifyContent: "space-between",
  width: "100%",
  height: 250,
  bgcolor: "background.paper",
  border: "none",
  boxSizing: "border-box",
};

const tabStyle = {
  color: "#886C64",
  width: "100%",
  fontSize: 20,
  paddingLeft: 3,
  backgroundColor: "#F7F5F2",
  textTransform: "none",
  "&:hover": {
    backgroundColor: "transparent",
    opacity: [0.9, 0.8, 0.7],
  },
  display: "flex",
  flexDirection: "row",
  justifyContent: "flex-start",
  textAlign: "left",
};

const Tab = ({ children }) => {
  return (
    <Button sx={tabStyle} fullWidth disableRipple>
      {children}
    </Button>
  );
};

const Panel = () => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const { setTabSelected } = useContext(PanelContext);

  console.log("side panel rendered");
  const handleClick = () => {
    setOpen((prev) => !prev);
  };
  const handleAllFiles = () => {
    navigate("/dashboard/home");
    setTabSelected(1);
  };

  const handleDeleted = () => {
    navigate("/dashboard/deleted");
    setTabSelected(4);
  };

  return (
    <Box
      display="flex"
      flexDirection="column"
      justifyContent="flex-start"
      alignItems="flex-start"
      rowGap={0}
      sx={{
        width: 240,
        height: "100vh",
        backgroundColor: "#F7F5F2",
        borderRight: "1px solid #D4D2D0",
        boxSizing: "border-box",
      }}
    >
      <Typography component="h3" variant="h3" mt={5} mb={8} ml={2}>
        QDrive
      </Typography>

      <Tab>
        {!open && (
          <ChevronRightIcon
            fontSize="medium"
            sx={{
              position: "absolute",
              left: 0,
              "&:hover": {
                backgroundColor: "#ECE1CE",
                opacity: [0.9, 0.8, 0.7],
              },
            }}
            onClick={handleClick}
          />
        )}
        {open && (
          <ExpandMoreIcon
            fontSize="medium"
            sx={{
              position: "absolute",
              left: 0,
              "&:hover": {
                backgroundColor: "#ECE1CE",
                opacity: [0.9, 0.8, 0.7],
              },
            }}
            onClick={handleClick}
          />
        )}
        <Typography sx={{ fontSize: 20 }} onClick={handleAllFiles}>
          All Files
        </Typography>
      </Tab>
      {open && (
        <Box sx={style}>
          <FolderExplorer />
        </Box>
      )}
      <Tab>Photos</Tab>
      <Tab>Shared</Tab>
      <Tab>
        <Typography sx={{ fontSize: 20 }} onClick={handleDeleted}>
          Deleted Files
        </Typography>
      </Tab>
    </Box>
  );
};

export default React.memo(Panel);
