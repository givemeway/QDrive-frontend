import { Stack, Button, Box, Grid, Typography } from "@mui/material";
import React from "react";

const Tab = ({ children }) => {
  return (
    <Button
      sx={{
        color: "primary.contrastText",
        backgroundColor: "primary.dark",
        "&:hover": {
          backgroundColor: "primary.light",
          opacity: [0.9, 0.8, 0.7],
        },
        display: "block",
        textAlign: "left",
      }}
      fullWidth
    >
      {children}
    </Button>
  );
};

const Panel = () => {
  console.log("side panel rendered");
  return (
    <Box
      display="flex"
      flexDirection="column"
      justifyContent="flex-start"
      alignItems="flex-start"
      rowGap={0}
      sx={{
        width: "100%",
        height: "100vh",
        backgroundColor: "primary.dark",
      }}
    >
      <Typography component="h3" variant="h3" mt={5} mb={8}>
        QDrive
      </Typography>
      <Tab>Cloud Backup</Tab>
      <Tab>Cloud Drive</Tab>
    </Box>
  );
};

export default React.memo(Panel);
