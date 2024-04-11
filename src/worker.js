/* global importScripts */
/* global async*/
import { getfilesCurDir, compareFiles } from "./filesInfo.js";
import { uploadFile } from "./transferFile.js";
import { csrftokenURL, concurrency } from "./config.js";
import { formatBytes } from "./util.js";

importScripts(new URL("../dist/async.js", import.meta.url));

const FILE = "file";
const FOLDER = "folder";

const findFilesToUpload = async (cwd, filesList, device) => {
  try {
    let tempDeviceName;
    let backupType;
    const filePath = filesList[0].webkitRelativePath.split(/\//g)[0];
    let uploadingDirPath = cwd === "/" ? filePath : cwd + "/" + filePath;
    if (device === "/") {
      tempDeviceName = filePath;
      if (tempDeviceName.length === 0) {
        tempDeviceName = "/";
      }
      uploadingDirPath = "/";
    }
    if (filesList[0].webkitRelativePath === "") {
      tempDeviceName = device;
      uploadingDirPath = cwd;
      backupType = FILE;
    } else {
      backupType = FOLDER;
    }
    const response = await fetch(csrftokenURL);
    const { CSRFToken } = await response.json();

    const DbFiles = await getfilesCurDir(
      uploadingDirPath,
      tempDeviceName !== undefined ? tempDeviceName : device,
      CSRFToken,
      backupType
    );
    let files = await compareFiles(filesList, DbFiles, cwd, device);
    console.log("files to upload: ", files.length);
    let totalSize = 0;
    files.forEach((file) => (totalSize += file.size));

    let trackFilesProgress = {};
    files.forEach((file) => {
      const id =
        file.webkitRelativePath === "" ? file.name : file.webkitRelativePath;
      trackFilesProgress[id] = {
        name: file.name,
        startTime: 0,
        progress: 0,
        status: "queued",
        size: formatBytes(file.size),
        bytes: file.size,
        folder: file.webkitRelativePath.split("/").slice(0, -1).join("/"),
        eta: Infinity,
        speed: "",
        transferred: 0,
        transferred_b: 0,
      };
    });

    let metadata = {};
    files.forEach((file) => {
      metadata[file.webkitRelativePath] = {};
      metadata[file.webkitRelativePath]["modified"] = file.modified;
      metadata[file.webkitRelativePath]["hash"] = file.hash;
      metadata[file.webkitRelativePath]["id"] = file.id;
      metadata[file.webkitRelativePath]["uuid"] = file.uuid;
      metadata[file.webkitRelativePath]["progress"] = file.progress;
      metadata[file.webkitRelativePath]["version"] = file.version;
    });

    postMessage({
      mode: "filesToUpload",
      CSRFToken,
      trackFilesProgress,
      totalSize,
      toBeUploaded: files,
      metadata,
      total: files.length,
    });
  } catch (err) {
    console.error(err);
    return err;
  }
};

const uploadFiles = async (
  socket_main_id,
  files,
  cwd,
  device,
  CSRFToken,
  filesStatus,
  metadata
) => {
  let uploadStarted = false;
  let newFiles = [];
  for (let file of files) {
    if (metadata.hasOwnProperty(file.webkitRelativePath)) {
      file.modified = metadata[file.webkitRelativePath]["modified"];
      file.hash = metadata[file.webkitRelativePath]["hash"];
      file.progress = metadata[file.webkitRelativePath]["progress"];
      file.id = metadata[file.webkitRelativePath]["id"];
      file.uuid = metadata[file.webkitRelativePath]["uuid"];
      file.version = metadata[file.webkitRelativePath]["version"];
      newFiles.push(file);
    }
  }

  try {
    filesStatus = { ...filesStatus, total: files.length, processed: 0 };
    postMessage({
      mode: "filesStatus_total",
      total: files.length,
      processed: 0,
    });
    await async.eachLimit(newFiles, concurrency, async (file) => {
      try {
        await uploadFile(
          socket_main_id,
          file,
          cwd,
          file.modified,
          device,
          CSRFToken
        );
      } catch (err) {
        console.log(err);
      }
    });
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
      socket_main_id,
      filesToUpload,
      pwd,
      device,
      CSRFToken,
      filesStatus,
      metadata,
    } = data;
    uploadFiles(
      socket_main_id,
      filesToUpload,
      pwd,
      device,
      CSRFToken,
      filesStatus,
      metadata
    );
  }
};
