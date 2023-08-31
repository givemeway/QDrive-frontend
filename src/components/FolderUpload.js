/* global forge */
/* global axios */
/* global async */
/* global workerpool */
import React from "react";
import DriveFolderUploadIcon from "@mui/icons-material/DriveFolderUploadRounded";
import UploadProgressDrawer from "./UploadProgressDrawer.js";
import { useState, useEffect, useContext } from "react";
import { getfilesCurDir, compareFiles } from "../filesInfo.js";
// import { uploadFile } from "../transferFile.js";
import { csrftokenURL, filesFoldersURL } from "../config.js";
import { formatBytes, formatSeconds } from "../util.js";
import { PathContext, UploadContext, UploadFolderContenxt } from "./Context.js";
import { Button } from "@mui/material";
import { useParams } from "react-router-dom";
import { Typography, Box } from "@mui/material";
import Snackbar from "@mui/material/Snackbar";
import CircularProgress from "@mui/material/CircularProgress";

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

// const findFilesToUpload = async (
//   cwd,
//   filesList,
//   device,
//   setTrackFilesProgress,
//   setCSRFToken,
//   setFilesStatus
// ) => {
//   try {
//     let tempDeviceName;
//     let uploadingDirPath =
//       cwd === "/"
//         ? filesList[0].webkitRelativePath.split(/\//g)[0]
//         : cwd + "/" + filesList[0].webkitRelativePath.split(/\//g)[0];
//     if (device === "/") {
//       tempDeviceName = filesList[0].webkitRelativePath.split(/\//g)[0];
//       if (tempDeviceName.length === 0) {
//         tempDeviceName = "/";
//       }
//       uploadingDirPath = "/";
//     }
//     const { data } = await axios.get(csrftokenURL);
//     const CSRFToken = data.CSRFToken;
//     setCSRFToken(CSRFToken);
//     console.log(uploadingDirPath);
//     const DbFiles = await getfilesCurDir(
//       cwd,
//       tempDeviceName !== undefined ? tempDeviceName : device,
//       CSRFToken
//     );
//     let files = await compareFiles(filesList, DbFiles, cwd, device);
//     console.log(files.length);
//     files.forEach((file) =>
//       setFilesStatus((prev) => ({
//         ...prev,
//         totalSize: prev.totalSize + file.size,
//       }))
//     );
//     setTrackFilesProgress(
//       () =>
//         new Map(
//           files.map((file) => [
//             file.webkitRelativePath,
//             {
//               name: file.name,
//               progress: 0,
//               status: "queued",
//               size: formatBytes(file.size),
//               bytes: file.size,
//               folder: file.webkitRelativePath.split("/").slice(0, -1).join("/"),
//               eta: Infinity,
//             },
//           ])
//         )
//     );
//     return files;
//   } catch (err) {
//     return err;
//   }
// };

// const uploadFiles = async (
//   files,
//   cwd,
//   device,
//   CSRFToken,
//   totalSize,
//   setTrackFilesProgress,
//   setFilesStatus,
//   setUploadInitiated
// ) => {
//   let filesUploaded = 0;
//   let eta = Infinity;
//   const filesProgress = { uploaded: 0 };
//   const ETA = (timeStarted) => {
//     const timeElapsed = new Date() - timeStarted;
//     const uploadSpeed = filesProgress.uploaded / (timeElapsed / 1000);
//     const time = (totalSize - filesProgress.uploaded) / uploadSpeed;
//     eta = formatSeconds(time);
//     setFilesStatus((prev) => ({ ...prev, eta }));
//   };
//   const timeStarted = new Date();
//   const timer = setInterval(ETA, 1000, timeStarted);
//   try {
//     setFilesStatus((prev) => ({ ...prev, total: files.length, processed: 0 }));

