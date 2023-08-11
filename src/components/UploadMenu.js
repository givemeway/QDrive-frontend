/* global forge */
/* global axios */
import { Box, Button, Divider, Stack } from "@mui/material";
import React from "react";

import UploadFileIcon from "@mui/icons-material/UploadFileRounded";
import DriveFolderUploadIcon from "@mui/icons-material/DriveFolderUploadRounded";
import CloudDownloadIcon from "@mui/icons-material/CloudDownloadRounded";
import DeleteIcon from "@mui/icons-material/DeleteRounded";
import ShareIcon from "@mui/icons-material/ShareRounded";
import UploadProgressDrawer from "./UploadProgressDrawer.js";
import { useState, useEffect, useContext } from "react";
import { getfilesCurDir, compareFiles } from "../filesInfo.js";
import { uploadFile } from "../transferFile.js";
import { csrftokenURL } from "../config.js";
import { formatBytes } from "../util.js";
import { PathContext } from "./Context.js";

function CustomButton({ children }) {
  return (
    <Button
      variant="outlined"
      disableRipple
      sx={{
        border: "none",
        boxSizing: "border-box",
        "&:hover": {
          backgroundColor: "#EFF3FA",
          border: "none",
        },
      }}
    >
      {children}
    </Button>
  );
}

const findFilesToUpload = async (
  cwd,
  filesList,
  device,
  setTrackFilesProgress,
  setCSRFToken
) => {
  try {
    let tempDeviceName;
    let uploadingDirPath =
      cwd === "/"
        ? filesList[0].webkitRelativePath.split(/\//g)[0]
        : cwd + "/" + filesList[0].webkitRelativePath.split(/\//g)[0];
    if (device === "/") {
      tempDeviceName = filesList[0].webkitRelativePath.split(/\//g)[0];
      if (tempDeviceName.length === 0) {
        tempDeviceName = "/";
      }
      uploadingDirPath = "/";
    }
    const { data } = await axios.get(csrftokenURL);
    const CSRFToken = data.CSRFToken;
    setCSRFToken(CSRFToken);
    console.log(uploadingDirPath);
    const DbFiles = await getfilesCurDir(
      cwd,
      tempDeviceName !== undefined ? tempDeviceName : device,
      CSRFToken
    );
    let files = await compareFiles(filesList, DbFiles, cwd, device);
    console.log(files.length);
    setTrackFilesProgress(
      () =>
        new Map(
          files.map((file) => [
            file.webkitRelativePath,
            {
              name: file.name,
              progress: 0,
              status: "queued",
              size: formatBytes(file.size),
              bytes: file.size,
              folder: file.webkitRelativePath.split("/").slice(0, -1).join("/"),
            },
          ])
        )
    );
    return files;
  } catch (err) {
    return err;
  }
};

function promiseAll(promises, concurrencyLimit) {
  return new Promise((resolve, reject) => {
    let completed = 0;
    let running = 0;
    let index = 0;

    function runNext() {
      if (completed + running === promises.length) {
        resolve();
        return;
      }

      while (running < concurrencyLimit && index < promises.length) {
        running++;
        promises[index]
          .then(() => {
            completed++;
            running--;
            runNext();
          })
          .catch(reject);
        index++;
      }
    }

    runNext();
  });
}

const uploadFiles = async (
  files,
  cwd,
  device,
  CSRFToken,
  setTrackFilesProgress,
  setFilesStatus
) => {
  setFilesStatus((prev) => ({ ...prev, total: files.length }));
  const promises = files.map((file, i) =>
    uploadFile(
      file,
      cwd,
      file.modified,
      device,
      CSRFToken,
      setTrackFilesProgress
    ).then(() => {
      setFilesStatus((prev) => ({ ...prev, processed: prev.processed + 1 }));
    })
  );
  await promiseAll(promises, 5);
};

function InputFileLabel({
  children,
  setTrackFilesProgress,
  setIsUploading,
  setShowProgress,
  setUploadCompleted,
  setFilesStatus,
  isDirectory,
}) {
  const [files, setFiles] = useState([]);
  const [pwd, setPWD] = useState("/");
  const [device, setDevice] = useState("/");
  const [filesToUpload, setFilesToUpload] = useState([]);
  const [CSRFToken, setCSRFToken] = useState("");
  const path = useContext(PathContext);
  useEffect(() => {
    if (files.length > 0) {
      findFilesToUpload(pwd, files, device, setTrackFilesProgress, setCSRFToken)
        .then((files) => {
          setIsUploading(false);
          setFilesToUpload(files);
          setFiles([]);
        })
        .catch((err) => {
          setIsUploading(false);
          setFilesToUpload([]);
          setFiles([]);
          console.log(err);
        });
    }
  }, [files]);
  useEffect(() => {
    setIsUploading(true);
    setShowProgress(true);
    setUploadCompleted(false);
    uploadFiles(
      filesToUpload,
      pwd,
      device,
      CSRFToken,
      setTrackFilesProgress,
      setFilesStatus
    )
      .then(() => {
        setUploadCompleted(true);
        console.log("upload complete");
      })
      .catch((err) => console.log(err));
  }, [filesToUpload]);

  const handleChange = (e) => {
    setFiles(
      Array.from(e.target.files).map((file) => {
        file.modified = false;
        setIsUploading(true);
        return file;
      })
    );
    console.log("inside change");
    const subpart = path.split("/").slice(1);
    if (subpart.length === 0) {
      setDevice("/");
      setPWD("/");
    } else {
      setDevice(subpart.slice(0, 1)[0]);
      const actualPath = subpart.slice(1).join("/");
      setPWD(actualPath.length === 0 ? "/" : actualPath);
    }
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
        multiple={true}
        // webkitdirectory="true"
        onChange={handleChange}
      />
      {children}
    </label>
  );
}

export default React.memo(function UploadMenu() {
  const [isUploading, setIsUploading] = useState(false);
  const [trackFilesProgress, setTrackFilesProgress] = useState([]);
  const [showProgres, setShowProgress] = useState(false);
  const [uploadCompleted, setUploadCompleted] = useState(false);
  const [filesStatus, setFilesStatus] = useState({ processed: 0, total: 0 });
  console.log("upload menu rendered");
  return (
    <>
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
            margin: 0,
            padding: 0,
          }}
        >
          <CustomButton>
            <InputFileLabel
              setTrackFilesProgress={setTrackFilesProgress}
              setIsUploading={setIsUploading}
              setShowProgress={setShowProgress}
              setUploadCompleted={setUploadCompleted}
              setFilesStatus={setFilesStatus}
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
              setTrackFilesProgress={setTrackFilesProgress}
              setIsUploading={setIsUploading}
              setShowProgress={setShowProgress}
              setUploadCompleted={setUploadCompleted}
              setFilesStatus={setFilesStatus}
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
            <ShareIcon
              color="primary"
              sx={{ cursor: "pointer", fontSize: 25 }}
            />
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
      {showProgres && (
        <UploadProgressDrawer
          trackFilesProgress={trackFilesProgress}
          uploadCompleted={uploadCompleted}
          filesStatus={filesStatus}
          showProgres={showProgres}
        />
      )}
    </>
  );
});
