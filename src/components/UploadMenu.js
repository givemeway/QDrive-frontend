import { Box, TextField, Fab, Button } from "@mui/material";
import UploadFileIcon from "@mui/icons-material/UploadFileRounded";
import DriveFolderUploadIcon from "@mui/icons-material/DriveFolderUploadRounded";

export default function UploadMenu() {
  return (
    <Box
      display="flex"
      flexDirection="row"
      sx={{ height: 50, background: "#F9F9F9", border: "grey" }}
    >
      <Button
        variant="outlined"
        sx={{
          borderRadius: 0,
          border: "1px solid grey",
          ":hover": {
            bgcolor: "#F0F7FF",
            border: "1px solid #F0F7FF",
          },
        }}
      >
        <label htmlFor="upload-file">
          <input
            style={{ display: "none" }}
            id="upload-file"
            name="upload-file "
            type="file"
            multiple
          />

          <UploadFileIcon fontSize="large" color="primary" />
        </label>
      </Button>
      <Button
        variant="outlined"
        sx={{
          borderRadius: 0,
          border: 0,
          ":hover": {
            bgcolor: "#F0F7FF",
            border: "1px solid #F0F7FF",
          },
        }}
      >
        <label htmlFor="upload-folder">
          <input
            style={{ display: "none" }}
            id="upload-folder"
            name="upload-folder"
            type="file"
            multiple
          />

          <DriveFolderUploadIcon fontSize="large" color="primary" />
        </label>
      </Button>
    </Box>
  );
}
