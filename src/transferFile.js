// https://github.com/goto-bus-stop/from2-blob/tree/master
import { fileUploadURL } from "./config.js";

import { hashFileChunked } from "./hashFile.js";

// eslint-disable-next-line no-restricted-globals
self.window = self;

// importScripts(new URL("../dist/forge.js", import.meta.url));

const uploadFile = (socket_main_id, file, cwd, modified, device, CSRFToken) => {
  return new Promise(async (resolve, reject) => {
    let filePath;
    postMessage({
      mode: "fileUploadInitiated",
      startTime: Date.now(),
      id: file.webkitRelativePath === "" ? file.name : file.webkitRelativePath,
    });

    const postFileStatus = (status, error) => {
      postMessage({
        mode: status,
        name: file.name,
        id:
          file.webkitRelativePath === "" ? file.name : file.webkitRelativePath,
        error: error,
      });
    };

    try {
      if (device !== "/") {
        filePath =
          cwd === "/"
            ? file.webkitRelativePath
            : cwd + "/" + file.webkitRelativePath;
      } else {
        filePath =
          cwd === "/"
            ? file.webkitRelativePath.split(/\//g).slice(1).join("/")
            : cwd +
              "/" +
              file.webkitRelativePath.split(/\//g).slice(1).join("/");

        device = file.webkitRelativePath.split(/\//g)[0];
      }
      const pathParts = filePath.split("/");
      pathParts.pop();
      let dir = pathParts.join("/");

      if (dir.length === 0) {
        dir = "/";
      }
      if (device.length === 0) {
        device = "/";
      }
      if (file.size === 0) {
        postFileStatus("failed", "Empty File");
        reject(`Empty file`);
        return;
      }

      let fileStat = {
        atimeMs: file.lastModified,
        mtimeMs: file.lastModified,
        mtime: file.lastModified,
        modified: modified,
        size: file.size,
        socket_main_id,
        name: file.name,
        id:
          file.webkitRelativePath === "" ? file.name : file.webkitRelativePath,
      };

      let headers = {
        filename: file.name,
        dir: dir,
        devicename: device,
        "Content-Disposition": `attachment; filename="${file.name}"`,
        "X-CSRF-Token": CSRFToken,
      };

      if (!file.hash) {
        fileStat.checksum = await hashFileChunked(
          file.slice(0, file.size),
          file.size
        );
      } else {
        fileStat.checksum = file.hash;
      }

      if (modified) {
        fileStat.uuid = file.uuid;
        fileStat.version = file.version;
      }

      headers.filestat = JSON.stringify(fileStat);

      const formData = new FormData();

      formData.append("file", file);
      let xhr = new XMLHttpRequest();
      xhr.withCredentials = true;
      xhr.open("POST", fileUploadURL, true);

      for (const key in headers) {
        xhr.setRequestHeader(key, headers[key]);
      }
      xhr.send(formData);

      xhr.onload = () => {
        if (xhr.status === 200) {
          resolve(xhr.response);
        } else {
          switch (xhr.status) {
            case 500:
              postFileStatus("failed", xhr.response);
              reject(xhr.response);
              break;
            case 401:
              postFileStatus("failed", xhr.response);
              reject(xhr.response);
              break;
            case 403:
              postFileStatus("failed", xhr.response);
              reject(xhr.response);
              break;
            default:
              postFileStatus("failed", xhr.response);
              reject(xhr.response);
          }
        }
      };

      xhr.onerror = (e) => {
        postFileStatus("failed", e);
        console.error(e);
        reject(e);
      };
    } catch (err) {
      // updateFileState("failed", err);
      postFileStatus("failed", err);
      reject(err);
    }
  });
};

export { uploadFile };
