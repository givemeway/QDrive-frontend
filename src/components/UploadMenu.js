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
  let tempDeviceName;
  const uploadingDirPath =
    cwd === "/"
      ? filesList[0].webkitRelativePath.split(/\//g)[0]
      : cwd + "/" + filesList[0].webkitRelativePath.split(/\//g)[0];
  if (device === "/") {
    tempDeviceName = filesList[0].webkitRelativePath.split(/\//g)[0];
  }
  const { data } = await axios.get(csrftokenURL);
  const CSRFToken = data.CSRFToken;
  console.log(uploadingDirPath);
  const DbFiles = await getfilesCurDir(
    uploadingDirPath,
    tempDeviceName,
    CSRFToken
  );

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
};

function InputFileLabel({ children, setFiles, setIsUploading, isDirectory }) {
  const handleChange = (e) => {
    setFiles(
      Array.from(e.target.files).map((file) => {
        file.modified = false;
        setIsUploading(true);
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
        {...(isDirectory ? { webkitdirectory: "true" } : { multiple: true })}
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
  const [isUploading, setIsUploading] = useState(false);
  // TODO: 1 track the upload and make sure uploadfolder is not invoked again until the current upload is complete.
  // TODO: 2 Clear the files once the upload is complete
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
    if (files.length > 0 && isUploading) {
      uploadFolder(pwd, files, device)
        .then(() => {
          setIsUploading(false);
          setFiles([]);
          console.log("upload complete");
        })
        .catch((err) => {
          setIsUploading(false);
          setFiles([]);
          console.log(err);
        });
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
          <InputFileLabel
            setFiles={setFiles}
            setIsUploading={setIsUploading}
            isDirectory={false}
          >
            <UploadFileIcon
              color="primary"
              sx={{ cursor: "pointer", fontSize: 25 }}
            />
          </InputFileLabel>
        </CustomButton>
        <Divider orientation="vertical" />
        <CustomButton>
          <InputFileLabel
            setFiles={setFiles}
            setIsUploading={setIsUploading}
            isDirectory={true}
          >
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
    </Stack>
  );
}
