import React from "react";
import UploadFileIcon from "@mui/icons-material/UploadFileRounded";
import CircularProgress from "@mui/material/CircularProgress";

import UploadProgressDrawer from "./UploadProgressDrawer.js";
import { useState, useEffect, useContext, useRef } from "react";
import { useParams } from "react-router-dom";
import { filesFoldersURL } from "../config.js";
import {
  PathContext,
  UploadContext,
  UploadFolderContenxt,
} from "./UseContext.js";
import { Button, Snackbar, Box, Typography } from "@mui/material";

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

function FilesUpload({ setUpload }) {
  const [files, setFiles] = useState([]);
  const filesMetaData = useRef({});

  const [pwd, setPWD] = useState("/");
  const [device, setDevice] = useState("/");
  const [filesToUpload, setFilesToUpload] = useState([]);
  const [CSRFToken, setCSRFToken] = useState("");
  const [trackFilesProgress, setTrackFilesProgress] = useState([]);
  const [showProgress, setShowProgress] = useState(false);
  const [uploadCompleted, setUploadCompleted] = useState(false);
  const [filesStatus, setFilesStatus] = useState({
    processed: 0,
    total: 0,
    eta: Infinity,
    totalSize: 0,
    uploaded: 0,
  });
  const [preparingFiles, setPreparingFiles] = useState(false);
  const { setData } = useContext(UploadFolderContenxt);
  const path = useContext(PathContext);
  const fileProgress = useContext(UploadContext);
  const params = useParams();
  const subpath = params["*"];
  useEffect(() => {
    const path = subpath.split("/");
    console.log("inside file status");
    if (
      path[0] === "home" &&
      filesToUpload.length > 0 &&
      (filesStatus.processed % 10 === 0 || filesStatus.total <= 10)
    ) {
      console.log("10 files uploaded");
      let homedir;
      let curDir;

      if (path.length === 1) {
        homedir = "/";
        curDir = "/";
      } else {
        curDir = path.slice(2).join("/");

        if (curDir.length === 0) {
          curDir = "/";
        }
        homedir = path[1];
      }
      const headers = {
        "X-CSRF-Token": CSRFToken,
        "Content-type": "application/x-www-form-urlencoded",
        devicename: homedir,
        currentdirectory: curDir,
        username: "sandeep.kumar@idriveinc.com",
        sortorder: "ASC",
      };
      const options = {
        method: "POST",
        credentials: "include",
        mode: "cors",
        headers: headers,
      };
      fetch(filesFoldersURL + "/", options)
        .then((res) => res.json())
        .then((data) => {
          setData(() => {
            return data;
          });
        })
        .catch((err) => console.log(err));
    }
  }, [
    CSRFToken,
    filesStatus.processed,
    filesStatus.total,
    filesToUpload.length,
    setData,
    subpath,
  ]);

  useEffect(() => {
    if (files.length > 0) {
      console.log("inside the findFilesToUpload");
      const worker = new Worker(new URL("../worker.js", import.meta.url), {
        type: "module",
      });
      worker.postMessage({ mode: "init", files, pwd, device });
      worker.onmessage = ({ data }) => {
        const { mode } = data;
        if (mode === "filesToUpload") {
          const {
            CSRFToken,
            trackFilesProgress,
            totalSize,
            total,
            toBeUploaded,
            metadata,
          } = data;
          setCSRFToken(CSRFToken);
          setTrackFilesProgress(() => trackFilesProgress);
          setFilesStatus((prev) => ({
            ...prev,
            totalSize: totalSize,
            total: total,
          }));
          filesMetaData.current = metadata;
          setFilesToUpload(toBeUploaded);
          setFiles([]);
          worker.terminate();
        }
      };
      worker.onerror = (e) => {
        setFilesToUpload([]);
        setFiles([]);
        console.error(e);
        worker.terminate();
      };
    }
  }, [device, files, pwd]);

  useEffect(() => {
    setPreparingFiles(false);
    if (filesToUpload.length > 0) {
      setUpload("file");
      setShowProgress(true);
      setUploadCompleted(false);
      const worker = new Worker(new URL("../worker.js", import.meta.url), {
        type: "module",
      });
      worker.postMessage({
        mode: "upload",
        filesToUpload,
        metadata: filesMetaData.current,
        pwd,
        device,
        CSRFToken,
        total: filesStatus.totalSize,
        trackFilesProgress,
        filesStatus,
      });
      worker.onmessage = ({ data }) => {
        const { mode } = data;
        if (mode === "filesStatus_eta") {
          const { eta } = data;
          setFilesStatus((prev) => ({ ...prev, eta }));
        } else if (mode === "filesStatus_total") {
          const { total } = data;
          setFilesStatus((prev) => ({ ...prev, total }));
        } else if (mode === "filesStatus_processed") {
          const { processed } = data;
          setFilesStatus((prev) => ({ ...prev, processed }));
        } else if (mode === "filesStatus_uploaded") {
          const { uploaded } = data;
          setFilesStatus((prev) => ({ ...prev, uploaded }));
        } else if (mode === "uploadInitiated") {
          const { uploadStarted } = data;
          // setUploadInitiated(uploadStarted);
        } else if (mode === "uploadProgress") {
          const { fileName, fileBody } = data;
          setTrackFilesProgress((prev) => {
            prev.set(fileName, fileBody);
            return prev;
          });
        } else if (mode === "finish") {
          setFilesToUpload([]);
          setUploadCompleted(true);
          console.log("file upload complete");
          worker.terminate();
        }
      };
      worker.onerror = (e) => {
        console.error(e);
      };
    }
  }, [filesToUpload]);

  const handleFileSelection = (e) => {
    console.log("triggered before set preparing files");
    setPreparingFiles(true);
    // setUpload("folder");
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
            onChange={handleFileSelection}
          />
          <UploadFileIcon
            color="primary"
            sx={{ cursor: "pointer", fontSize: 25 }}
          />
        </label>
      </CustomButton>
      {fileProgress === "file" && (
        <UploadProgressDrawer
          trackFilesProgress={trackFilesProgress}
          uploadCompleted={uploadCompleted}
          filesStatus={filesStatus}
          showProgress={showProgress}
          setUpload={setUpload}
        />
      )}
      <Snackbar
        open={preparingFiles}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        message={
          <Box
            display="flex"
            flexDirection="row"
            alignItems="center"
            justifyContent="flex-start"
            gap={2}
          >
            {preparingFiles && <CircularProgress />}
            {preparingFiles && <Typography>Preparing Files..</Typography>}
          </Box>
        }
      ></Snackbar>
    </>
  );
}

export default React.memo(FilesUpload);
