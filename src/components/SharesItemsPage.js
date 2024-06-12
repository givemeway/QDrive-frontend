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
import Table from "./ShareItemsTable.js";
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
  const previousState = useRef({});
  const [isShareURLInvalid, setIsShareURLInvalid] = useState(false);
  const [sharedby, setSharedBy] = useState({ owner: "", name: "" });
  const [breadCrumbMap, setBreadCrumbMap] = useState(
    new Map(Object.entries({ "/": "/" }))
  );
  const tempBreadCrumbs = useRef(new Map(Object.entries({ "/": "/" })));

  const dispath = useDispatch();
  const table = useSelector((state) => state.browseItems);
  const [state, setState] = useState({
    hasNextPage: true,
    isNextPageLoading: false,
    total: 0,
    items: [],
  });

  let { type, shareId, "*": nav } = useParams();
  const [dirNav, setDirNav] = useState(null);
  const share = useRef({ itemID: "", dl: "" });
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

  const pagination = useRef({ start: 0, page: pageSize });
  const tableContainerRef = useRef(null);
  const [height, setHeight] = useState(0);

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

  const _loadNextPage = (...args) => {
    console.log("fetching function loading....");
    if (
      state.items.length < state.total &&
      !isFetching &&
      browseShare.isSuccess
    ) {
      setIsFetching(true);
      console.log("fetching...", args);
      pagination.current.start = args[0];
      navigatedToNewDir.current = false;
      reLoad.current = table.reLoad;
      page.current = table.page;
      const body = {
        id: shareId,
        k: share.current.itemID,
        t: type,
        dl: share.current.dl,
        nav: nav,
        start: pagination.current.start,
        page: pageSize,
      };
      previousState.current = { ...body };
      browseShareQuery(body);
    }
  };

  useEffect(() => {
    if (isSuccess && data) {
      dispath(setCSRFToken(data.CSRFToken));
    }
  }, [isSuccess, data]);

  useEffect(() => {
    if (tableContainerRef.current) {
      const { height } = tableContainerRef.current.getBoundingClientRect();
      setHeight(height);
    }
  }, [tableContainerRef.current]);

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
      previousState.current = { ...body };
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
      setBreadCrumbMap((prev) => {
        prev.delete("/");
        prev.set(share.current.itemID, validate.data?.name);
        return prev;
      });
      tempBreadCrumbs.current.delete("/");
      tempBreadCrumbs.current = new Map(tempBreadCrumbs.current).set(
        share.current.itemID,
        validate.data?.name
      );
    } else if (validate.isError || validate.error) {
      setIsShareValid(false);
    }
  }, [validate.isSuccess, validate.data, validate.error, validate.isError]);

  useEffect(() => {
    if (!isShareURLInvalid && isShareValid) {
      const queryParams = new URLSearchParams(location.search);
      const filename = queryParams.get("preview");
      if (filename !== null) {
        setPhotoName(filename);
        setIsPreview(true);
        setState((prev) => ({
          ...prev,
          items: prev.items.filter((file) => isPicture(file.name)),
        }));
      } else {
        const itemID = queryParams.get("k");
        const dl = queryParams.get("dl");
        share.current.itemID = itemID;
        share.current.dl = dl;
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
        previousState.current = { ...body };
        navigatedToNewDir.current = true;
        reLoad.current = false;
        setIsFetching(false);
        browseShareQuery(body);
      }
    }
  }, [
    location.pathname,
    location.search,
    nav,
    shareId,
    type,
    isShareValid,
    isShareURLInvalid,
  ]);

  useEffect(() => {
    if (browseShare.data?.success) {
      const { files, directories, home, path, total } = browseShare.data;
      console.log(total);
      const subTotal = files.length + directories.length + state.items.length;
      const subTotal_newDir = files.length + directories.length;
      if (!navigatedToNewDir.current && subTotal < total) {
        setState((prev) => ({ ...prev, total, hasNextPage: true }));
      } else if (navigatedToNewDir.current && subTotal_newDir < total) {
        setState((prev) => ({ ...prev, total, hasNextPage: true }));
      } else {
        setState((prev) => ({ ...prev, total, hasNextPage: false }));
      }
      setDirNav(path);
      const params = new URLSearchParams(location.search);
      const k = params.get("k");
      const relPathParts = nav.split("/");
      tempBreadCrumbs.current.set(k, relPathParts.slice(-1)[0]);
      const navLength = nav.split("h/").slice(-1)[0].split("/").length;
      const presentBreadCrumbLength = Array.from(
        tempBreadCrumbs.current
      ).length;
      if (navLength !== presentBreadCrumbLength) {
        Array.from(tempBreadCrumbs.current).forEach((entry, idx) => {
          if (idx >= nav.split("/").length) {
            tempBreadCrumbs.current.delete(entry[0]);
          }
        });
      }
      setBreadCrumbMap(tempBreadCrumbs.current);
      const fileRows = files.map((file) => buildCellValueForFile(file));
      const folderRows = directories.map((fo) => buildCellValueForFolder(fo));

      if (navigatedToNewDir.current) {
        dispath(setFilesSelected(fileRows.map((file) => file.id)));
        dispath(setFoldersSelected(folderRows.map((folder) => folder.id)));

        setState((prev) => ({
          ...prev,
          total,
          items: [...fileRows, ...folderRows],
        }));
      } else {
        const files = state.items
          .filter((item) => item.item === file)
          .map((file) => file.id);

        const folders = state.items
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
        setState((prev) => ({
          ...prev,
          total,
          items: [...prev.items, ...fileRows, ...folderRows],
        }));
      }
      dispath(
        setBrowseItems({
          ...table,
          reLoad: reLoad.current,
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

  const handleClosePreview = () => {
    setIsPreview(false);
    const params = new URLSearchParams(location.search);
    params.delete("preview");
    params.delete("k");
    params.append("k", previousState.current.k);
    navigate(`${location.pathname}?${params.toString()}`);
  };
  return (
    <>
      <div className="w-screen h-screen flex flex-col justify-start items-center">
        <Header />
        {(validate.isLoading || isLoading) && (
          <div className="w-full h-full flex justify-center items-center">
            <SpinnerGIF style={{ width: 50, height: 50 }} />
          </div>
        )}
        {validate.isError && (
          <div className="w-full h-full flex justify-center items-center">
            <p className="text-center font-sans font-semibold text-[red]">
              Share Link Expired or Deleted
            </p>
          </div>
        )}
        {isShareURLInvalid && (
          <div className="w-full h-full flex justify-center items-center">
            <p className="text-center font-sans font-semibold text-[red]">
              Share Link is incorrect. Please check it
            </p>
          </div>
        )}
        {isError && (
          <div className="w-full h-full flex justify-center items-center">
            <p className="text-center font-sans font-semibold text-[red]">
              Something Went wrong try again.
            </p>
          </div>
        )}
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
                  queue={breadCrumbMap}
                  link={`/sh/fo/${shareId}`}
                  layout={"share"}
                  k={share.current.itemID}
                  home={validate.data?.name}
                />
              </div>
            )}
            <div
              className="w-full grow flex justify-start items-center"
              ref={tableContainerRef}
            >
              <Table
                layout={"share"}
                urlPath={`/sh/${type}/${shareId}`}
                params={{
                  height,
                  isSuccess: browseShare.isSuccess,
                  isLoading: browseShare.isLoading,
                  isError: browseShare.isError,
                  isFetching: isFetching,
                  reLoad: reLoad.current,
                  newDir: navigatedToNewDir.current,
                  nav: dirNav,
                }}
                hasNextPage={state.hasNextPage}
                isNextPageLoading={state.isNextPageLoading}
                items={state.items}
                loadNextPage={_loadNextPage}
              />
            </div>
          </div>
        )}
        {isShareValid && isPreview && (
          <Modal style={{ background: "white", opacity: 1 }}>
            <PhotoPreview
              onClose={handleClosePreview}
              photos={state.items}
              initialName={photoName}
            />
          </Modal>
        )}
        <StatusNotification />
      </div>
    </>
  );
}
