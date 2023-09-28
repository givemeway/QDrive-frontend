import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { getSharedItemsURL } from "../config";
import Table from "./DataTable";
import { Box } from "@mui/material";

import BreadCrumb from "./Breadcrumb";
import { ItemSelectionContext, UploadFolderContenxt } from "./Context";

export default function Transfer() {
  const location = useLocation();
  const navigate = useNavigate();
  const [invalidPage, setInvalidPage] = useState(false);
  const [breadCrumb, setBreadCrumb] = useState(
    new Map(Object.entries({ "/": "/" }))
  );
  const [data, setData] = useState({});
  const [dataLoaded, setDataLoaded] = useState(false);
  let { shareId, "*": nav } = useParams();
  const [dirNav, setDirNav] = useState("");
  const share = useRef({ nav: "h", itemId: "", nav_tracking: 0, rel: "" });
  const tempBreadCrumbs = useRef(new Map(Object.entries({ "/": "/" })));
  const [itemsSelected, setItemsSelection] = useState({
    fileIds: [],
    directories: [],
  });

  useEffect(() => {
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
            new Map(prev).set(share.current.itemId, nav.split("/").slice(-1)[0])
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
  }, [location.pathname]);

  return (
    <>
      {!invalidPage && dirNav.length > 0 && (
        <BreadCrumb
          queue={breadCrumb}
          layout={"transfer"}
          link={`/sh/t/${shareId}/h`}
        />
      )}
      <Box sx={{ height: 800 }}>
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
        {invalidPage && <>Invalid Share Link or Link Expired</>}
      </Box>
    </>
  );
}
