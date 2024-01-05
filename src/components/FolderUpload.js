import React from "react";
import DriveFolderUploadIcon from "@mui/icons-material/DriveFolderUploadRounded";
import UploadProgressDrawer from "./UploadProgressDrawer.js";
import { useState, useEffect, useContext, useRef } from "react";
import { filesFoldersURL } from "../config.js";
import {
  PathContext,
  UploadContext,
  UploadFolderContenxt,
} from "./UseContext.js";
import { Button } from "@mui/material";
import { useParams } from "react-router-dom";
import { Typography, Box } from "@mui/material";
import Snackbar from "@mui/material/Snackbar";
import CircularProgress from "@mui/material/CircularProgress";
import { socket } from "./Socket.js";
import { formatBytes, formatSeconds } from "../util.js";

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

function FolderUpload({ setUpload }) {
  const [files, setFiles] = useState([]);
  const [pwd, setPWD] = useState("/");
  const [device, setDevice] = useState("/");
  const [filesToUpload, setFilesToUpload] = useState([]);
  const [CSRFToken, setCSRFToken] = useState("");
  const [trackFilesProgress, setTrackFilesProgress] = useState([]);
  const [showProgress, setShowProgress] = useState(false);
  const [uploadCompleted, setUploadCompleted] = useState(false);
  const [socketID, setSocketID] = useState(undefined);
  const [filesStatus, setFilesStatus] = useState({
    processed: 0,
    startTime: 0,
    total: 0,
    eta: Infinity,
    totalSize: 0,
    uploaded: 0,
  });
  const [preparingFiles, setPreparingFiles] = useState(false);
  const filesMetaData = useRef({});
  const [uploadInitiated, setUploadInitiated] = useState(false);
  const { setData } = useContext(UploadFolderContenxt);
  const path = useContext(PathContext);
  const folderProgress = useContext(UploadContext);
  const params = useParams();
  const subpath = params["*"];

  const ETA = (starttime, total, uploaded) => {
    const timeElapsed = new Date() - starttime;
    const uploadSpeed = uploaded / (timeElapsed / 1000);
    const time = (total - uploaded) / uploadSpeed;
    const eta = formatSeconds(time);
    const speed = formatBytes(uploadSpeed) + "/s";
    return { eta, speed };
  };

  useEffect(() => {
    const path = subpath.split("/");
    if (path[0] === "home" && uploadInitiated) {
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
  }, [CSRFToken, setData, subpath, uploadInitiated]);

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
    const { eta } = ETA(
      filesStatus.startTime,
      filesStatus.totalSize,
      filesStatus.uploaded
    );
    setFilesStatus((prev) => ({ ...prev, eta: eta }));
  }, [filesStatus.uploaded]);

  useEffect(() => {
    setPreparingFiles(false);

    if (
      filesToUpload.length > 0 &&
      socketID &&
      trackFilesProgress instanceof Map
    ) {
      setUpload("folder");
      setShowProgress(true);
      setUploadCompleted(false);
      const start = new Date();
      setFilesStatus((prev) => ({ ...prev, startTime: start }));
      const worker = new Worker(new URL("../worker.js", import.meta.url), {
        type: "module",
      });

      const onFileProgress = ({ payload }) => {
        const { processed, total, uploaded, name, id } = payload;
        const file = {};
        file.name = name;
        file.progress = processed;
        file.size = formatBytes(total);
        file.error = null;
        file.status = "uploading";
        file.transferred = uploaded;
        file.transferred_b = formatBytes(uploaded);
        file.folder = id.split("/").slice(0, -1).join("/");
        file.bytes = parseInt(total);
        const { transferred, startTime, bytes } = trackFilesProgress.get(id);
        file.startTime = startTime;
        const { eta, speed } = ETA(startTime, bytes, uploaded);
        file.eta = eta;
        file.speed = speed;
        setFilesStatus((prev) => ({
          ...prev,
          uploaded: prev.uploaded + uploaded - transferred,
        }));
        setTrackFilesProgress((prev) => {
          prev.set(id, file);
          return prev;
        });
      };

      const onFileUploadedToDestination = ({ payload }) => {
        const { name, id } = payload;
        const file = {};
        file.name = name;
        file.error = null;
        file.folder = id.split("/").slice(0, -1).join("/");
        file.status = "finalizing";
        setTrackFilesProgress((prev) => {
          prev.set(id, file);
          return prev;
        });
      };

      const onFileUploadDone = ({ payload }) => {
        const { name, id } = payload;
        const file = {};
        file.name = name;
        file.error = null;
        file.folder = id.split("/").slice(0, -1).join("/");
        file.status = "uploaded";
        setTrackFilesProgress((prev) => {
          prev.set(id, file);
          return prev;
        });
        setFilesStatus((prev) => ({
          ...prev,
          processed: prev.processed + 1,
        }));
      };

      const onFileError = ({ payload }) => {
        const { name, data, id } = payload;
        const file = {};
        file.name = name;
        file.folder = id.split("/").slice(0, -1).join("/");
        file.status = "failed";
        file.error = data;
        setTrackFilesProgress((prev) => {
          prev.set(id, file);
          return prev;
        });
      };

      socket.on("uploadProgress", onFileProgress);
      socket.on("finalizing", onFileUploadedToDestination);
      socket.on("done", onFileUploadDone);
      socket.on("error", onFileError);

      worker.postMessage({
        mode: "upload",
        socket_main_id: socketID,
        filesToUpload,
        metadata: filesMetaData.current,
        pwd,
        device,
        CSRFToken,
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
          setUploadInitiated(uploadStarted);
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
        } else if (mode === "failed") {
          const { name, id, error } = data;
          const file = {};
          file.name = name;
          file.error = error;
          file.status = "failed";
          setTrackFilesProgress((prev) => {
            prev.set(id, file);
            return prev;
          });
        } else if (mode === "fileUploadInitiated") {
          const { startTime, id } = data;
          let file = trackFilesProgress.get(id);
          file.startTime = startTime;
          file.status = "preparing";
          setTrackFilesProgress((prev) => {
            prev.set(id, file);
            return prev;
          });
        }
      };
      worker.onerror = (e) => {
        console.error(e);
      };
    }
  }, [filesToUpload, socket, socketID]);

  useEffect(() => {
    socket.connect();
    socket.on("connected", onConnection);
    return () => socket.disconnect();
  }, []);

  const onConnection = ({ socketID }) => {
    setSocketID(socketID);
  };

  const handleFolderSelection = (e) => {
    console.log("triggered before set preparing files");
    setPreparingFiles(true);
    setUploadInitiated(false);
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

export default React.memo(FolderUpload);
