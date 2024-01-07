import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { csrftokenURL, getSharedItemsURL, validateShareURL } from "../config";
import Table from "./SharedItemsDisplayTable";
import { Box } from "@mui/material";
import Download from "./DownloadItems.js";

import BreadCrumb from "./breadCrumbs/CollapsibleBreadUnderLinedCrumbs.js";
import { ItemSelectionContext, UploadFolderContenxt } from "./UseContext";
import useFetchCSRFToken from "./hooks/FetchCSRFToken.js";

const sharedBoxStyle = {
  display: "flex",
  flexDirection: "column",
  alignItems: "flex-start",
  justifyContent: "flex-start",
  minWidth: 900,
  height: 500,
};

const container = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  height: "100%",
  width: "100%",
};

export default function Shared() {
  const location = useLocation();
  const [invalidPage, setInvalidPage] = useState(false);
  const [msg, setMsg] = useState("");
  const [breadCrumb, setBreadCrumb] = useState(["/"]);
  const [data, setData] = useState({});
  const [dataLoaded, setDataLoaded] = useState(false);
  let { type, shareId, "*": nav } = useParams();
  const [dirNav, setDirNav] = useState("");
  const share = useRef({ itemID: "", dl: "" });
  const [itemsSelected, setItemsSelection] = useState({
    fileIds: [],
    directories: [],
  });

  const CSRFToken = useFetchCSRFToken(csrftokenURL);
  const [validateShare, setValidateShare] = useState(undefined);

  useEffect(() => {
    if (CSRFToken.length > 0 && !validateShare) {
      // eslint-disable-next-line react-hooks/exhaustive-deps
      console.log("inside");
      setDataLoaded(false);
      const url =
        validateShareURL +
        `?id=${shareId}&k=${share.current.itemID}&t=${type}&dl=${share.current.dl}&nav=${nav}`;

      const options = {
        method: "GET",
        headers: {
          "X-CSRF-Token": CSRFToken,
        },
      };
      fetch(url, options)
        .then((res) => {
          if (res.status === 403) {
            setInvalidPage(true);
          } else if (res.status === 404) {
            setInvalidPage(true);
          }
          return res.json();
        })
        .then((data) => {
          if (data.success) {
            setValidateShare(true);
          } else {
            setMsg(data.msg);
          }
        })
        .catch((err) => console.log(err));
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }
  }, [CSRFToken, location.pathname, nav, shareId, type, validateShare]);

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const itemID = queryParams.get("k");
    const dl = queryParams.get("dl");
    share.current.itemID = itemID;
    share.current.dl = dl;
    if (itemID === undefined || itemID === null) {
      setInvalidPage(true);
    }

    console.log(itemID, dl, type, " re-rendering");
    // navigate(`/sh/${type}/${shareId}/${nav}`);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (CSRFToken.length > 0 && validateShare) {
      // eslint-disable-next-line react-hooks/exhaustive-deps
      setDataLoaded(false);
      const url =
        getSharedItemsURL +
        `?id=${shareId}&k=${share.current.itemID}&t=${type}&dl=${share.current.dl}&nav=${nav}`;

      const options = {
        method: "GET",
        headers: {
          "X-CSRF-Token": CSRFToken,
        },
      };

      fetch(url, options)
        .then((res) => {
          if (res.status === 403) {
            setInvalidPage(true);
          } else if (res.status === 404) {
            setInvalidPage(true);
          }
          return res.json();
        })
        .then((data) => {
          if (data.success) {
            const { files, directories, home, path } = data;
            setDirNav(path);
            setBreadCrumb(() => [home, ...nav.split("/").slice(1)]);
            setData({ files, folders: directories });
            setDataLoaded(true);
          } else {
            setMsg(data.msg);
          }
        })
        .catch((err) => console.log(err));
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }
  }, [location.pathname, CSRFToken, shareId, type, nav, validateShare]);

  return (
    <Box sx={container}>
      <Box sx={sharedBoxStyle}>
        {!invalidPage && type !== "fi" && dirNav.length > 0 && (
          <ItemSelectionContext.Provider value={itemsSelected}>
            <Download />
          </ItemSelectionContext.Provider>
        )}
        {!invalidPage && type !== "fi" && dirNav.length > 0 && (
          <BreadCrumb
            queue={breadCrumb}
            link={`/sh/fo/${shareId}/h`}
            layout={"share"}
            k={share.current.itemID}
          />
        )}
        {!invalidPage && !dataLoaded && (
          <UploadFolderContenxt.Provider value={data}>
            <ItemSelectionContext.Provider
              value={{ itemsSelected, setItemsSelection }}
            >
              <Table
                layout={"share"}
                path={`/sh/fo/${shareId}`}
                nav={dirNav}
                loading={true}
                k={share.current.itemID}
              />
            </ItemSelectionContext.Provider>
          </UploadFolderContenxt.Provider>
        )}
        {!invalidPage && dataLoaded && (
          <UploadFolderContenxt.Provider value={data}>
            <ItemSelectionContext.Provider
              value={{ itemsSelected, setItemsSelection }}
            >
              <Table
                layout={"share"}
                path={`/sh/fo/${shareId}`}
                nav={dirNav}
                loading={false}
                k={share.current.itemID}
              />
            </ItemSelectionContext.Provider>
          </UploadFolderContenxt.Provider>
        )}
        {invalidPage && <>{msg}</>}
      </Box>
    </Box>
  );
}
