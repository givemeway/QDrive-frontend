import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import Header from "./HomePageHeader";
import { getSharedItemsURL, csrftokenURL, filesFoldersURL } from "../config";
import Table from "./DataTable";

import BreadCrumb from "./Breadcrumb";
import {
  PathContext,
  ItemSelectionContext,
  UploadFolderContenxt,
  SnackBarContext,
} from "./Context";

async function fetchCSRFToken(csrfurl) {
  const response = await fetch(csrfurl);
  const { CSRFToken } = await response.json();
  return CSRFToken;
}

export default function Shared() {
  const location = useLocation();
  const [breadCrumb, setBreadCrumb] = useState(["/"]);
  const [data, setData] = useState({});
  const [dataLoaded, setDataLoaded] = useState(false);

  const params = useParams();
  const subpath = params["*"];
  const queryParams = new URLSearchParams(location.search);
  const shareID = queryParams.get("k");
  const dl = queryParams.get("dl");
  const type = queryParams.get("t");

  const [itemsSelected, setItemsSelection] = useState({
    fileIds: [],
    directories: [],
  });

  console.log(shareID, dl, type);
  useEffect(() => {
    // eslint-disable-next-line react-hooks/exhaustive-deps
    const url = getSharedItemsURL + `/sh?k=${shareID}&t=${type}&dl=${dl}`;
    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        const { files, directories } = data;
        console.log(files, directories);
        setData({ files, folders: directories });
        setDataLoaded(true);
      })
      .catch((err) => console.log(err));
  }, [shareID]);

  // useEffect(() => {
  //   const path = subpath.split("/");
  //   if (path[0] === "sh") {
  //     let homedir;
  //     let curDir;
  //     let breadCrumbQueue;

  //     if (path.length === 1) {
  //       homedir = "/";
  //       curDir = "/";
  //       setBreadCrumb(["/"]);
  //     } else {
  //       curDir = path.slice(2).join("/");
  //       breadCrumbQueue = [...path.slice(1)];
  //       setBreadCrumb(["/", ...breadCrumbQueue]);
  //       if (curDir.length === 0) {
  //         curDir = "/";
  //       }
  //       homedir = path[1];
  //     }
  //     fetchCSRFToken(csrftokenURL).then((csrftoken) => {
  //       const headers = {
  //         "X-CSRF-Token": csrftoken,
  //         "Content-type": "application/x-www-form-urlencoded",
  //         devicename: homedir,
  //         currentdirectory: curDir,
  //         username: "sandeep.kumar@idriveinc.com",
  //         sortorder: "ASC",
  //       };
  //       const options = {
  //         method: "POST",
  //         credentials: "include",
  //         mode: "cors",
  //         headers: headers,
  //       };
  //       fetch(filesFoldersURL + "/", options)
  //         .then((res) => res.json())
  //         .then((data) => {
  //           console.log(data);
  //           const { files, folders } = data;
  //           console.log(files, folders);
  //           setData(() => ({ files, folders }));
  //           setDataLoaded(true);
  //         })
  //         .catch((err) => console.log(err));
  //     });
  //   }
  // }, [subpath]);
  useEffect(() => {
    console.log(data);
  }, [data]);
  return (
    <>
      <Header />
      <BreadCrumb queue={breadCrumb} />
      {dataLoaded && (
        <UploadFolderContenxt.Provider value={data}>
          <ItemSelectionContext.Provider
            value={{ itemsSelected, setItemsSelection }}
          >
            <Table />
          </ItemSelectionContext.Provider>
        </UploadFolderContenxt.Provider>
      )}
    </>
  );
}
