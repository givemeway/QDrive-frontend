import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { getSharedItemsURL } from "../config";
import Table from "./SharedItemsDisplayTable";
import { Box } from "@mui/material";

import BreadCrumb from "./breadCrumbs/Breadcrumb";
import { ItemSelectionContext, UploadFolderContenxt } from "./UseContext";

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
  const navigate = useNavigate();
  const [invalidPage, setInvalidPage] = useState(false);
  const [breadCrumb, setBreadCrumb] = useState(["/"]);
  const [data, setData] = useState({});
  const [dataLoaded, setDataLoaded] = useState(false);
  let { type, shareId, "*": nav } = useParams();
  console.log(type, shareId, nav);
  const [dirNav, setDirNav] = useState("");
  const share = useRef({ itemID: "", dl: "" });
  const [itemsSelected, setItemsSelection] = useState({
    fileIds: [],
    directories: [],
  });

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
    navigate(`/sh/${type}/${shareId}/${nav}`);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/exhaustive-deps
    setDataLoaded(false);
    const url =
      getSharedItemsURL +
      `?id=${shareId}&k=${share.current.itemID}&t=${type}&dl=${share.current.dl}&nav=${nav}`;
    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        const { files, directories, home, path } = data;
        setDirNav(path);
        setBreadCrumb(() => [home, ...nav.split("/").slice(1)]);
        setData({ files, folders: directories });
        setDataLoaded(true);
      })
      .catch((err) => console.log(err));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname]);

  return (
    <Box sx={container}>
      <Box sx={sharedBoxStyle}>
        {!invalidPage && type !== "fi" && dirNav.length > 0 && (
          <BreadCrumb
            queue={breadCrumb}
            link={`/sh/fo/${shareId}/h`}
            layout={"share"}
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
              />
            </ItemSelectionContext.Provider>
          </UploadFolderContenxt.Provider>
        )}
        {invalidPage && <>Invalid Share Link or Link Expired</>}
      </Box>
    </Box>
  );
}
