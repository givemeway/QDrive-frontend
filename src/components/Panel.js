import { Stack, Button, Box, Grid } from "@mui/material";
import { textAlign } from "@mui/system";

const Panel = () => {
  return (
    <Box
      display="flex"
      flexDirection="column"
      justifyContent="flex-start"
      alignItems="flex-start"
      rowGap={0}
      sx={{
        width: 300,
        height: "100vh",
        backgroundColor: "primary.dark",
      }}
    >
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
        Cloud Backup
      </Button>
      <Button
        alignItems="center"
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
        Cloud Storage
      </Button>
    </Box>
  );
};

export default Panel;
