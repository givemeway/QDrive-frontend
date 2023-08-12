/* global forge */
/* global axios */
/* global async */
import React from "react";
import UploadFileIcon from "@mui/icons-material/UploadFileRounded";
import DriveFolderUploadIcon from "@mui/icons-material/DriveFolderUploadRounded";
import CloudDownloadIcon from "@mui/icons-material/CloudDownloadRounded";
import DeleteIcon from "@mui/icons-material/DeleteRounded";
import ShareIcon from "@mui/icons-material/ShareRounded";
import UploadProgressDrawer from "./UploadProgressDrawer.js";
import { useState, useEffect, useContext, useRef } from "react";
import { getfilesCurDir, compareFiles } from "../filesInfo.js";
import { uploadFile } from "../transferFile.js";
import { csrftokenURL } from "../config.js";
import { formatBytes } from "../util.js";
import { PathContext, UploadContext } from "./Context.js";
import { Button } from "@mui/material";

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

const uploadFiles = async (
  files,
  cwd,
  device,
  CSRFToken,
  setTrackFilesProgress,
  setFilesStatus
) => {
  try {
    setFilesStatus((prev) => ({ ...prev, total: files.length, processed: 0 }));

    const promises = [];
    for (const file of files) {
      promises.push(async () => {
        try {
          await uploadFile(
            file,
            cwd,
            file.modified,
            device,
            CSRFToken,
            setTrackFilesProgress
          );
          setFilesStatus((prev) => ({
            ...prev,
            processed: prev.processed + 1,
          }));
        } catch (err) {
          // setFilesStatus((prev) => ({
          //   ...prev,
          //   processed: prev.processed + 1,
          // }));
          console.log(err);
        }
      });
    }

    await async.parallelLimit(promises, 10);
  } catch (err) {
    console.log(err);
  }
};

function FolderUpload({ setUpload }) {
  const [files, setFiles] = useState([]);
  const [pwd, setPWD] = useState("/");
  const [device, setDevice] = useState("/");
  const [filesToUpload, setFilesToUpload] = useState([]);
  const [CSRFToken, setCSRFToken] = useState("");
  const [trackFilesProgress, setTrackFilesProgress] = useState([]);
  const [showProgress, setShowProgress] = useState(false);
  const [uploadCompleted, setUploadCompleted] = useState(false);
  const [filesStatus, setFilesStatus] = useState({ processed: 0, total: 0 });
  const path = useContext(PathContext);
  const folderProgress = useContext(UploadContext);
  useEffect(() => {
    if (files.length > 0) {
      findFilesToUpload(pwd, files, device, setTrackFilesProgress, setCSRFToken)
        .then((files) => {
          setFilesToUpload(files);
          setFiles([]);
        })
        .catch((err) => {
          setFilesToUpload([]);
          setFiles([]);
          console.log(err);
        });
    }
  }, [files]);
  useEffect(() => {
    if (filesToUpload.length > 0) {
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
          //   setUpload(null);
          setFilesToUpload([]);
          setUploadCompleted(true);
          console.log("file upload complete");
        })
        .catch((err) => {
          //   setUpload(null);
          setFilesToUpload([]);
          setUploadCompleted(true);
          console.log(err);
        });
    }
  }, [filesToUpload]);

  const handleFolderSelection = (e) => {
    setUpload("folder");
    setFiles(
      Array.from(e.target.files).map((file) => {
        file.modified = false;
        return file;
      })
    );

    console.log("inside folder upload component");
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
    <>
      <CustomButton>
        <label
          htmlFor="upload-folder"
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
            id="upload-folder"
            name="upload-folder"
            type="file"
            webkitdirectory={"true"}
            onChange={handleFolderSelection}
          />
          <DriveFolderUploadIcon
            color="primary"
            sx={{ cursor: "pointer", fontSize: 25 }}
          />
        </label>
      </CustomButton>
      {folderProgress === "folder" && (
        <UploadProgressDrawer
          trackFilesProgress={trackFilesProgress}
          uploadCompleted={uploadCompleted}
          filesStatus={filesStatus}
          showProgress={showProgress}
          setUpload={setUpload}
        />
      )}
    </>
  );
}

export default React.memo(FolderUpload);
