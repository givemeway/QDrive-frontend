import { Box, TextField, Fab, Button, Divider } from "@mui/material";
import UploadFileIcon from "@mui/icons-material/UploadFileRounded";
import DriveFolderUploadIcon from "@mui/icons-material/DriveFolderUploadRounded";

function FileInputButton({ children }) {
  return (
    <Button
      variant="outlined"
      sx={{
        border: "none",
        ":hover": {
          bgcolor: "#EFF3FA",
          border: "none",
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
        {children}
      </label>
    </Button>
  );
}

export default function UploadMenu() {
  return (
    <Box
      display="flex"
      flexDirection="row"
      sx={{ height: 50, background: "#F9F9F9", border: "1px solid #DBDBDB" }}
    >
      <FileInputButton>
        <UploadFileIcon
          fontSize="large"
          color="primary"
          sx={{ cursor: "pointer" }}
        />
      </FileInputButton>
      <Divider orientation="vertical" />
      <FileInputButton>
        <DriveFolderUploadIcon
          fontSize="large"
          color="primary"
          sx={{ cursor: "pointer" }}
        />
      </FileInputButton>
      <Divider orientation="vertical" />
    </Box>
  );
}
