/* global importScripts */
/* global async*/
import { getfilesCurDir, compareFiles } from "./filesInfo.js";
import { uploadFile } from "./transferFile.js";
import { csrftokenURL } from "./config.js";
import { formatBytes, formatSeconds } from "./util.js";

importScripts(new URL("../dist/async.js", import.meta.url));

const findFilesToUpload = async (cwd, filesList, device) => {
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
    const response = await fetch(csrftokenURL);
    const { CSRFToken } = await response.json();
    console.log(uploadingDirPath);
    const DbFiles = await getfilesCurDir(
      uploadingDirPath,
      tempDeviceName !== undefined ? tempDeviceName : device,
      CSRFToken
    );
    let files = await compareFiles(filesList, DbFiles, cwd, device);
    console.log("files to upload: ", files.length);
    let totalSize = 0;
    files.forEach((file) => (totalSize += file.size));
    const trackFilesProgress = new Map(
      files.map((file) => [
        file.webkitRelativePath,
        {
          name: file.name,
          progress: 0,
          status: "queued",
          size: formatBytes(file.size),
          bytes: file.size,
          folder: file.webkitRelativePath.split("/").slice(0, -1).join("/"),
          eta: Infinity,
        },
      ])
    );
    postMessage({
      mode: "filesToUpload",
      CSRFToken,
      trackFilesProgress,
      totalSize,
      toBeUploaded: files,
      total: files.length,
    });
  } catch (err) {
    console.log(err);
    return err;
  }
};

const uploadFiles = async (
  files,
  cwd,
  device,
  CSRFToken,
  totalSize,
  trackFilesProgress,
  filesStatus
) => {
  let eta = Infinity;
  const filesProgress = { uploaded: 0 };

  let uploadStarted = false;

  const ETA = (timeStarted) => {
    const timeElapsed = new Date() - timeStarted;
    const uploadSpeed = filesProgress.uploaded / (timeElapsed / 1000);
    const time = (totalSize - filesProgress.uploaded) / uploadSpeed;
    eta = formatSeconds(time);
    postMessage({ mode: "filesStatus_eta", eta });
  };
  const timeStarted = new Date();
  const timer = setInterval(ETA, 1000, timeStarted);
  try {
    filesStatus = { ...filesStatus, total: files.length, processed: 0 };
    postMessage({
      mode: "filesStatus_total",
      total: files.length,
      processed: 0,
    });
    let idx = 0;
    await async.eachLimit(files, 10, async (file) => {
      try {
        await uploadFile(
          file,
          cwd,
          file.modified,
          device,
          CSRFToken,
          filesProgress,
          trackFilesProgress,
          filesStatus
        );
        filesStatus = {
          ...filesStatus,
          processed: filesStatus.processed + 1,
        };
        postMessage({
          mode: "filesStatus_processed",
          processed: filesStatus.processed,
        });

        if (idx === 0) {
          uploadStarted = true;
          postMessage({ mode: "uploadInitiated", uploadStarted });
        }
        idx++;
      } catch (err) {
        console.log(err);
      }
    });

    // const promises = [];
    // let idx = 0;
    // for (const file of files) {
    //   // eslint-disable-next-line no-loop-func
    //   promises.push(
    //     // eslint-disable-next-line no-loop-func
    //     async () => {
    //       try {
    //         await uploadFile(
    //           file,
    //           cwd,
    //           file.modified,
    //           device,
    //           CSRFToken,
    //           filesProgress,
    //           trackFilesProgress,
    //           filesStatus
    //         );
    //         filesStatus = {
    //           ...filesStatus,
    //           processed: filesStatus.processed + 1,
    //         };
    //         postMessage({
    //           mode: "filesStatus_processed",
    //           processed: filesStatus.processed,
    //         });

    //         if (idx === 0) {
    //           uploadStarted = true;
    //           postMessage({ mode: "uploadInitiated", uploadStarted });
    //         }
    //         idx++;
    //       } catch (err) {
    //         console.log(err);
    //       }
    //     }
    //   );
    // }
    // console.log(promises.length);
    // await async.parallelLimit(promises, 10);
    clearInterval(timer);
    postMessage({ mode: "finish" });
  } catch (err) {
    console.log(err);
  }
};

onmessage = ({ data }) => {
  const { mode } = data;
  if (mode === "init") {
    const { files, pwd, device } = data;
    findFilesToUpload(pwd, files, device);
  } else if (mode === "upload") {
    const {
      filesToUpload,
      pwd,
      device,
      CSRFToken,
      total,
      trackFilesProgress,
      filesStatus,
    } = data;
    uploadFiles(
      filesToUpload,
      pwd,
      device,
      CSRFToken,
      total,
      trackFilesProgress,
      filesStatus
    );
  }
};
