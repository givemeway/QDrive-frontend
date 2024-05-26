import React, { useRef, useCallback, useEffect, useState } from "react";
import MaterialReactTable from "./MaterialReactTable.js";
import { TimeLine } from "./TimeLine.js";

import {
  buildCellValueForFile,
  buildCellValueForFile_trash,
  buildCellValueForFolder,
  buildCellValueForFolder_trash,
  buildCellValueForSingleFile_trash,
} from "../util.js";

import {
  useSearchItemsMutation,
  useBrowseFolderMutation,
  useGetTrashMutation,
} from "../features/api/apiSlice.js";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setBrowseItems } from "../features/browseItems/browseItemsSlice.js";
import { setBreadCrumb } from "../features/breadcrumbs/breadCrumbSlice.jsx";
import { pageSize } from "../config.js";
import { ShareList } from "./ShareList.js";
import { setRefresh } from "../features/table/updateTableSlice.js";
import PhotoPreview from "./PhotoPreview.js";
import { Modal } from "./Modal/Modal.jsx";
import isPicture from "./fileFormats/FileFormat.js";
import DeletedItemsMaterialReactTable from "./DeletedItemsMaterialReactTable.js";
import { setSession } from "../features/session/sessionSlice.js";
import Table from "./Table.js";

export default React.memo(function MainPanel({ mode }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { search } = location;
  const pathRef = useRef();
  const params = useParams();
  const subpath = params["*"];
  const dashboard = useSelector((state) => state.browseItems);
  const dispatch = useDispatch();
  const device = useRef(null);
  const currentDir = useRef(null);
  const navigatedToNewDir = useRef(true);
  const page = useRef(1);
  const [newRows, setNewRows] = useState([]);
  const [isFetching, setIsFetching] = useState(false);
  const [photos, setPhotos] = useState([]);
  const [height, setHeight] = useState(0);
  const containerRef = useRef(null);
  const [state, setState] = useState({
    hasNextPage: true,
    isNextPageLoading: false,
    total: 0,
    items: [],
  });
  const pagination = useRef({ start: 0, page: pageSize });

  const [photoName, setPhotoName] = useState("");
  const reLoad = useRef(false);
  const [isPreview, setIsPreview] = useState(false);
  const { refresh, toggle } = useSelector((state) => state.updateTable);
  const { CSRFToken } = useSelector((state) => state.csrfToken);
  const [browseFolderQuery, browseFolderStatus] = useBrowseFolderMutation();
  const [searchQuery, searchStatus] = useSearchItemsMutation();
  const [getTrashQuery, getTrashStatus] = useGetTrashMutation();

  let { isError, isLoading, isSuccess, error, data, status, startedTimeStamp } =
    mode === "BROWSE"
      ? browseFolderStatus
      : mode === "SEARCH"
      ? searchStatus
      : getTrashStatus;

  data = data ? data : { file: [], files: [], folders: [], total: 0 };
  error = error
    ? { msg: error.data.msg, status: error.status }
    : { msg: "", status: undefined };
  useEffect(() => {
    if (search.length > 0) {
      setIsPreview(true);
      const urlParams = new URLSearchParams(search);
      const filename = urlParams.get("preview");
      setPhotoName(filename);
    } else {
      setIsPreview(false);
    }
  }, [search, subpath]);

  const _loadNextPage = (...args) => {
    navigatedToNewDir.current = false;
    reLoad.current = dashboard.reLoad;
    if (state.items.length < state.total && !isFetching && isSuccess) {
      setIsFetching(true);
      setState((prev) => ({ ...prev, hasNextPage: true }));
      pagination.current.start = args[0];
      browseFolderQuery({
        device: device.current,
        curDir: currentDir.current,
        sort: "ASC",
        start: pagination.current.start,
        end: pageSize,
      });
    } else if (state.items.length >= state.total || isError) {
      setState((prev) => ({ ...prev, hasNextPage: false }));
    }
  };
  const fetchRows = useCallback(
    (isRefresh) => {
      const path = pathRef.current.split("/");
      if (path[0] === "home") {
        let breadCrumbQueue;

        if (path.length === 1) {
          device.current = "/";
          currentDir.current = "/";
          dispatch(setBreadCrumb(["/"]));
        } else {
          currentDir.current = path.slice(2).join("/");
          breadCrumbQueue = [...path.slice(1)];
          dispatch(setBreadCrumb(["/", ...breadCrumbQueue]));

          if (currentDir.current.length === 0) {
            currentDir.current = "/";
          }
          device.current = path[1];
        }
        if (!isRefresh) {
          page.current = 1;
          navigatedToNewDir.current = true;
          reLoad.current = false;
          setIsFetching(false);
          setNewRows([]);
        } else {
          reLoad.current = true;
        }
        browseFolderQuery({
          device: device.current,
          curDir: currentDir.current,
          sort: "ASC",
          start: (page.current - 1) * pageSize,
          end: pageSize,
        });
      } else if (path[0] === "search") {
        searchQuery({
          param: path[1],
        });
      } else if (path[0] === "deleted") {
        getTrashQuery({ CSRFToken });
      }
    },
    [pathRef.current]
  );

  useEffect(() => {
    if (
      isSuccess &&
      (mode === "BROWSE" || mode === "SEARCH") &&
      (data.files?.length >= 0 || data.folders?.length >= 0)
    ) {
      const fileRows = data.files.map((file) => buildCellValueForFile(file));
      const folderRows = data.folders.map((fo) => buildCellValueForFolder(fo));
      if (navigatedToNewDir.current || reLoad.current) {
        setNewRows([...fileRows, ...folderRows]);
        setState({
          hasNextPage: true,
          isNextPageLoading: false,
          items: [...fileRows, ...folderRows],
          total: data.total,
        });
      } else {
        setNewRows((prev) => {
          return [...prev, ...fileRows, ...folderRows];
        });
        setState((prev) => ({
          ...prev,
          items: [...prev.items, ...fileRows, ...folderRows],
        }));
      }

      dispatch(
        setBrowseItems({
          ...dashboard,
          page: page.current,
          query: false,
          reLoad: reLoad.current,
          total: data.total,
          rowSelection: {},
        })
      );
      setIsFetching(false);
      reLoad.current = false;
      dispatch(setRefresh({ toggle: false, refresh: false }));
    }
    if (
      isSuccess &&
      mode === "DELETED" &&
      (data.files?.length >= 0 ||
        data.folders?.length >= 0 ||
        data.file?.length >= 0)
    ) {
      const files = data.files.map((file) => buildCellValueForFile_trash(file));
      const singleFile = data.file.map((file) =>
        buildCellValueForSingleFile_trash(file)
      );
      const folders = data.folders.map((folder) =>
        buildCellValueForFolder_trash(folder)
      );

      setNewRows([...files, ...singleFile, ...folders]);
    }
  }, [data.files?.length, data.folders?.length, isSuccess, data.file?.length]);

  useEffect(() => {
    pathRef.current = subpath;
    fetchRows(false);
  }, []);

  useEffect(() => {
    if (state.items.length > 0) {
      const pictures = state.items.filter((row) => isPicture(row.name));
      setPhotos(pictures);
    }
  }, [state.items, state.items.length]);

  useEffect(() => {
    if (refresh) {
      fetchRows(true);
    }
  }, [refresh, toggle]);

  useEffect(() => {
    pathRef.current = subpath;
    fetchRows(false);
  }, [subpath]);

  useEffect(() => {
    if (containerRef.current) {
      const { height } = containerRef.current.getBoundingClientRect();
      setHeight(height);
    }
  }, [containerRef.current]);

  // useEffect(() => {
  //   if (dashboard.query) {
  //     setIsFetching(true);
  //     reLoad.current = dashboard.reLoad;
  //     navigatedToNewDir.current = false;
  //     page.current = dashboard.page;
  //     const data = {
  //       device: device.current,
  //       curDir: currentDir.current,
  //       sort: "ASC",
  //       start: (dashboard.page - 1) * pageSize,
  //       end: pageSize,
  //     };
  //     browseFolderQuery(data);
  //   }
  // }, [dashboard.query, dashboard.reLoad]);

  useEffect(() => {
    if (isError && (error.status === 403 || error.status === 401)) {
      dispatch(setSession({ isLoggedIn: false, isLoggedOut: true }));
      navigate("/login");
    }
  }, [isError, error.status, navigate]);

  return (
    <>
      {!isPreview && (mode === "SEARCH" || mode === "BROWSE") && (
        <div
          className="w-full h-full flex flex-row justify-start items-center"
          ref={containerRef}
        >
          <Table
            layout={"dashboard"}
            urlPath={"/dashboard/home"}
            params={{
              height,
              isSuccess,
              isLoading,
              isError,
              isFetching,
              reLoad: reLoad.current,
              newDir: navigatedToNewDir.current,
            }}
            hasNextPage={state.hasNextPage}
            isNextPageLoading={state.isNextPageLoading}
            items={state.items}
            loadNextPage={_loadNextPage}
          />
        </div>

        // <MaterialReactTable
        //   layout={"dashboard"}
        //   path={"/dashboard/home"}
        //   isLoading={isLoading}
        //   isError={isError}
        //   status={status}
        //   startedTimeStamp={startedTimeStamp}
        //   rows={newRows}
        //   isFetching={isFetching}
        // />
      )}
      {isPreview &&
        photos.length > 0 &&
        (mode === "SEARCH" || mode === "BROWSE") && (
          <Modal style={{ background: "white", opacity: 1 }}>
            <PhotoPreview
              onClose={() => {
                setIsPreview(false);
                navigate(subpath);
              }}
              // pth={path}
              photos={photos}
              initialName={photoName}
            />
          </Modal>
        )}
      {mode === "DELETED" && (
        <DeletedItemsMaterialReactTable
          rows={newRows}
          isLoading={isLoading}
          isError={isError}
          status={status}
          isFetching={isFetching}
        />
      )}
      {mode === "SHARE" && <ShareList />}
      {mode === "PHOTOS" && <TimeLine rowHeight={168} renderSize={168} />}
    </>
  );
});
