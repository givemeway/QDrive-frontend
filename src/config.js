const host = "https://localhost:3001";
const fileUploadURL = `/app/receiveFiles`;
const loginURL = `/app/login`;
const fetchFilesURL = `/app/getCurrentDirFiles`;
const deleteItemsURL = "/app/delete";
const filesFoldersURL = `/app/browseFolder`;
const getSubFoldersURL = "/app/getSubFolders";
const downloadURL = `/app/downloadFile`;
const get_download_zip = `/app/get_download_zip`;
const csrftokenURL = `/app/csrftoken`;
const downloadItemsURL = "/app/downloadItems";
const getShareLinkURL = "/app/createShare";
const getSharedItemsURL = "/app/sh";
const moveItemsURL = "/app/moveItems";
const copyItemsURL = "/app/copyItems";
const searchURL = "/app/search";
const deletedItemsURL = "/app/trash";
const renameURL = "/app/renameItem";
const devicename = "DESKTOP-10RSGE8";
const username = "sandeep.kumar@idriveinc.com";
const cwd = "/";

export {
  fileUploadURL,
  loginURL,
  fetchFilesURL,
  devicename,
  username,
  cwd,
  downloadURL,
  csrftokenURL,
  filesFoldersURL,
  deleteItemsURL,
  downloadItemsURL,
  get_download_zip,
  getShareLinkURL,
  host,
  getSharedItemsURL,
  getSubFoldersURL,
  moveItemsURL,
  searchURL,
  renameURL,
  copyItemsURL,
  deletedItemsURL,
};
