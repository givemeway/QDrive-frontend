const host = process.env.REACT_APP_BASE_API_URL;
const server = process.env.REACT_APP_BASE_API_URL;
const PRODUCTION = "production";
console.log(process.env.REACT_APP_BASE_API_URL, process.env.REACT_APP_ENV);
const fileUploadURL =
  process.env.REACT_APP_ENV === PRODUCTION
    ? server + `/app/receiveFiles`
    : `/app/receiveFiles`;
const loginURL =
  process.env.REACT_APP_ENV === PRODUCTION
    ? server + `/app/login`
    : `/app/login`;
const fetchFilesURL =
  process.env.REACT_APP_ENV === PRODUCTION
    ? server + `/app/getCurrentDirFiles`
    : `/app/getCurrentDirFiles`;
const deleteItemsURL =
  process.env.REACT_APP_ENV === PRODUCTION
    ? server + "/app/delete"
    : "/app/delete";
const filesFoldersURL =
  process.env.REACT_APP_ENV === PRODUCTION
    ? server + `/app/browseFolder`
    : `/app/browseFolder`;
const getSubFoldersURL =
  process.env.REACT_APP_ENV === PRODUCTION
    ? server + "/app/getSubFolders"
    : "/app/getSubFolders";
const downloadURL =
  process.env.REACT_APP_ENV === PRODUCTION
    ? server + `/app/downloadFile`
    : `/app/downloadFile`;
const get_download_zip =
  process.env.REACT_APP_ENV === PRODUCTION
    ? server + `/app/get_download_zip`
    : `/app/get_download_zip`;
const csrftokenURL =
  process.env.REACT_APP_ENV === PRODUCTION
    ? server + `/app/csrftoken`
    : `/app/csrftoken`;
const downloadItemsURL =
  process.env.REACT_APP_ENV === PRODUCTION
    ? server + "/app/downloadItems"
    : "/app/downloadItems";
const getShareLinkURL =
  process.env.REACT_APP_ENV === PRODUCTION
    ? server + "/app/createShare"
    : "/app/createShare";
const getSharedItemsURL =
  process.env.REACT_APP_ENV === PRODUCTION ? server + "/app/sh" : "/app/sh";
const validateShareURL =
  process.env.REACT_APP_ENV === PRODUCTION
    ? server + "/app/sh/validate"
    : "/app/sh/validate";
const moveItemsURL =
  process.env.REACT_APP_ENV === PRODUCTION
    ? server + "/app/v2/moveItems"
    : "/app/v2/moveItems";
const signupURL =
  process.env.REACT_APP_ENV === PRODUCTION
    ? server + "/app/signup"
    : "/app/signup";
const validateUsernameURL =
  process.env.REACT_APP_ENV === PRODUCTION
    ? server + "/app/validateusername"
    : "/app/validateusername";

const copyItemsURL =
  process.env.REACT_APP_ENV === PRODUCTION
    ? server + "/app/copyItems"
    : "/app/copyItems";
const searchURL =
  process.env.REACT_APP_ENV === PRODUCTION
    ? server + "/app/search"
    : "/app/search";
const deletedItemsURL =
  process.env.REACT_APP_ENV === PRODUCTION
    ? server + "/app/trash"
    : "/app/trash";
const renameURL =
  process.env.REACT_APP_ENV === PRODUCTION
    ? server + "/app/renameItem"
    : "/app/renameItem";
const trashTotalURL =
  process.env.REACT_APP_ENV === PRODUCTION
    ? server + "/app/trashTotal"
    : "/app/trashTotal";
const getTrashBatchURL =
  process.env.REACT_APP_ENV === PRODUCTION
    ? server + "/app/trashBatch"
    : "/app/trashBatch";
const restoreTrashItems =
  process.env.REACT_APP_ENV === PRODUCTION
    ? server + "/app/restoreTrashItems"
    : "/app/restoreTrashItems";
const deleteTrashURL =
  process.env.REACT_APP_ENV === PRODUCTION
    ? server + "/app/deleteTrashItems"
    : "/app/deleteTrashItems";
const createFolderURL =
  process.env.REACT_APP_ENV === PRODUCTION
    ? server + "/app/createFolder"
    : "/app/createFolder";
const getFileVersionURL =
  process.env.REACT_APP_ENV === PRODUCTION
    ? server + "/app/getFileVersion"
    : "/app/getFileVersion";
const concurrency = 5;
const cwd = "/";
const devicename = "DESKTOP-10RSGE8";
const username = "sandeep.kumar@idriveinc.com";
const RENAME = "RENAME";
const COPY = "COPY";
const DOWNLOAD = "DOWNLOAD";
const LOGOUT = "LOGOUT";
const MOVE = "MOVE";
const SHARE = "SHARE";
const DELETE = "DELETE";
const DELETETRASH = "DELETETRASH";
const EMPTYTRASH = "EMPTYTRASH";
const RESTORETRASH = "RESTORETRASH";
const pageSize = 50;
const multiple = "multiple";
const file = "file";
const folder = "folder";
const fileVersion = "fileVersion";
const timeOpts = {
  year: "numeric",
  month: "short",
  day: "numeric",
  hour: "numeric",
  minute: "numeric",
  hour12: true,
};

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
  trashTotalURL,
  getTrashBatchURL,
  restoreTrashItems,
  signupURL,
  validateUsernameURL,
  validateShareURL,
  concurrency,
  server,
  deleteTrashURL,
  createFolderURL,
  RENAME,
  COPY,
  MOVE,
  pageSize,
  multiple,
  file,
  folder,
  fileVersion,
  timeOpts,
  SHARE,
  DELETE,
  DOWNLOAD,
  DELETETRASH,
  RESTORETRASH,
  EMPTYTRASH,
  getFileVersionURL,
  LOGOUT,
};
