/* global importScripts */
/* global forge*/

// https://github.com/goto-bus-stop/from2-blob/tree/master
import { fileUploadURL, username } from "./config.js";
import { encryptFile } from "./encryptutil.js";
import { deriveKey, encryptMessage } from "./cryptoutil.js";
import { hashChunk, hashFile, hashFileChunked } from "./hashFile.js";
import {
  arrayBufferToBinaryString,
  binaryStringToArrayBuffer,
  generateRandomBytes,
  arrayBufferToHex,
  formatBytes,
  formatSeconds,
} from "./util.js";

// eslint-disable-next-line no-restricted-globals
self.window = self;

importScripts(new URL("../dist/forge.js", import.meta.url));

const uploadFile = (
  socket_worker_id,
  socket_main_id,
  file,
  cwd,
  modified,
  device,
  CSRFToken,
  filesProgress,
  trackFilesProgress,
  filesStatus,
  socket
) => {
  return new Promise(async (resolve, reject) => {
    let progress = 0;
    let uploadedBytes = 0;
    let eta = 0;
    let speed = "0 B/s";
    let filePath;
    const ETA = (timeStarted) => {
      const timeElapsed = new Date() - timeStarted;
      const uploadSpeed = uploadedBytes / (timeElapsed / 1000);
      const time = (file.size - uploadedBytes) / uploadSpeed;
      speed = formatBytes(uploadSpeed) + "/s";
      eta = formatSeconds(time);
    };

    // const updateFileState = (state, error) => {
    //   let body = {
    //     name: file.name,
    //     progress: progress,
    //     status: state,
    //     transferred: formatBytes(uploadedBytes),
    //     size: formatBytes(file.size),
    //     speed: speed,
    //     folder: file.webkitRelativePath.split("/").slice(0, -1).join("/"),
    //     eta: eta,
    //   };

    //   if (error !== null) {
    //     body.error = error;
    //   }
    //   postMessage({
    //     mode: "uploadProgress",
    //     fileName:
    //       file.webkitRelativePath === "" ? file.name : file.webkitRelativePath,
    //     fileBody: body,
    //   });
    // };

    postMessage({
      mode: "fileUploadInitiated",
      startTime: new Date(),
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
        // updateFileState("failed", "Empty File");
        postFileStatus("failed", "Empty File");
        reject(`Empty file`);
        return;
      }

      let fileStat = {
        atimeMs: file.lastModified,
        mtimeMs: file.lastModified,
        mtime: file.lastModifiedDate,
        modified: modified,
        size: file.size,
        socket_main_id,
        socket_worker_id,
        name: file.name,
        id:
          file.webkitRelativePath === "" ? file.name : file.webkitRelativePath,
      };

      let headers = {
        filename: file.name,
        dir: dir,
        devicename: device,
        // username: username,
        // "Content-Type": "application/octet-stream",
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
      const timeStarted = new Date();
      const timer = setInterval(ETA, 1000, timeStarted);
      // const {
      //   encryptedFile,
      //   saltCrypto,
      //   ivCrypto,
      //   // enc_fileName_crypto,
      //   // enc_directory_crypto,
      // } = await encryptFile(file, "sandy86kumar", dir);

      // fileStat.salt = arrayBufferToHex(saltCrypto);
      // fileStat.iv = arrayBufferToHex(ivCrypto);
      // fileStat.enc_filename = enc_fileName_crypto;
      // fileStat.enc_directory = enc_directory_crypto;
      // headers.enc_file_checksum = await hashChunk(encryptedFile);
      headers.filestat = JSON.stringify(fileStat);

      const formData = new FormData();
      // formData.append("file", new Blob([encryptedFile]));
      // formData.append("hash", fileStat.checksum);
      // formData.append("hashAlgorithm", "sha256");

      formData.append("file", file);
      let xhr = new XMLHttpRequest();
      xhr.open("POST", fileUploadURL, true);
      for (const key in headers) {
        xhr.setRequestHeader(key, headers[key]);
      }
      xhr.send(formData);

      xhr.onload = () => {
        if (xhr.status === 200) {
          // updateFileState("uploaded", null);
          clearInterval(timer);
          resolve(xhr.response);
        } else {
          switch (xhr.status) {
            case 500:
              // updateFileState("failed", xhr.response);
              postFileStatus("failed", xhr.response);
              clearInterval(timer);
              reject(xhr.response);
              break;
            case 401:
              // updateFileState("failed", xhr.response);
              postFileStatus("failed", xhr.response);
              clearInterval(timer);
              reject(xhr.response);
              break;
            case 403:
              // updateFileState("failed", xhr.response);
              postFileStatus("failed", xhr.response);
              clearInterval(timer);
              reject(xhr.response);
              break;
            default:
              // updateFileState("failed", xhr.response);
              postFileStatus("failed", xhr.response);
              clearInterval(timer);
              reject(xhr.response);
          }
        }
      };
      // xhr.onprogress = (event) => {
      //   progress = Math.round((event.loaded / event.total) * 100);
      //   if (event.lengthComputable && progress === 100) {
      //     uploadedBytes += file.size;
      //     updateFileState("uploading", null);
      //     filesProgress.uploaded = filesProgress.uploaded + file.size;
      //     filesStatus = {
      //       ...filesStatus,
      //       uploaded: filesStatus.uploaded + file.size,
      //     };
      //     postMessage({
      //       mode: "filesStatus_uploaded",
      //       uploaded: filesStatus.uploaded + file.size,
      //     });
      //   } else if (event.lengthComputable && progress !== 100) {
      //     uploadedBytes += parseInt(file.size * (progress / 100));
      //     updateFileState("uploading", null);
      //     filesProgress.uploaded =
      //       filesProgress.uploaded + parseInt(file.size * (progress / 100));
      //     filesStatus = {
      //       ...filesStatus,
      //       uploaded:
      //         filesStatus.uploaded + parseInt(file.size * (progress / 100)),
      //     };
      //     postMessage({
      //       mode: "filesStatus_uploaded",
      //       uploaded:
      //         filesStatus.uploaded + parseInt(file.size * (progress / 100)),
      //     });
      //   }
      // };
      xhr.onerror = (e) => {
        console.error(e);
        reject(e);
      };

      // socket.on("uploadStart", ({ start }) => {
      //   updateFileState("uploading", null);
      //   filesProgress.uploaded = 0;
      //   filesStatus = {
      //     ...filesStatus,
      //     uploaded: filesStatus.uploaded,
      //   };
      //   postMessage({
      //     mode: "filesStatus_uploaded",
      //     uploaded: filesStatus.uploaded,
      //   });
      // });

      // socket.on("done", ({ done, data }) => {
      //   if (done === "success") {
      //     updateFileState("uploaded", null);
      //     clearInterval(timer);
      //   } else if (done === "failure") {
      //     updateFileState("failed", data);
      //     clearInterval(timer);
      //   }
      // });

      // socket.on("fileProgress", ({ payload }) => {
      //   const { uploaded } = payload;
      //   filesProgress.uploaded =
      //     filesProgress.uploaded + uploaded - uploadedBytes;
      //   filesStatus = {
      //     ...filesStatus,
      //     uploaded: filesStatus.uploaded + uploaded - uploadedBytes,
      //   };
      //   uploadedBytes = uploaded;
      // });

      // socket.on("uploadProgress", ({ processed, total, uploaded }) => {
      //   progress = processed;
      //   if (progress === 100) {
      //     updateFileState("uploading", null);
      //     filesProgress.uploaded =
      //       filesProgress.uploaded + uploaded - uploadedBytes;
      //     filesStatus = {
      //       ...filesStatus,
      //       uploaded: filesStatus.uploaded + uploaded - uploadedBytes,
      //     };
      //     postMessage({
      //       mode: "filesStatus_uploaded",
      //       uploaded: filesStatus.uploaded + uploaded - uploadedBytes,
      //     });
      //     uploadedBytes = uploaded;
      //   } else if (progress < 100) {
      //     updateFileState("uploading", null);
      //     filesProgress.uploaded =
      //       filesProgress.uploaded + uploaded - uploadedBytes;
      //     filesStatus = {
      //       ...filesStatus,
      //       uploaded: filesStatus.uploaded + uploaded - uploadedBytes,
      //     };
      //     postMessage({
      //       mode: "filesStatus_uploaded",
      //       uploaded: filesStatus.uploaded + uploaded - uploadedBytes,
      //     });
      //     uploadedBytes = uploaded;
      //   }
      // });
      // const reader = new FileReader();

      // const timeStarted = new Date();
      // const timer = setInterval(ETA, 1000, timeStarted);

      // const loadNextChunk = () => {
      //   let start = currentChunk * CHUNK_SIZE;
      //   let end = Math.min(start + CHUNK_SIZE, file.size);
      //   reader.readAsArrayBuffer(file.slice(start, end));
      // };

      // const CHUNK_SIZE = 1024 * 1024 * 1;
      // const MAX_RETRIES = 3;
      // let retries = 0;
      // let currentChunk = 0;
      // const totalChunks = Math.ceil(file.size / CHUNK_SIZE);
      // let hash_file = forge.md.sha256.create();

      // let hash_enc_file = forge.md.sha256.create();

      // headers["filemode"] = "w";

      // const salt = generateRandomBytes(32);
      // const iv_buffer = generateRandomBytes(16);
      // const iv = arrayBufferToBinaryString(iv_buffer);
      // const key = await deriveKey("sandy86kumar", salt);

      // const enc_fileName = encryptMessage("AES-CBC", file.name, key, iv);

      // const enc_directory = encryptMessage("AES-CBC", dir, key, iv);

      // const cipher = forge.cipher.createCipher("AES-CBC", key);
      // cipher.start({ iv: iv });

      // fileStat.salt = arrayBufferToHex(salt);
      // fileStat.iv = arrayBufferToHex(iv_buffer);
      // fileStat.enc_filename = enc_fileName;
      // fileStat.enc_directory = enc_directory;
      // if (totalChunks === 1) {
      //   headers["totalchunks"] = 1;
      //   loadNextChunk();
      // } else {
      //   headers["totalchunks"] = totalChunks;
      //   loadNextChunk();
      // }

      // const uploadChunk = (chunk) => {
      //   headers["currentchunk"] = currentChunk + 1;
      //   if (headers["currentchunk"] === totalChunks) {
      //     fileStat.checksum = hash_file.digest().toHex();

      //     headers.enc_file_checksum = hash_enc_file.digest().toHex();
      //   }

      //   headers.filestat = JSON.stringify(fileStat);

      //   let xhr = new XMLHttpRequest();

      //   xhr.open("POST", fileUploadURL, true);

      //   xhr.setRequestHeader("Content-Type", "application/octet-stream");
      //   for (const key in headers) {
      //     xhr.setRequestHeader(key, headers[key]);
      //   }

      //   xhr.send(chunk);

      //   xhr.onload = () => {
      //     if (xhr.status === 200) {
      //       currentChunk++;
      //       if (currentChunk < file.size / CHUNK_SIZE) {
      //         headers["filemode"] = "a";
      //         loadNextChunk();
      //       } else {
      //         updateFileState("uploaded", null);
      //         clearInterval(timer);
      //         resolve(xhr.response);
      //       }
      //     } else {
      //       console.log(xhr.status, xhr.response);
      //       if (retries < MAX_RETRIES) {
      //         retries++;
      //         uploadChunk(chunk);
      //       } else {
      //         switch (xhr.status) {
      //           case 500:
      //             updateFileState("failed", xhr.response);
      //             reject(xhr.response);
      //             break;
      //           case 401:
      //             updateFileState("failed", xhr.response);
      //             reject(xhr.response);
      //             break;
      //           case 403:
      //             updateFileState("failed", xhr.response);
      //             reject(xhr.response);
      //             break;
      //           default:
      //             updateFileState("failed", xhr.response);
      //             reject(xhr.response);
      //         }
      //       }
      //     }
      //   };
      //   xhr.onprogress = (event) => {
      //     progress = Math.round(
      //       ((currentChunk + 1) / totalChunks) *
      //         (event.loaded / event.total) *
      //         100
      //     );
      //     uploadedBytes += currentChunkSize;
      //     updateFileState("uploading", null);
      //     filesProgress.uploaded = filesProgress.uploaded + currentChunkSize;
      //     filesStatus = {
      //       ...filesStatus,
      //       uploaded: filesStatus.uploaded + currentChunkSize,
      //     };
      //     postMessage({
      //       mode: "filesStatus_uploaded",
      //       uploaded: filesStatus.uploaded + currentChunkSize,
      //     });
      //   };

      //   xhr.onerror = (err) => {
      //     console.error(err);
      //     reject(err);
      //   };
      // };

      // reader.onload = async (event) => {
      //   const chunk = event.target.result;
      //   hash_file.update(arrayBufferToBinaryString(chunk));
      //   cipher.update(forge.util.createBuffer(chunk));
      //   let encryptedChunk;
      //   if (currentChunk === totalChunks - 1) {
      //     cipher.finish();
      //     encryptedChunk = cipher.output.getBytes();
      //   } else {
      //     encryptedChunk = cipher.output.getBytes();
      //   }
      //   hash_enc_file.update(encryptedChunk);
      //   let hash_enc_chunk = forge.md.sha256.create();
      //   hash_enc_chunk.update(encryptedChunk);
      //   headers.encchunkhash = hash_enc_chunk.digest().toHex();
      //   const arrBuffer = binaryStringToArrayBuffer(encryptedChunk);
      //   currentChunkSize = arrBuffer.byteLength;
      //   uploadChunk(arrBuffer);
      // };

      // reader.onerror = (err) => {
      //   updateFileState("failed", err);
      //   console.log(err);
      // };
    } catch (err) {
      // updateFileState("failed", err);
      reject(err);
    }
  });
};

export { uploadFile };

// axios
//   .post(fileUploadURL, chunk, {
//     headers: headers,
//     onUploadProgress: function (event) {
//       progress = Math.round(
//         ((currentChunk + 1) / totalChunks) * event.progress * 100
//       );
//       uploadedBytes += currentChunkSize;
//       updateFileState("uploading", null);
//       filesProgress.uploaded =
//         filesProgress.uploaded + currentChunkSize;
//       setFilesStatus((prev) => ({
//         ...prev,
//         uploaded: prev.uploaded + currentChunkSize,
//       }));
//     },
//   })
//   .then(function (response) {
//     currentChunk++;
//     if (currentChunk < file.size / CHUNK_SIZE) {
//       headers["filemode"] = "a";
//       loadNextChunk();
//     } else {
//       updateFileState("uploaded", null);
//       clearInterval(timer);
//       resolve(response.data);
//     }
//   })
//   .catch(function (error) {
//     console.log(error);
//     if (retries < MAX_RETRIES) {
//       retries++;
//       uploadChunk(chunk);
//     } else {
//       if (error.response) {
//         switch (error.response.status) {
//           case 500:
//             updateFileState("failed", error.response.data);
//             reject(error.response.data);
//             break;
//           case 401:
//             updateFileState("failed", error.response.data);
//             reject(error.response.data);
//             break;
//           case 403:
//             updateFileState("failed", error.response.data);
//             reject(error.response.data);
//             break;
//           default:
//             updateFileState("failed", error.response.data);
//             reject(error);
//         }
//       } else {
//         updateFileState("failed", error);
//         reject(error);
//       }
//     }
//   });
