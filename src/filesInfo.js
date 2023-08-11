import { fetchFilesURL, username } from "./config.js";
import { hashFileChunked } from "./hashFile.js";

const getfilesCurDir = async (cwd, device, CSRFToken) => {
  console.log(device);
  console.log(cwd);
  const headers = {
    "X-CSRF-Token": CSRFToken,
    devicename: device,
    currentdirectory: cwd,
    username: username,
    start: 0,
    end: 100000,
  };
  const options = {
    method: "POST",
    mode: "cors",
    credentials: "include",
    headers: headers,
    body: { start: 0, end: 100000 },
  };

  try {
    const res = await fetch(fetchFilesURL, options);
    const data = await res.json();
    return data;
  } catch (err) {
    return err;
  }
};

const compareFiles = async (selectedFileList, DbFileList, cwd, device) => {
  if (DbFileList.length === 0) {
    return selectedFileList;
  }
  let files = new Object();
  DbFileList.forEach((file) => {
    const extractedFileName = file.filename.split(
      /\${3}[0-9a-zA-Z]{64}\${3}NA/g
    );
    let fileName = file.filename;
    if (extractedFileName.length > 1) {
      fileName = extractedFileName[0];
    }
    if (files.hasOwnProperty(file.directory)) {
      if (files[file.directory].hasOwnProperty(fileName)) {
        files[file.directory][fileName].hash.add(file.hashvalue);
        files[file.directory][fileName].lmd.add(file.last_modified);
      } else {
        files[file.directory][fileName] = new Object();
        files[file.directory][fileName].hash = new Set();
        files[file.directory][fileName].lmd = new Set();
        files[file.directory][fileName].lmd.add(file.last_modified);
        files[file.directory][fileName].hash.add(file.hashvalue);
      }
    } else {
      files[file.directory] = new Object();
      files[file.directory][fileName] = new Object();
      files[file.directory][fileName].hash = new Set();
      files[file.directory][fileName].lmd = new Set();
      files[file.directory][fileName].lmd.add(file.last_modified);
      files[file.directory][fileName].hash.add(file.hashvalue);
    }
  });
  let filesToUpload = [];
  let idx = 0;
  for (const file of selectedFileList) {
    let dirName;
    let filePath;
    if (device === "/") {
      const pathParts = file.webkitRelativePath.split("/").slice(1).join("/");
      filePath = cwd === "/" ? pathParts : cwd + "/" + pathParts;
    } else {
      const pathParts = file.webkitRelativePath;
      filePath = cwd === "/" ? pathParts : cwd + "/" + pathParts;
    }

    dirName = getDirName(filePath);
    if (files.hasOwnProperty(dirName)) {
      if (!files[dirName].hasOwnProperty(file.name)) {
        file.modified = false;
        file.id = idx;
        file.progress = 0;
        filesToUpload.push(file);
      } else {
        const localFileHash = await hashFileChunked(file);
        if (!files[dirName][file.name]["hash"].has(localFileHash)) {
          console.log("Modified");
          file.modified = true;
          file.hash = localFileHash;
          file.id = idx;
          file.progress = 0;
          filesToUpload.push(file);
        }
      }
    } else {
      file.modified = false;
      file.id = idx;
      file.progress = 0;
      filesToUpload.push(file);
    }
  }
  return filesToUpload;
};

const getDirName = (relativePath) => {
  let pathParts = relativePath.split(/\//g);
  pathParts.pop();
  if (pathParts.length === 0) {
    return "/";
  }
  const dir = pathParts.join("/");
  return dir;
};

export { getfilesCurDir, compareFiles };
