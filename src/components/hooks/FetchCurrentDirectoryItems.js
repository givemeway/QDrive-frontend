import { useState, useEffect } from "react";
import { filesFoldersURL } from "../../config";

export default function useFetchItems(subpath, csrftoken) {
  const [startFetch, setStartFetch] = useState(false);
  const [breadCrumbQueue, setBreadCrumb] = useState(["/"]);
  const [itemsLoaded, setItemsLoaded] = useState(false);
  const [items, setItems] = useState([]);
  const getItems = () => {
    setStartFetch(true);
  };
  useEffect(() => {
    setItemsLoaded(false);
    const path = subpath.split("/");
    if (path[0] === "home" && csrftoken.length > 0 && startFetch) {
      let homedir;
      let curDir;
      let breadCrumbQueue;

      if (path.length === 1) {
        homedir = "/";
        curDir = "/";
        setBreadCrumb(["/"]);
      } else {
        curDir = path.slice(2).join("/");
        breadCrumbQueue = [...path.slice(1)];
        setBreadCrumb(["/", ...breadCrumbQueue]);
        if (curDir.length === 0) {
          curDir = "/";
        }
        homedir = path[1];
      }

      const headers = {
        "X-CSRF-Token": csrftoken,
        "Content-type": "application/x-www-form-urlencoded",
        devicename: homedir,
        currentdirectory: curDir,
        username: "sandeep.kumar@idriveinc.com",
        sortorder: "ASC",
      };
      const options = {
        method: "POST",
        credentials: "include",
        mode: "cors",
        headers: headers,
      };
      fetch(filesFoldersURL + "/", options)
        .then((res) => res.json())
        .then((data) => {
          setItems(() => {
            setStartFetch(false);
            setItemsLoaded(true);
            return data;
          });
        })
        .catch((err) => console.log(err));
    }
  }, [csrftoken, subpath, setBreadCrumb, startFetch]);
  return [items, breadCrumbQueue, getItems, itemsLoaded];
}
