import { Button, Box, Typography } from "@mui/material";
import React from "react";
import FolderExplorer from "./FolderExplorer";

const style = {
  display: "flex",
  flexDirection: "column",
  justifyContent: "space-between",
  width: "100%",
  height: 400,
  bgcolor: "background.paper",
  border: "none",
  boxSizing: "border-box",
};

const Tab = ({ children }) => {
  return (
    <Button
      sx={{
        color: "#886C64",
        fontSize: 20,
        paddingLeft: 3,
        backgroundColor: "#F7F5F2",
        textTransform: "none",
        "&:hover": {
          backgroundColor: "transparent",
          opacity: [0.9, 0.8, 0.7],
        },
        display: "block",
        textAlign: "left",
      }}
      fullWidth
      disableRipple
    >
      {children}
    </Button>
  );
};

const Panel = ({ nav, setNav }) => {
  console.log("side panel rendered");
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
      <Typography component="h3" variant="h3" mt={5} mb={8}>
        QDrive
      </Typography>
      <Tab>All Files</Tab>
      <Box sx={style}>
        <FolderExplorer nav={nav} setNav={setNav} />
      </Box>
      <Tab>Photos</Tab>
      <Tab>Shared</Tab>
      <Tab>Deleted Files</Tab>
    </Box>
  );
};

export default React.memo(Panel);
