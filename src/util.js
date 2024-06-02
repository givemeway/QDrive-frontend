/* global forge */
/* global streamSaver */

import { deriveKey } from "./cryptoutil.js";
import {
  downloadURL,
  timeOpts,
  server,
  folder,
  file as FILE,
  PRODUCTION,
} from "./config.js";

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

export const get_url = (file) => {
  if (process.env.NODE_ENV === PRODUCTION) {
    return `${downloadURL}?file=${encodeURIComponent(
      file.filename
    )}&uuid=${encodeURIComponent(file.uuid)}&db=files&dir=${
      file.directory
    }&device=${file.device}`;
  }
  return `${server}${downloadURL}?file=${encodeURIComponent(
    file.filename
  )}&uuid=${encodeURIComponent(file.uuid)}&db=files&dir=${
    file.directory
  }&device=${file.device}`;
};

const get_file_path = (file) => {
  if (file.directory === "/" && file.device === "/") return "/";
  if (file.device !== "/" && file.directory === "/") return "/" + file.device;
  if (file.device !== "/" && file.directory !== "/")
    return "/" + file.device + "/" + file.directory;
};

const get_id = (file) => {
  return `file;${file.uuid};device=${encodeURIComponent(
    file.device
  )}&dir=${encodeURIComponent(file.directory)}&file=${encodeURIComponent(
    file.filename
  )};${file.filename};${file.origin};${file.directory};${file.device};${
    file.versions
  }`;
};

const buildCellValueForFolder = (fo) => {
  return {
    id: `${folder};${fo.uuid};${fo.path};${fo.folder};${fo.uuid};${fo.device}`,
    icon: folder,
    name: fo.folder,
    size: "--",
    path: fo.path,
    versions: "--",
    last_modified: new Date(fo.created_at).toLocaleString("en-in", timeOpts),
    item: folder,
  };
};

export const buildCellValueForFile_trash = (file) => {
  return {
    id: file.id,
    item: "file",
    name: file.name,
    path: file.path,
    begin: file?.limit?.begin,
    end: file?.limit?.end,
    items: file?.items,
    deleted: new Date(file.deleted).toLocaleString("en-in", timeOpts),
  };
};

export const buildCellValueForFolder_trash = (folder) => {
  return {
    id: folder.id,
    item: "folder",
    name: folder.name,
    path: folder.path,
    begin: folder?.limit?.begin,
    end: folder?.limit?.end,
    items: folder?.items,
    deleted: new Date(folder.deleted).toLocaleString("en-in", timeOpts),
  };
};

const buildIndividualFilePath = (device, directory) => {
  if (device === "/") {
    return "/";
  } else if (directory === "/") {
    return "/" + device;
  } else {
    return `/${device}/${directory}`;
  }
};

export const buildCellValueForSingleFile_trash = (file) => {
  return {
    id: file.uuid,
    item: "singleFile",
    name: file.filename,
    origin: file.origin,
    path: buildIndividualFilePath(file.device, file.directory),
    begin: 0,
    end: 0,
    deleted: new Date(file.deletion_date).toLocaleString("en-in", timeOpts),
  };
};

const extract_info_from_id = (id) => {
  let file;
  let folder;
  const item = id.split(";");
  if (item[0] === "file") {
    file = {
      id: item[1],
      path: item[2],
      file: item[3],
      origin: item[4],
      dir: item[5],
      device: item[6],
      versions: parseInt(item[7]),
    };
  }
  if (item[0] === "folder") {
    folder = {
      id: item[1],
      path: item[2],
      folder: item[3],
      uuid: item[4],
      device: item[5],
    };
  }
  return { file, folder };
};

export const extract_items_from_ids = (rowSelection) => {
  const files = [];
  const folders = [];
  if (Array.isArray(rowSelection)) {
    for (const id of rowSelection) {
      const { file, folder } = extract_info_from_id(id);
      if (file) files.push(file);
      if (folder) folders.push(folder);
    }
  } else {
    for (const [id, val] of Object.entries(rowSelection)) {
      if (val) {
        const { file, folder } = extract_info_from_id(id);
        if (file) files.push(file);
        if (folder) folders.push(folder);
      }
    }
  }

  return { files, folders };
};

const buildCellValueForFile = (file) => {
  return {
    id: get_id(file),
    name: file.filename,
    icon: FILE,
    size: formatBytes(file.size),
    dir: file.directory,
    path: get_file_path(file),
    url: get_url(file),
    thumbURL: file?.signedURL,
    origin: file.origin,
    versions: file.versions,
    last_modified: new Date(file.last_modified).toLocaleString(
      "en-IN",
      timeOpts
    ),
    item: FILE,
  };
};

function ensureStartsWithSlash(input) {
  return input.startsWith("/") ? input : "/" + input;
}

function generateLink(navPath, params, row, preview = 0) {
  const { path, layout, nav } = params;
  const id = row.id.split(";")[4];
  let dir;
  if (nav === null) {
    const tempDir = row.path.split("/").slice(2).join("/");
    dir = tempDir === "" ? "" : "/" + tempDir;
  } else {
    dir = row.path.split(nav)[1];
  }
  if (layout === "dashboard" && preview === 1)
    return "/dashboard/" + navPath + "?preview=" + row.name;

  if (layout === "dashboard" && preview === 0) return path + row.path;

  if (layout === "share" && preview === 0)
    return dir === "" ? path + `/h?k=${id}` : path + `/h${dir}?k=${id}`;

  if (layout === "share" && preview === 1)
    return dir === ""
      ? path + `/h?preview=${row.name}&k=${id}`
      : path + `/h${dir}?preview=${row.name}&k=${id}`;
  if (layout === "transfer" && nav === "/") {
    dir = row.path.split(nav).slice(1).join("/");
    if (preview === 0)
      return dir === ""
        ? path + `/h?k=${id}`
        : path + "/h" + ensureStartsWithSlash(dir) + `?k=${id}`;
    if (preview === 1)
      return dir === ""
        ? path + `/h?preview=${row.name}&k=${id}`
        : path +
            "/h" +
            ensureStartsWithSlash(dir) +
            `?preview=${row.name}&k=${id}`;
  }
  if (layout === "transfer" && nav !== "/") {
    if (preview === 0)
      return dir === ""
        ? path + `/h?k=${id}`
        : path + "/h" + ensureStartsWithSlash(dir) + `?k=${id}`;
    if (preview === 1)
      return dir === ""
        ? path + `/h?preview=${row.name}&k=${id}`
        : path +
            "/h" +
            ensureStartsWithSlash(dir) +
            `?preview=${row.name}&k=${id}`;
  }
  if (layout === "photos") {
    return path + "?preview";
  }
}

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
  generateLink,
  buildCellValueForFile,
  buildCellValueForFolder,
};
