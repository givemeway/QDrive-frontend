/* global axios */
/* global async */
import { getfilesCurDir, compareFiles } from "./filesInfo.js";
import { uploadFile } from "./transferFile.js";
import { csrftokenURL } from "./config.js";
import { formatBytes, formatSeconds } from "./util.js";

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
      cwd,
      tempDeviceName !== undefined ? tempDeviceName : device,
      CSRFToken
    );
    let files = await compareFiles(filesList, DbFiles, cwd, device);
    console.log(files.length);
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
  setTrackFilesProgress,
  setFilesStatus,
  setUploadInitiated
) => {
  let eta = Infinity;
  const filesProgress = { uploaded: 0 };
  const ETA = (timeStarted) => {
    const timeElapsed = new Date() - timeStarted;
    const uploadSpeed = filesProgress.uploaded / (timeElapsed / 1000);
    const time = (totalSize - filesProgress.uploaded) / uploadSpeed;
    eta = formatSeconds(time);
    setFilesStatus((prev) => ({ ...prev, eta }));
  };
  const timeStarted = new Date();
  const timer = setInterval(ETA, 1000, timeStarted);
  try {
    setFilesStatus((prev) => ({ ...prev, total: files.length, processed: 0 }));

    const promises = [];
    let idx = 0;
    for (const file of files) {
      // eslint-disable-next-line no-loop-func
      promises.push(async () => {
        try {
          await uploadFile(
            file,
            cwd,
            file.modified,
            device,
            CSRFToken,
            filesProgress,
            setTrackFilesProgress,
            setFilesStatus
          );
          setFilesStatus((prev) => ({
            ...prev,
            processed: prev.processed + 1,
          }));
          if (idx === 0) {
            setUploadInitiated(true);
          }
          idx++;
        } catch (err) {
          console.log(err);
        }
      });
    }

    await async.parallelLimit(promises, 10);
    clearInterval(timer);
  } catch (err) {
    console.log(err);
  }
};

onmessage = ({ data }) => {
  const { mode, files, pwd, device } = data;
  if (mode === "init") {
    console.log(mode, files, pwd, device);

    findFilesToUpload(pwd, files, device);
  }
};
