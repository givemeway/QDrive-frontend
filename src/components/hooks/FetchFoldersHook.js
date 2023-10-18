import useFetchCSRFToken from "./FetchCSRFToken.js";
import { csrftokenURL, getSubFoldersURL } from "../../config";
import { useEffect, useState } from "react";

export default function useFetchFolders() {
  const CSRFToken = useFetchCSRFToken(csrftokenURL);
  const [folderList, setFolders] = useState([]);
  const [getFolders, setGetFolders] = useState(false);
  const [path, setPath] = useState("");
  const [nodeId, setNodeId] = useState(null);
  const fetchFolders = (path, nodeId) => {
    console.log("triggered fetch", path, nodeId);
    setPath(path);
    setNodeId(nodeId);
    setGetFolders(true);
  };
  useEffect(() => {
    if (getFolders && path.length > 0 && CSRFToken.length > 0) {
      const headers = {
        "X-CSRF-Token": CSRFToken,
        "Content-Type": "application/x-www-form-urlencoded",
        path: path,
        username: "sandeep.kumar@idriveinc.com",
        sortorder: "ASC",
      };
      const options = {
        credentials: "include",
        method: "POST",
        headers: headers,
      };
      console.log("entered inside the fetch");
      fetch(getSubFoldersURL, options)
        .then((res) => res.json())
        .then((data) => {
          console.log(data);
          setFolders(data);
        })
        .catch((err) => console.error(err));
    }
  }, [CSRFToken, path, getFolders]);
  return [folderList, fetchFolders, nodeId];
}
