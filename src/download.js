import { csrftokenURL, downloadURL, filesFoldersURL } from "./config";
import { deriveKey } from "./cryptoutil.js";
import {
  hexToBuffer,
  arrayBufferToBinaryString,
  streamDownloadDecryptToDisk,
} from "./util.js";

let file = document.getElementById("fileDownload");

file.addEventListener("click", async () => {
  console.log("download clicked");
  const response = await fetch(csrftokenURL);
  const { CSRFToken } = await response.json();
  const headers = {
    "X-CSRF-Token": CSRFToken,
    devicename: "DESKTOP-10RSGE8",
    username: "sandeep.kumar@idriveinc.com",
    currentdirectory: "Downloads",
    sortorder: "ASC",
  };

  let file = {};

  let res = await axios.post(filesFoldersURL, {}, { headers: headers });
  console.log(res);
  res.data.files.forEach((element) => {
    if (element.filename === "whereareyou.exe") {
      file.salt = element.salt;
      file.iv = element.iv;
    }
  });
  console.log(file);

  const key = deriveKey("sandy86kumar", hexToBuffer(file.salt), 100000, 256);

  const iv_buffer = hexToBuffer(file.iv);
  const iv_binaryString = arrayBufferToBinaryString(iv_buffer);

  const cipher = forge.cipher.createDecipher("AES-CBC", key);
  cipher.start({ iv: iv_binaryString });

  await streamDownloadDecryptToDisk(downloadURL, cipher);
  let result = cipher.finish();
  if (result) {
    console.log("file decrypted");
  }
});
