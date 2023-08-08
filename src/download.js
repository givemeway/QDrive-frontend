/* global forge */
/* global axios */
import { streamDownloadDecryptToDisk, saveFile } from "./util.js";

export const download = async (fileDownloadPath) => {
  console.log("download clicked");
  console.log(fileDownloadPath);
  await streamDownloadDecryptToDisk(fileDownloadPath);

  console.log("file decrypted");
};
