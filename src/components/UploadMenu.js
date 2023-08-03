import { Box, TextField, Fab, Button, Divider } from "@mui/material";
import UploadFileIcon from "@mui/icons-material/UploadFileRounded";
import DriveFolderUploadIcon from "@mui/icons-material/DriveFolderUploadRounded";
import CloudDownloadIcon from "@mui/icons-material/CloudDownloadRounded";
import DeleteIcon from "@mui/icons-material/DeleteRounded";
import ShareIcon from "@mui/icons-material/ShareRounded";
import { Share } from "@mui/icons-material";

function CustomButton({ children }) {
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
      {children}
    </Button>
  );
}

function InputFileLabel({ children }) {
  return (
    <label
      htmlFor="upload-file"
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        margin: "0px",
        padding: "0px",
      }}
    >
      <input
        style={{ display: "none" }}
        id="upload-file"
        name="upload-file"
        type="file"
        multiple
      />
      {children}
    </label>
  );
}

export default function UploadMenu() {
  return (
    <Box
      display="flex"
      flexDirection="row"
      alignItems="center"
      alignContent="center"
      sx={{ height: 40, background: "#F9F9F9", border: "1px solid #DBDBDB" }}
    >
      <CustomButton>
        <InputFileLabel>
          <UploadFileIcon
            color="primary"
            sx={{ cursor: "pointer", fontSize: 25 }}
          />
        </InputFileLabel>
      </CustomButton>
      <Divider orientation="vertical" />
      <CustomButton>
        <InputFileLabel>
          <DriveFolderUploadIcon
            color="primary"
            sx={{ cursor: "pointer", fontSize: 25 }}
          />
        </InputFileLabel>
      </CustomButton>
      <Divider orientation="vertical" />
      <CustomButton>
        <CloudDownloadIcon
          color="primary"
          sx={{ cursor: "pointer", fontSize: 25 }}
        />
      </CustomButton>
      <Divider orientation="vertical" />
      <CustomButton>
        <ShareIcon color="primary" sx={{ cursor: "pointer", fontSize: 25 }} />
      </CustomButton>
      <Divider orientation="vertical" />
      <CustomButton>
        <DeleteIcon color="primary" sx={{ cursor: "pointer", fontSize: 25 }} />
      </CustomButton>
      <Divider orientation="vertical" />
    </Box>
  );
}
