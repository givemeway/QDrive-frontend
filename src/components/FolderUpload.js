import React from "react";
import DriveFolderUploadIcon from "@mui/icons-material/DriveFolderUploadRounded";
import UploadProgressDrawer from "./UploadProgressDrawer.js";
import { useState, useEffect, useRef } from "react";

import { Button } from "@mui/material";
import { useParams } from "react-router-dom";
import { Typography, Box } from "@mui/material";
import Snackbar from "@mui/material/Snackbar";
import CircularProgress from "@mui/material/CircularProgress";
import { socket } from "./Socket.js";
import { formatBytes, formatSeconds } from "../util.js";
import { useRecoilState, useRecoilValue } from "recoil";
import { subpathAtom, uploadAtom } from "../Recoil/Store/atoms.js";
import { useDispatch, useSelector } from "react-redux";
import { setRefresh } from "../features/table/updateTableSlice.js";

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

function FolderUpload() {
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
  const path = useRecoilValue(subpathAtom);
  const [folderProgress, setUpload] = useRecoilState(uploadAtom);
  const params = useParams();
  const subpath = params["*"];
  const timer = useRef(null);
  const atLeastOneUploaded = useRef(false);
  const dispatch = useDispatch();
  const refresh = useSelector((state) => state.updateTable);
  // const { overAllProgress } = useSelector((state) => state.overAllProgress);
  // console.log(overAllProgress);
  // const dispatch = useDispatch();

  const ETA = (starttime, total, uploaded) => {
    const timeElapsed = Date.now() - starttime;
    const uploadSpeed = uploaded / (timeElapsed / 1000);
    const time = (total - uploaded) / uploadSpeed;
    const eta = formatSeconds(time);
    const speed = formatBytes(uploadSpeed) + "/s";
    return { eta, speed };
  };

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
            trackFilesProgress_obj,
            totalSize,
            total,
            toBeUploaded,
            metadata,
          } = data;
          setCSRFToken(CSRFToken);
          setTrackFilesProgress(() => trackFilesProgress);
          // dispatch(setFilesProgress(trackFilesProgress_obj));
          setFilesStatus((prev) => ({
            ...prev,
            totalSize: totalSize,
            total: total,
          }));
          // dispatch(setOverAllProgress({ totalSize: totalSize, total: total }));
          filesMetaData.current = metadata;
          // dispatch(setFilesMetaData(metadata));
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
      socketID
      // && trackFilesProgress instanceof Map
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
        file.id = id;
        // const data = trackFilesProgress.get(id);
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
          // dispatch(
          //   setOverAllProgress({
          //     uploaded: overAllProgress.uploaded + uploaded - transferred,
          //   })
          // );
          // setTrackFilesProgress((prev) => {
          //   prev.set(id, file);
          //   return prev;
          // });
          setTrackFilesProgress((prev) => ({
            ...prev,
            [id]: file,
          }));
          // dispatch(setFilesProgress({ [id]: file }));
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
        // setTrackFilesProgress((prev) => {
        //   prev.set(id, file);
        //   return prev;
        // });
        setTrackFilesProgress((prev) => ({
          ...prev,
          [id]: file,
        }));
        // dispatch(setFilesProgress({ [id]: file }));
      };

      const onFileUploadDone = ({ payload }) => {
        const { name, id } = payload;
        const file = {};
        file.name = name;
        file.error = null;
        file.id = id;
        file.folder = id.split("/").slice(0, -1).join("/");
        file.status = "uploaded";
        // setTrackFilesProgress((prev) => {
        //   prev.set(id, file);
        //   return prev;
        // });
        setTrackFilesProgress((prev) => ({
          ...prev,
          [id]: file,
        }));
        // dispatch(setFilesProgress({ [id]: file }));
        // dispatch(
        //   setOverAllProgress({
        //     processed: overAllProgress.processed + 1,
        //   })
        // );
        setFilesStatus((prev) => ({
          ...prev,
          processed: prev.processed + 1,
        }));
        if (!atLeastOneUploaded.current) {
          console.log("fetch triggered");
          dispatch(setRefresh({ toggle: !refresh.toggle, refresh: true }));

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
        // setTrackFilesProgress((prev) => {
        //   prev.set(id, file);
        //   return prev;
        // });
        setTrackFilesProgress((prev) => ({
          ...prev,
          [id]: file,
        }));
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
          // setTrackFilesProgress((prev) => {
          //   prev.set(fileName, fileBody);
          //   return prev;
          // });
          setTrackFilesProgress((prev) => ({
            ...prev,
            [fileName]: fileBody,
          }));
        } else if (mode === "finish") {
          setFilesToUpload([]);
          setUploadCompleted(true);
          atLeastOneUploaded.current = false;
          dispatch(setRefresh({ toggle: false, refresh: false }));
          console.log("file upload complete");
          worker.terminate();
        } else if (mode === "failed") {
          const { name, id, error } = data;
          const file = {};
          file.name = name;
          file.error = error;
          file.status = "failed";
          file.id = id;
          // setTrackFilesProgress((prev) => {
          //   prev.set(id, file);
          //   return prev;
          // });
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
          // let file = trackFilesProgress.get(id);
          let file = trackFilesProgress[id];

          file.startTime = startTime;
          file.status = "preparing";
          file.id = id;
          // setTrackFilesProgress((prev) => {
          //   prev.set(id, file);
          //   return prev;
          // });
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

  const handleFolderSelection = (e) => {
    setPreparingFiles(true);
    setUploadInitiated(false);
    setFiles(
      Array.from(e.target.files).map((file) => {
        file.modified = false;
        return file;
      })
    );

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
            onBlur={(e) => console.log("onblur")}
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
          // setUpload={setUpload}
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
