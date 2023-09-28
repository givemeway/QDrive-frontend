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
  const [breadCrumb, setBreadCrumb] = useState(["/"]);
  const [data, setData] = useState({});
  const [dataLoaded, setDataLoaded] = useState(false);
  let { shareId, "*": nav } = useParams();
  console.log(shareId, nav);
  const [dirNav, setDirNav] = useState("");
  const share = useRef({ nav: "h", itemId: "", nav_tracking: 0 });
  const [itemsSelected, setItemsSelection] = useState({
    fileIds: [],
    directories: [],
  });

  useEffect(() => {
    // eslint-disable-next-line react-hooks/exhaustive-deps
    setDataLoaded(false);
    console.log(shareId, nav, " inside the transfer");
    const params = new URLSearchParams(location.search);
    const k = params.get("k");
    if (k !== null) {
      share.current.nav_tracking = 1;
      share.current.itemId = k;
    } else {
      share.current.nav_tracking = 0;
      share.current.itemId = null;
    }
    const url =
      getSharedItemsURL +
      `?id=${shareId}&t=t&nav=${nav}&nav_tracking=${share.current.nav_tracking}&k=${share.current.itemId}`;
    console.log(url);
    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        const { files, directories, home, path } = data;
        console.log(data);
        console.log(path);
        setDirNav(path);
        setBreadCrumb(() => [home, ...nav.split("/").slice(1)]);
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
          layout={`/sh/t/${shareId}`}
          nav={dirNav}
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
                nav={dirNav}
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
                nav={dirNav}
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
