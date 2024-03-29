/* global forge */
/* global streamSaver */

import { deriveKey } from "./cryptoutil.js";

const opts = {
  suggestedName: "",
  types: [
    {
      description: "Files",
      accept: {
        "application/octet-stream": [],
      },
    },
    {
      description: "Text Files",
      accept: {
        "text/plain": [".txt", ".log"],
      },
    },
    {
      description: "Images",
      accept: {
        "image/jpeg": [".jpg", ".jpeg", ".JPG", ".JPEG"],
        "image/png": [".png"],
        "image/tiff": [".tiff", ".tif"],
      },
    },
    {
      description: "PDF files",
      accept: {
        "application/pdf": [".pdf"],
      },
    },
    {
      description: "Zip Files",
      accept: {
        "application/zip": [".zip"],
      },
    },
  ],
};

async function fetchCSRFToken(csrfurl) {
  const response = await fetch(csrfurl);
  const { CSRFToken } = await response.json();
  return CSRFToken;
}

function formatSeconds(seconds) {
  if (seconds === 0) return "0 Seconds";
  const units = ["seconds", "minutes", "hours", "days", "years"];
  let i = Math.floor(Math.log(seconds) / Math.log(60));
  const eta = parseInt(seconds / Math.pow(60, i));
  const unit = units[i];
  if (isNaN(eta) || unit === undefined) return " -- ";
  else return parseInt(seconds / Math.pow(60, i)) + " " + units[i];
}

function formatBytes(bytes) {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  const eta = parseFloat((bytes / Math.pow(k, i)).toFixed(2));
  const unit = sizes[i];
  if (isNaN(eta) || unit === undefined) {
    return " -- ";
  } else
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
}

const arrayBufferToHex = (buffer) => {
  return [...new Uint8Array(buffer)]
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
};

const generateRandomBytes = (len) => {
  let buffer = new Uint8Array(len);
  crypto.getRandomValues(buffer);
  return buffer;
};

const arrayBufferToBase64 = (buffer) => {
  let binary = "";
  let bytes = new Uint8Array(buffer);
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
};

const arrayBufferToBinaryString = (buffer) => {
  const bytes = new Uint8Array(buffer);
  let binaryString = "";
  for (let i = 0; i < bytes.length; i++) {
    binaryString += String.fromCharCode(bytes[i]);
  }
  return binaryString;
};

const binaryStringToArrayBuffer = (binaryString) => {
  let buffer = new ArrayBuffer(binaryString.length);
  let view = new Uint8Array(buffer);
  for (let i = 0; i < binaryString.length; i++) {
    view[i] = binaryString.charCodeAt(i);
  }
  return buffer;
};

const hexToBuffer = (hexString) => {
  let byteArray = new Uint8Array(hexString.length / 2);
  for (let i = 0; i < byteArray.length; i++) {
    byteArray[i] = parseInt(hexString.substr(i * 2, 2), 16);
  }
  return byteArray;
};

async function saveFile(url) {
  fetch(url)
    .then(async (response) => {
      let size = response.headers.get("content-length");
      const salt = response.headers.get("salt");
      const iv = response.headers.get("iv");
      const key = await deriveKey(
        "sandy86kumar",
        hexToBuffer(salt),
        100000,
        256
      );
      const iv_buffer = hexToBuffer(iv);
      const iv_binaryString = arrayBufferToBinaryString(iv_buffer);
      const cipher = forge.cipher.createDecipher("AES-CBC", key);
      cipher.start({ iv: iv_binaryString });
      const filename = response.headers
        .get("content-disposition")
        .split(";")[1]
        .split(/"/g)[1]
        .trim();
      const fileStream = streamSaver.createWriteStream(filename);
      let ts_dec = new TransformStream({
        async transform(chunk, controller) {
          console.log(size);
          size = size - chunk.length;
          cipher.update(forge.util.createBuffer(chunk));
          if (size === 0) {
            cipher.finish();
          }
          const decryptedChunk = cipher.output.getBytes();
          const arrBuffer = binaryStringToArrayBuffer(decryptedChunk);
          controller.enqueue(arrBuffer);
        },
      });
      response.body
        .pipeThrough(ts_dec)
        .pipeTo(fileStream)
        .then((done) => console.log(done));
    })
    .catch((err) => console.log(err));
}

async function streamDownloadDecryptToDisk(url) {
  // create readable stream for ciphertext
  let size;
  let cipher;
  const param = new URLSearchParams(url);
  const filename = param.get("file");
  let rs_src = fetch(url).then(async (response) => {
    size = response.headers.get("content-length");
    const salt = response.headers.get("salt");
    const iv = response.headers.get("iv");
    const key = await deriveKey("sandy86kumar", hexToBuffer(salt));
    const iv_buffer = hexToBuffer(iv);
    const iv_binaryString = arrayBufferToBinaryString(iv_buffer);
    cipher = forge.cipher.createDecipher("AES-CBC", key);
    cipher.start({ iv: iv_binaryString });
    return response.body;
  });

  // create writable stream for file
  opts.suggestedName = filename;
  let ws_dest = window
    .showSaveFilePicker(opts)
    .then((handle) => handle.createWritable());

  // create transform stream for decryption
  let ts_dec = new TransformStream({
    async transform(chunk, controller) {
      size = size - chunk.length;
      cipher.update(forge.util.createBuffer(chunk));
      if (size === 0) {
        cipher.finish();
      }
      const decryptedChunk = cipher.output.getBytes();
      const arrBuffer = binaryStringToArrayBuffer(decryptedChunk);
      controller.enqueue(arrBuffer);
    },
  });

  // stream cleartext to file
  let rs_clear = rs_src.then((s) => s.pipeThrough(ts_dec));
  return (await rs_clear).pipeTo(await ws_dest);
}

export {
  arrayBufferToBase64,
  binaryStringToArrayBuffer,
  generateRandomBytes,
  arrayBufferToHex,
  arrayBufferToBinaryString,
  hexToBuffer,
  streamDownloadDecryptToDisk,
  saveFile,
  formatBytes,
  formatSeconds,
  fetchCSRFToken,
};
