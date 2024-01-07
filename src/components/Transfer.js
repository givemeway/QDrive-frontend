import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { csrftokenURL, getSharedItemsURL, validateShareURL } from "../config";
import Table from "./SharedItemsDisplayTable";
import { Box } from "@mui/material";
import Download from "./DownloadItems.js";

import BreadCrumb from "./breadCrumbs/CollapsibleBreadUnderLinedCrumbs";
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
export default function Transfer() {
  const location = useLocation();
  const [invalidPage, setInvalidPage] = useState(false);
  const [breadCrumb, setBreadCrumb] = useState(
    new Map(Object.entries({ "/": "/" }))
  );
  const [data, setData] = useState({});
  const [msg, setMsg] = useState("");

  const [dataLoaded, setDataLoaded] = useState(false);
  let { shareId, "*": nav } = useParams();
  const [dirNav, setDirNav] = useState("");
  const share = useRef({ nav: "h", itemId: "", nav_tracking: 0, rel: "" });
  const tempBreadCrumbs = useRef(new Map(Object.entries({ "/": "/" })));
  const [itemsSelected, setItemsSelection] = useState({
    fileIds: [],
    directories: [],
  });

  const CSRFToken = useFetchCSRFToken(csrftokenURL);
  const [validateShare, setValidateShare] = useState(undefined);

  useEffect(() => {
    if (CSRFToken.length > 0 && !validateShare) {
      // eslint-disable-next-line react-hooks/exhaustive-deps
      setDataLoaded(false);
      const params = new URLSearchParams(location.search);
      const k = params.get("k");
      if (k !== null) {
        share.current.nav_tracking = 1;
        share.current.itemId = k;
        console.log(share.current.itemId);
      } else {
        share.current.nav_tracking = 0;
        share.current.itemId = null;
      }
      const url =
        validateShareURL +
        `?id=${shareId}&t=t&nav=${nav}&nav_tracking=${share.current.nav_tracking}&k=${share.current.itemId}`;
      fetch(url)
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
        .catch((err) => {
          setValidateShare(false);
          setInvalidPage(true);
          setMsg(err);
          console.error(err);
        });
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }
  }, [CSRFToken.length, location.search, nav, shareId, validateShare]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/exhaustive-deps
    if (CSRFToken.length > 0 && validateShare) {
      setDataLoaded(false);
      const params = new URLSearchParams(location.search);
      const k = params.get("k");
      if (k !== null) {
        share.current.nav_tracking = 1;
        share.current.itemId = k;
        console.log(share.current.itemId);
      } else {
        share.current.nav_tracking = 0;
        share.current.itemId = null;
      }
      const url =
        getSharedItemsURL +
        `?id=${shareId}&t=t&nav=${nav}&nav_tracking=${share.current.nav_tracking}&k=${share.current.itemId}`;
      fetch(url)
        .then((res) => res.json())
        .then((data) => {
          const { files, directories, home, path } = data;
          if (k === null) share.current.rel = path;
          setDirNav(path);
          if (k !== null) {
            setBreadCrumb((prev) =>
              new Map(prev).set(
                share.current.itemId,
                nav.split("/").slice(-1)[0]
              )
            );
            tempBreadCrumbs.current = new Map(tempBreadCrumbs.current).set(
              share.current.itemId,
              nav.split("/").slice(-1)[0]
            );
          }
          if (
            nav.split("/").length !== Array.from(tempBreadCrumbs.current).length
          ) {
            Array.from(tempBreadCrumbs.current).forEach((entry, idx) => {
              if (idx >= nav.split("/").length) {
                tempBreadCrumbs.current.delete(entry[0]);
              }
            });
            setBreadCrumb(tempBreadCrumbs.current);
          }
          setData({ files, folders: directories });
          setDataLoaded(true);
        })
        .catch((err) => console.log(err));
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }
  }, [
    CSRFToken.length,
    location.pathname,
    location.search,
    nav,
    shareId,
    validateShare,
  ]);

  return (
    <Box sx={container}>
      <Box sx={sharedBoxStyle}>
        {!invalidPage && dirNav.length > 0 && (
          <ItemSelectionContext.Provider value={itemsSelected}>
            <Download />
          </ItemSelectionContext.Provider>
        )}
        {!invalidPage && dirNav.length > 0 && (
          <BreadCrumb
            queue={breadCrumb}
            layout={"transfer"}
            link={`/sh/t/${shareId}/h`}
          />
        )}
        {!invalidPage && !dataLoaded && (
          <UploadFolderContenxt.Provider value={data}>
            <ItemSelectionContext.Provider
              value={{ itemsSelected, setItemsSelection }}
            >
              <Table
                layout={"transfer"}
                path={`/sh/t/${shareId}`}
                nav={share.current.rel}
                loading={true}
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
                layout={"transfer"}
                path={`/sh/t/${shareId}`}
                nav={share.current.rel}
                loading={false}
              />
            </ItemSelectionContext.Provider>
          </UploadFolderContenxt.Provider>
        )}
        {invalidPage && <>{msg}</>}
      </Box>
    </Box>
  );
}
