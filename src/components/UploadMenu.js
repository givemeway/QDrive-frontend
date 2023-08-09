/* global forge */
/* global axios */
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
import { getfilesCurDir, compareFiles } from "../filesInfo.js";
import { uploadFile } from "../transferFile.js";
import { csrftokenURL } from "../config.js";

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

const uploadFolder = async (cwd, filesList, device) => {
  const uploadingDirPath =
    cwd === "/"
      ? filesList[0].webkitRelativePath.split(/\//g)[0]
      : cwd + "/" + filesList[0].webkitRelativePath.split(/\//g)[0];

  const { data } = await axios.get(csrftokenURL);
  const CSRFToken = data.CSRFToken;
  console.log(CSRFToken);
  console.log(uploadingDirPath);
  getfilesCurDir(uploadingDirPath, device, CSRFToken)
    .then(async (DbFiles) => {
      let files = await compareFiles(filesList, DbFiles, cwd);
      console.log(files.length);
      for (let i = 0; i < files.length; i++) {
        try {
          let data = await uploadFile(
            files[i],
            cwd,
            files[i].modified,
            device,
            CSRFToken
          );

          console.log(data);
        } catch (err) {
          console.log(err);
        }
      }
    })
    .catch((err) => {
      console.log("inside this error block");
      console.log(err);
    });
};

function InputFileLabel({ children, setFiles }) {
  // const [files, setFiles] = useState([]);
  const handleChange = (e) => {
    setFiles(
      Array.from(e.target.files).map((file) => {
        file.modified = false;
        return file;
      })
    );
  };

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
  const [files, setFiles] = useState([]);

  useEffect(() => {
    const subpart = path.split("/").slice(1);
    if (subpart.length === 0) {
      setDevice("/");
      setPWD("/");
    } else {
      setDevice(subpart.slice(0, 1)[0]);
      const path = subpart.slice(1).join("/");
      setPWD(path.length === 0 ? "/" : path);
    }
  }, [path]);
  useEffect(() => {
    console.log(files);
    console.log(device, pwd);
    if (files.length > 0) {
      uploadFolder(pwd, files, device);
    }
  }, [files, pwd, device]);
  return (
    <Stack sx={{ marginBottom: 0, padding: 0, height: "100%" }}>
      <Box
        display="flex"
        flexDirection="row"
        alignItems="center"
        alignContent="center"
        sx={{
          height: "100%",
          background: "#F9F9F9",
          border: "1px solid #DBDBDB",
        }}
      >
        <CustomButton>
          <InputFileLabel setFiles={setFiles}>
            <UploadFileIcon
              color="primary"
              sx={{ cursor: "pointer", fontSize: 25 }}
            />
          </InputFileLabel>
        </CustomButton>
        <Divider orientation="vertical" />
        <CustomButton>
          <InputFileLabel setFiles={setFiles}>
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
      {/* <Box
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
      </Box> */}
    </Stack>
  );
}
