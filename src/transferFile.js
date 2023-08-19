/* global forge */
/* global axios */

import { fileUploadURL, username } from "./config.js";
import { deriveKey, encryptMessage } from "./cryptoutil.js";
import {
  arrayBufferToBinaryString,
  binaryStringToArrayBuffer,
  generateRandomBytes,
  arrayBufferToHex,
  formatBytes,
  formatSeconds,
} from "./util.js";

const uploadFile = (
  file,
  cwd,
  modified,
  device,
  CSRFToken,
  setTrackFilesProgress
) => {
  return new Promise(async (resolve, reject) => {
    let progress = 0;
    let uploadedBytes = 0;
    let currentChunkSize = 0;
    let eta = 0;
    let filePath;
    const ETA = (timeStarted) => {
      const timeElapsed = new Date() - timeStarted;
      const uploadSpeed = uploadedBytes / (timeElapsed / 1000);
      const time = (file.size - uploadedBytes) / uploadSpeed;
      eta = formatSeconds(time);
    };

    const updateFileState = (state, error) => {
      let body = {
        name: file.name,
        progress: progress,
        status: state,
        size: formatBytes(file.size),
        bytes: file.size,
        folder: file.webkitRelativePath.split("/").slice(0, -1).join("/"),
        eta: eta,
      };

      if (error !== null) {
        body.error = error;
      }
      setTrackFilesProgress((prev) =>
        new Map(prev).set(
          file.webkitRelativePath === "" ? file.name : file.webkitRelativePath,
          body
        )
      );
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
        reject(`Empty file`);
        updateFileState("failed", "Empty File");
        return;
      }

      let fileStat = {
        atimeMs: file.lastModified,
        mtimeMs: file.lastModified,
        mtime: file.lastModifiedDate,
        modified: modified,
        size: file.size,
      };

      let headers = {
        filename: file.name,
        dir: dir,
        devicename: device,
        username: username,
        "Content-Type": "application/octet-stream",
        "Content-Disposition": `attachment; filename="${file.name}"`,
        "X-CSRF-Token": CSRFToken,
      };
      if (file.hasOwnProperty("hash")) {
        fileStat.checksum = file.hash;
      }

      const reader = new FileReader();
      const timeStarted = new Date();
      const timer = setInterval(ETA, 1000, timeStarted);

      const loadNextChunk = () => {
        let start = currentChunk * CHUNK_SIZE;
        let end = Math.min(start + CHUNK_SIZE, file.size);
        reader.readAsArrayBuffer(file.slice(start, end));
      };

      const CHUNK_SIZE = 1024 * 1024 * 1;
      const MAX_RETRIES = 3;
      let retries = 0;
      let currentChunk = 0;
      const totalChunks = Math.ceil(file.size / CHUNK_SIZE);
      let hash_file = forge.md.sha256.create();
      let hash_enc_file = forge.md.sha256.create();
      headers["filemode"] = "w";

      const salt = generateRandomBytes(32);
      const iv_buffer = generateRandomBytes(16);
      const iv = arrayBufferToBinaryString(iv_buffer);
      const key = await deriveKey("sandy86kumar", salt);

      const enc_fileName = encryptMessage("AES-CBC", file.name, key, iv);

      const enc_directory = encryptMessage("AES-CBC", dir, key, iv);

      const cipher = forge.cipher.createCipher("AES-CBC", key);
      cipher.start({ iv: iv });

      fileStat.salt = arrayBufferToHex(salt);
      fileStat.iv = arrayBufferToHex(iv_buffer);
      fileStat.enc_filename = enc_fileName;
      fileStat.enc_directory = enc_directory;
      if (totalChunks === 1) {
        headers["totalchunks"] = 1;
        loadNextChunk();
      } else {
        headers["totalchunks"] = totalChunks;
        loadNextChunk();
      }

      const uploadChunk = (chunk) => {
        headers["currentchunk"] = currentChunk + 1;
        if (headers["currentchunk"] === totalChunks) {
          fileStat.checksum = hash_file.digest().toHex();
          headers.enc_file_checksum = hash_enc_file.digest().toHex();
        }

        headers.filestat = JSON.stringify(fileStat);
        axios
          .post(fileUploadURL, chunk, {
            headers: headers,
            onUploadProgress: function (event) {
              progress = Math.round(
                ((currentChunk + 1) / totalChunks) * event.progress * 100
              );
              uploadedBytes += currentChunkSize;
              updateFileState("uploading", null);
            },
          })
          .then(function (response) {
            currentChunk++;
            if (currentChunk < file.size / CHUNK_SIZE) {
              headers["filemode"] = "a";
              loadNextChunk();
            } else {
              updateFileState("uploaded", null);
              clearInterval(timer);
              resolve(response.data);
            }
          })
          .catch(function (error) {
            console.log(error);
            if (retries < MAX_RETRIES) {
              retries++;
              uploadChunk(chunk);
            } else {
              if (error.response) {
                switch (error.response.status) {
                  case 500:
                    updateFileState("failed", error.response.data);
                    reject(error.response.data);
                    break;
                  case 401:
                    updateFileState("failed", error.response.data);
                    reject(error.response.data);
                    break;
                  case 403:
                    updateFileState("failed", error.response.data);
                    reject(error.response.data);
                    break;
                  default:
                    updateFileState("failed", error.response.data);
                    reject(error);
                }
              } else {
                updateFileState("failed", error);
                reject(error);
              }
            }
          });
      };

      reader.onload = async (event) => {
        const chunk = event.target.result;
        hash_file.update(arrayBufferToBinaryString(chunk));
        cipher.update(forge.util.createBuffer(chunk));
        let encryptedChunk;
        if (currentChunk === totalChunks - 1) {
          cipher.finish();
          encryptedChunk = cipher.output.getBytes();
        } else {
          encryptedChunk = cipher.output.getBytes();
        }
        hash_enc_file.update(encryptedChunk);
        let hash_enc_chunk = forge.md.sha256.create();
        hash_enc_chunk.update(encryptedChunk);
        headers.encchunkhash = hash_enc_chunk.digest().toHex();
        const arrBuffer = binaryStringToArrayBuffer(encryptedChunk);
        currentChunkSize = arrBuffer.byteLength;
        uploadChunk(arrBuffer);
      };

      reader.onerror = (err) => {
        updateFileState("failed", err);
        console.log(err);
      };
    } catch (err) {
      updateFileState("failed", err);
      reject(err);
    }
  });
};

export { uploadFile };