//     const promises = [];
//     let idx = 0;
//     for (const file of files) {
//       // eslint-disable-next-line no-loop-func
//       promises.push(async () => {
//         try {
//           await uploadFile(
//             file,
//             cwd,
//             file.modified,
//             device,
//             CSRFToken,
//             filesProgress,
//             setTrackFilesProgress,
//             setFilesStatus
//           );
//           filesUploaded += 1;
//           setFilesStatus((prev) => ({
//             ...prev,
//             processed: prev.processed + 1,
//           }));
//           if (idx === 0) {
//             setUploadInitiated(true);
//           }
//           idx++;
//         } catch (err) {
//           console.log(err);
//         }
//       });
//     }

//     await async.parallelLimit(promises, 10);
//     clearInterval(timer);
//   } catch (err) {
//     console.log(err);
//   }
// };

function FolderUpload({ setUpload }) {
  const [files, setFiles] = useState([]);
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
  const [uploadInitiated, setUploadInitiated] = useState(false);
  const { setData } = useContext(UploadFolderContenxt);
  const path = useContext(PathContext);
  const folderProgress = useContext(UploadContext);
  const params = useParams();
  const subpath = params["*"];

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
          } = data;
          setCSRFToken(CSRFToken);
          setTrackFilesProgress(() => trackFilesProgress);
          setFilesStatus((prev) => ({
            ...prev,
            totalSize: totalSize,
            total: total,
          }));
          setFilesToUpload(toBeUploaded);
          setFiles([]);
          // console.log(CSRFToken, trackFilesProgress, totalSize);
          worker.terminate();
        }
      };
      worker.onerror = (e) => {
        setFilesToUpload([]);
        setFiles([]);
        console.error(e);
        worker.terminate();
      };
      // findFilesToUpload(
      //   pwd,
      //   files,
      //   device,
      //   setTrackFilesProgress,
      //   setCSRFToken,
      //   setFilesStatus
      // )
      //   .then((files) => {
      //     setFilesToUpload(files);
      //     setFiles([]);
      //   })
      //   .catch((err) => {
      //     setFilesToUpload([]);
      //     setFiles([]);
      //     console.log(err);
      //   });
    }
  }, [device, files, pwd]);
  useEffect(() => {
    setPreparingFiles(false);
    if (filesToUpload.length > 0) {
      setUpload("folder");
      setShowProgress(true);
      setUploadCompleted(false);
      const worker = new Worker(new URL("../worker.js", import.meta.url), {
        type: "module",
      });
      worker.postMessage({
        mode: "upload",
        filesToUpload,
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
          console.log(processed);
          setFilesStatus((prev) => ({ ...prev, processed }));
        } else if (mode === "filesStatus_uploaded") {
          const { uploaded } = data;
          setFilesStatus((prev) => ({ ...prev, uploaded }));
        } else if (mode === "uploadInitiated") {
          const { uploadStarted } = data;
          setUploadInitiated(uploadStarted);
        } else if (mode === "uploadProgress") {
          const { fileName, fileBody } = data;
          setTrackFilesProgress((prev) =>
            new Map(prev).set(fileName, fileBody)
          );
        } else if (mode === "finish") {
          // setUpload(null);
          setFilesToUpload([]);
          setUploadCompleted(true);
          console.log("file upload complete");
          worker.terminate();
        }
      };
      worker.onerror = (e) => {
        console.error(e);
      };

      // uploadFiles(
      //   filesToUpload,
      //   pwd,
      //   device,
      //   CSRFToken,
      //   filesStatus.totalSize,
      //   setTrackFilesProgress,
      //   setFilesStatus,
      //   setUploadInitiated
      // )
      //   .then(() => {
      //     //   setUpload(null);
      //     setFilesToUpload([]);
      //     setUploadCompleted(true);
      //     console.log("file upload complete");
      //   })
      //   .catch((err) => {
      //     //   setUpload(null);
      //     setFilesToUpload([]);
      //     setUploadCompleted(true);
      //     console.log(err);
      //   });
    }
  }, [filesToUpload]);

  const handleFolderSelection = (e) => {
    console.log("triggered before set preparing files");
    setPreparingFiles(true);
    setUploadInitiated(false);
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
