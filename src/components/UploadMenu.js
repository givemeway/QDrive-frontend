import {
  Box,
  TextField,
  Fab,
  Button,
  Divider,
  Stack,
  Typography,
} from "@mui/material";
import UploadFileIcon from "@mui/icons-material/UploadFileRounded";
import DriveFolderUploadIcon from "@mui/icons-material/DriveFolderUploadRounded";
import CloudDownloadIcon from "@mui/icons-material/CloudDownloadRounded";
import DeleteIcon from "@mui/icons-material/DeleteRounded";
import ShareIcon from "@mui/icons-material/ShareRounded";
import { useState, useEffect } from "react";

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
  const [files, setFiles] = useState([]);
  const handleChange = (e) => {
    setFiles(
      Array.from(e.target.files).map((file) => {
        file.modified = false;
        return file;
      })
    );
  };
  useEffect(() => {
    console.log(files);
  }, [files]);
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
        webkitdirectory="true"
        onChange={handleChange}
      />
      {children}
    </label>
  );
}

export default function UploadMenu({ path }) {
  const [pwd, setPWD] = useState("/");
  const [device, setDevice] = useState("/");
  useEffect(() => {
    console.log(pwd, device);
    const subpart = path.split("/").slice(1);

    if (subpart.length === 0) {
      setDevice("/");
      setPWD("/");
    } else {
      setDevice(subpart.slice(0, 1));
      setPWD(subpart.slice(1));
    }
  }, [path]);
  useEffect(() => {
    console.log(pwd);
    console.log(device);
  }, [pwd, device]);
  return (
    <Stack sx={{ marginBottom: 0, padding: 0, height: "100%" }}>
      <Box
        display="flex"
        flexDirection="row"
        alignItems="center"
        alignContent="center"
        sx={{
          height: "65%",
          background: "#F9F9F9",
          border: "1px solid #DBDBDB",
        }}
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
          <DeleteIcon
            color="primary"
            sx={{ cursor: "pointer", fontSize: 25 }}
          />
        </CustomButton>
        <Divider orientation="vertical" />
      </Box>
      <Box
        display="flex"
        flexDirection="row"
        justifyContent="space-between"
        sx={{
          width: "100%",
          height: "35%",
          background: "#F9F9F9",
          border: "1px solid #DBDBDB",
        }}
      >
        <Typography
          component="span"
          align="left"
          sx={{ width: "60%", marginLeft: 2 }}
        >
          Name
        </Typography>
        <Divider orientation="vertical" />
        <Typography component="span" align="left" sx={{ width: "10%" }}>
          Size
        </Typography>
        <Divider orientation="vertical" />
        <Typography component="span" align="left" sx={{ width: "10%" }}>
          Version
        </Typography>
        <Divider orientation="vertical" sx={{ color: "red" }} />
        <Typography component="span" align="left" sx={{ width: "20%" }}>
          Modified
        </Typography>
      </Box>
    </Stack>
  );
}
