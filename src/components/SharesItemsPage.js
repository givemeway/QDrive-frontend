import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import BreadCrumb from "./breadCrumbs/CollapsibleBreadUnderLinedCrumbs.js";

import {
  useBrowseSharedItemsMutation,
  useGetCSRFTokenQuery,
  useValidateShareLinkMutation,
} from "../features/api/apiSlice.js";
import { buildCellValueForFile, buildCellValueForFolder } from "../util.js";
import { useDispatch, useSelector } from "react-redux";
import { setBrowseItems } from "../features/browseItems/browseItemsSlice.js";
import Table from "./SharedItemsMaterialReactTable.js";
import SpinnerGIF from "./icons/SpinnerGIF.js";
import { file, folder, pageSize } from "../config.js";
import { Header } from "./Header.jsx";
import { DownloadHeader } from "./ShareDownloadHeader.jsx";
import { ShareBanner } from "./ShareBanner.jsx";
import PhotoPreview from "./PhotoPreview.js";
import { Modal } from "./Modal/Modal.jsx";
import {
  setFilesSelected,
  setFoldersSelected,
} from "../features/selectedRows/selectedRowsSlice.js";
import { StatusNotification } from "./StatusNotification.js";
import { setCSRFToken } from "../features/csrftoken/csrfTokenSlice.jsx";
import isPicture from "./fileFormats/FileFormat.js";

