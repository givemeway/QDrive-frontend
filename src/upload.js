import { uploadFile } from "./transferFile.js";
import { getfilesCurDir, compareFiles } from "./filesInfo.js";
import { cwd, csrftokenURL } from "./config.js";

const response = await fetch(csrftokenURL);
const { CSRFToken } = await response.json();
const uploadingDirPath =
  cwd === "/"
    ? filesList[0].webkitRelativePath.split(/\//g)[0]
    : cwd + "/" + filesList[0].webkitRelativePath.split(/\//g)[0];

console.log(uploadingDirPath);
getfilesCurDir(uploadingDirPath, CSRFToken)
  .then(async (DbFiles) => {
    let files = await compareFiles(filesList, DbFiles, cwd);
    console.log(files.length);
    for (let i = 0; i < files.length; i++) {
      try {
        let hashHex = "";
        let data = await uploadFile(
          files[i],
          cwd,
          progressBar,
          hashHex,
          token,
          CSRFToken,
          files[i].modified,
          uploadCountElement,
          i + 1,
          files.length
        );
        progressbarUI.setAttribute(
          "style",
          `width: ${Math.ceil(((i + 1) / files.length) * 100)}%`
        );
        progressbarUI.textContent = `${Math.ceil(
          ((i + 1) / files.length) * 100
        )}%`;
        progress.setAttribute(
          "aria-valuenow",
          `${Math.ceil(((i + 1) / files.length) * 100)}`
        );
        console.log(data);
      } catch (err) {
        console.log(err);
        addFailedFilesToDOM(filesFailed, files[i].name, err);
      }
    }
  })
  .catch((err) => {
    console.log("inaide this error block");
    console.log(err);
  });
