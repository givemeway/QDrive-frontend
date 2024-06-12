import React from "react";
import UploadFileIcon from "@mui/icons-material/UploadFileRounded";
import CircularProgress from "@mui/material/CircularProgress";

import UploadProgressDrawer from "./UploadProgressDrawer.js";
import { useState, useEffect, useRef } from "react";
import { socket } from "./Socket.js";
import { formatBytes, formatSeconds } from "../util.js";
import { Button, Snackbar, Box, Typography } from "@mui/material";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setRefresh } from "../features/table/updateTableSlice.js";
import { CustomBlueButton } from "./Buttons/BlueButton.jsx";
import "./Buttons/BlueButton.css";

const ETA = (starttime, total, uploaded) => {
  const timeElapsed = new Date() - starttime;
  const uploadSpeed = uploaded / (timeElapsed / 1000);
  const time = (total - uploaded) / uploadSpeed;
  const eta = formatSeconds(time);
  const speed = formatBytes(uploadSpeed) + "/s";
  return { eta, speed };
};

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

function FilesUpload() {
  const [files, setFiles] = useState([]);
  const filesMetaData = useRef({});
  const [socketID, setSocketID] = useState(undefined);
  const params = useParams();
  const subpath = params["*"];

  const [pwd, setPWD] = useState("/");
  const [device, setDevice] = useState("/");
  const [filesToUpload, setFilesToUpload] = useState([]);
  const [CSRFToken, setCSRFToken] = useState("");
  const [trackFilesProgress, setTrackFilesProgress] = useState([]);
  const [uploadCompleted, setUploadCompleted] = useState(false);
  const [filesStatus, setFilesStatus] = useState({
    processed: 0,
    startTime: 0,
    total: 0,
    eta: Infinity,
    totalSize: 0,
    uploaded: 0,
  });
  const [preparingFiles, setPreparingFiles] = useState(false);
  const [open, setOpen] = useState(null);
  const timer = useRef(null);
  const atLeastOneUploaded = useRef(false);
  const dispatch = useDispatch();
  const refresh = useSelector((state) => state.updateTable);

  useEffect(() => {
    if (files.length > 0) {
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
    if (filesToUpload.length > 0 && socketID) {
      setOpen(true);
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
        file.id = id;
        file.transferred = uploaded;
        file.transferred_b = formatBytes(uploaded);
        file.folder = id.split("/").slice(0, -1).join("/");
        file.bytes = parseInt(total);
        const data = trackFilesProgress[id];
        if (data) {
          const { transferred, startTime, bytes } = data;
          file.startTime = startTime;
          const { eta, speed } = ETA(startTime, bytes, uploaded);
          file.eta = eta;
          file.speed = speed;
          setFilesStatus((prev) => ({
            ...prev,
            uploaded: prev.uploaded + uploaded - transferred,
          }));

          setTrackFilesProgress((prev) => ({ ...prev, [id]: file }));
        }
      };

      const onFileUploadedToDestination = ({ payload }) => {
        const { name, id } = payload;
        const file = {};
        file.name = name;
        file.error = null;
        file.id = id;
        file.folder = id.split("/").slice(0, -1).join("/");
        file.status = "finalizing";

        setTrackFilesProgress((prev) => ({ ...prev, [id]: file }));
      };

      const onFileUploadDone = ({ payload }) => {
        const { name, id } = payload;
        const file = {};
        file.name = name;
        file.error = null;
        file.id = id;
        file.folder = id.split("/").slice(0, -1).join("/");
        file.status = "uploaded";

        setTrackFilesProgress((prev) => ({ ...prev, [id]: file }));
        setFilesStatus((prev) => ({
          ...prev,
          processed: prev.processed + 1,
        }));
        if (!atLeastOneUploaded.current) {
          console.log("fetch triggered");
          dispatch(setRefresh({ toggle: !refresh.toggle, refresh: true }));
          timer.current = setInterval(
            () =>
              dispatch(setRefresh({ toggle: !refresh.toggle, refresh: true })),
            2000
          );
          atLeastOneUploaded.current = true;
        }
      };

      const onFileError = ({ payload }) => {
        const { name, data, id } = payload;
        const file = {};
        file.name = name;
        file.id = id;
        file.folder = id.split("/").slice(0, -1).join("/");
        file.status = "failed";
        file.error = data;
        setTrackFilesProgress((prev) => ({ ...prev, [id]: file }));
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
        if (mode === "filesStatus_total") {
          const { total } = data;
          setFilesStatus((prev) => ({ ...prev, total }));
        } else if (mode === "finish") {
          setFilesToUpload([]);
          setUploadCompleted(true);
          atLeastOneUploaded.current = false;
          dispatch(setRefresh({ toggle: false, refresh: false }));
          clearInterval(timer.current);
          worker.terminate();
        } else if (mode === "failed") {
          const { name, id, error } = data;
          const file = {};
          file.name = name;
          file.error = error;
          file.id = id;
          file.status = "failed";

          setTrackFilesProgress((prev) => ({
            ...prev,
            [id]: file,
          }));
          setFilesStatus((prev) => ({
            ...prev,
            processed: prev.processed + 1,
          }));
        } else if (mode === "fileUploadInitiated") {
          const { startTime, id } = data;
          let file = trackFilesProgress[id];
          file.startTime = startTime;
          file.status = "preparing";
          file.id = id;

          setTrackFilesProgress((prev) => ({
            ...prev,
            [id]: file,
          }));
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

  const handleFileSelection = (e) => {
    console.log("triggered before set preparing files");
    setPreparingFiles(true);
    setFiles(
      Array.from(e.target.files).map((file) => {
        file.modified = false;
        return file;
      })
    );

    console.log("inside folder upload component");
    const subpart = subpath.split("/").slice(1);
    if (subpart.length === 0) {
      setDevice("/");
      setPWD("/");
    } else {
      setDevice(subpart.slice(0, 1)[0]);
      const actualPath = subpart.slice(1).join("/");
      setPWD(actualPath.length === 0 ? "/" : actualPath);
    }
    e.target.value = null;
  };

  return (
    <>
      <button
        className="deleteButton fill-blue"
        style={{ width: 130, height: 80, padding: 12, cursor: "pointer" }}
      >
        <label
          htmlFor="upload-file"
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "start",
            height: "100%",
            width: "100%",
            cursor: "pointer",
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
          <div className="flex flex-col justify-start items-center w-full ">
            <div className="w-full flex justify-start items-center">
              <UploadFileIcon
                color="black"
                sx={{ cursor: "pointer", fontSize: 25, padding: 0 }}
              />
            </div>
            <span className="text-left w-full">File</span>
          </div>
        </label>
      </button>
      {open && (
        <UploadProgressDrawer
          trackFilesProgress={trackFilesProgress}
          uploadCompleted={uploadCompleted}
          filesStatus={filesStatus}
          onClose={() => setOpen(false)}
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