export default function Shared() {
  const location = useLocation();
  const [isShareURLInvalid, setIsShareURLInvalid] = useState(false);
  const [sharedby, setSharedBy] = useState({ owner: "", name: "" });
  const [breadCrumb, setBreadCrumb] = useState(["/"]);
  const dispath = useDispatch();
  const table = useSelector((state) => state.browseItems);

  let { type, shareId, "*": nav } = useParams();
  const [dirNav, setDirNav] = useState("");
  const share = useRef({ itemID: "", dl: "" });
  const [newRows, setNewRows] = useState([]);
  const navigatedToNewDir = useRef(null);
  const page = useRef(1);
  const reLoad = useRef(false);
  const [isFetching, setIsFetching] = useState(false);
  const [isShareValid, setIsShareValid] = useState(undefined);
  const [isPreview, setIsPreview] = useState(false);
  const [photoName, setPhotoName] = useState("");
  const navigate = useNavigate();

  const [validateShareQuery, validateShareStatus] =
    useValidateShareLinkMutation();
  const [browseShareQuery, browseShareStatus] = useBrowseSharedItemsMutation();
  const { isLoading, isError, isSuccess, data } = useGetCSRFTokenQuery();

  const validate = {
    isLoading: validateShareStatus.isLoading,
    isError: validateShareStatus.isError,
    isSuccess: validateShareStatus.isSuccess,
    data: validateShareStatus.data,
    status: validateShareStatus.status,
    error: validateShareStatus.error,
  };
  const browseShare = {
    isLoading: browseShareStatus.isLoading,
    isError: browseShareStatus.isError,
    isSuccess: browseShareStatus.isSuccess,
    data: browseShareStatus.data,
    status: browseShareStatus.status,
    error: browseShareStatus.error,
    startedTimeStamp: browseShareStatus.startedTimeStamp,
  };

  useEffect(() => {
    if (isSuccess && data) {
      dispath(setCSRFToken(data.CSRFToken));
    }
  }, [isSuccess, data]);

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const itemID = queryParams.get("k");
    const dl = queryParams.get("dl");
    share.current.itemID = itemID;
    share.current.dl = dl;
    if (
      itemID?.length !== 36 ||
      shareId?.length !== 24 ||
      (type !== "fo" && type !== "fi" && type !== "t")
    ) {
      setIsShareURLInvalid(true);
    } else {
      setIsShareURLInvalid(false);
      const body = {
        id: shareId,
        k: share.current.itemID,
        t: type,
        dl: share.current.dl,
        nav: nav,
      };
      validateShareQuery(body);
    }
  }, []);

  useEffect(() => {
    if (validate.isSuccess && validate.data?.success) {
      setIsShareValid(true);
      setSharedBy({
        owner: validate.data?.sharedBy,
        name: validate.data?.name,
      });
    } else if (validate.isError || validate.error) {
      setIsShareValid(false);
    }
  }, [validate.isSuccess, validate.data, validate.error, validate.isError]);

  useEffect(() => {
    if (!isShareURLInvalid && isShareValid) {
      const body = {
        id: shareId,
        k: share.current.itemID,
        t: type,
        dl: share.current.dl,
        nav: nav,
        start: (page.current - 1) * pageSize,
        page: pageSize,
      };
      browseShareQuery(body);
    }
  }, [isShareValid, isShareURLInvalid]);

  useEffect(() => {
    if (!isShareURLInvalid && isShareValid) {
      page.current = 1;
      const body = {
        id: shareId,
        k: share.current.itemID,
        t: type,
        dl: share.current.dl,
        nav: nav,
        start: (page.current - 1) * pageSize,
        page: pageSize,
      };
      navigatedToNewDir.current = true;
      reLoad.current = false;
      setIsFetching(false);
      browseShareQuery(body);
    }
  }, [location.pathname, nav, shareId, type, isShareValid, isShareURLInvalid]);

  useEffect(() => {
    if (!isShareURLInvalid && isShareValid) {
      const urlParams = new URLSearchParams(location.search);
      const filename = urlParams.get("preview");
      if (filename !== null) {
        setPhotoName(filename);
        setIsPreview(true);
        setNewRows((prev) => prev.filter((file) => isPicture(file.name)));
      }
    }
  }, [location.search]);

  useEffect(() => {
    if (browseShare.data?.success) {
      const { files, directories, home, path, total } = browseShare.data;
      setDirNav(path);
      setBreadCrumb(() => [home, ...nav.split("/").slice(1)]);
      const fileRows = files.map((file) => buildCellValueForFile(file));
      const folderRows = directories.map((fo) => buildCellValueForFolder(fo));

      if (navigatedToNewDir.current) {
        dispath(setFilesSelected(fileRows.map((file) => file.id)));
        dispath(setFoldersSelected(folderRows.map((folder) => folder.id)));

        setNewRows([...fileRows, ...folderRows]);
      } else {
        setNewRows((prev) => {
          const files = prev
            .filter((item) => item.item === file)
            .map((file) => file.id);

          const folders = prev
            .filter((item) => item.item === folder)
            .map((folder) => folder.id);

          dispath(
            setFilesSelected([...files, ...fileRows.map((file) => file.id)])
          );
          dispath(
            setFoldersSelected([
              ...folders,
              ...folderRows.map((folder) => folder.id),
            ])
          );

          return [...prev, ...fileRows, ...folderRows];
        });
      }
      dispath(
        setBrowseItems({
          ...table,
          page: page.current,
          query: false,
          reLoad: reLoad.current,
          total: total,
        })
      );
      reLoad.current = false;
      setIsFetching(false);
    }
  }, [
    browseShare.data?.sucess,
    browseShare.data?.files.length,
    browseShare.data?.directories.length,
    browseShare.data?.home,
    browseShare.data?.path,
  ]);

  useEffect(() => {
    if (table.query) {
      setIsFetching(true);
      reLoad.current = table.reLoad;
      navigatedToNewDir.current = false;
      page.current = table.page;
      const body = {
        id: shareId,
        k: share.current.itemID,
        t: type,
        dl: share.current.dl,
        nav: nav,
        start: (table.page - 1) * pageSize,
        page: pageSize,
      };
      browseShareQuery(body);
    }
  }, [table.query, table.reLoad]);

  const handleClosePreview = () => {
    setIsPreview(false);
    const params = new URLSearchParams(location.search);
    params.delete("preview");
    navigate(`${location.pathname}?${params.toString()}`);
  };
  return (
    <>
      <div className="w-screen h-screen flex flex-col justify-start items-center">
        <Header />
        {(validate.isLoading || isLoading) && (
          <SpinnerGIF style={{ width: 50, height: 50 }} />
        )}
        {validate.isError && <div>Share Link Expired or Deleted</div>}
        {isShareURLInvalid && (
          <div>Share Link is incorrect. Please check it</div>
        )}
        {isError && <div>Something Went wrong try again.</div>}
        {isShareValid && (
          <div className="w-full md:w-2/3 h-5/6 flex flex-col justify-between items-center grow">
            <div className="w-full flex flex-col justify-around items-center">
              <ShareBanner
                owner={sharedby.owner}
                item={type === "fi" ? "file" : "folder"}
                name={sharedby.name}
              />
              <DownloadHeader />
            </div>
            {type === "fo" && (
              <div className="w-full flex flex-row justify-start items-center">
                <BreadCrumb
                  queue={breadCrumb}
                  link={`/sh/fo/${shareId}/h`}
                  layout={"share"}
                  k={share.current.itemID}
                />
              </div>
            )}
            <div className="h-4/6 w-full grow">
              <Table
                layout={"share"}
                path={`/sh/${type}/${shareId}`}
                isLoading={browseShare.isLoading}
                isError={browseShare.isError}
                status={browseShare.status}
                startedTimeStamp={browseShare.startedTimeStamp}
                rows={newRows}
                isFetching={isFetching}
                nav={dirNav}
              />
            </div>
          </div>
        )}
        {isShareValid && isPreview && (
          <Modal style={{ background: "white", opacity: 1 }}>
            <PhotoPreview
              onClose={handleClosePreview}
              photos={newRows}
              initialName={photoName}
            />
          </Modal>
        )}
        <StatusNotification />
      </div>
    </>
  );
}
