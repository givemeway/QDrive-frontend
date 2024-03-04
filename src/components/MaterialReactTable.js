import { useMemo, useState, useEffect, useRef, useCallback } from "react";
import {
  MaterialReactTable,
  useMaterialReactTable,
} from "material-react-table";

import { useNavigate, useParams } from "react-router-dom";
import { useRecoilState } from "recoil";
import { itemsSelectedAtom } from "../Recoil/Store/atoms";
import { useDispatch, useSelector } from "react-redux";
import { buildCellValueForFile, buildCellValueForFolder } from "../util.js";
import { COPY, MOVE, pageSize, SHARE, DELETE } from "../config.js";
import { useBrowseFolderMutation } from "../features/api/apiSlice.js";
import { setBreadCrumb } from "../features/breadcrumbs/breadCrumbSlice.jsx";
import TableContext from "./context/TableContext.js";
import Modal from "./Modal";
import { closeOperation } from "../features/operation/operationSlice.jsx";
import { DeleteModal } from "./Modal/DeleteModal.js";
import CellEdit from "./TableCellEdit.jsx";
import RenderNameCell from "./NameCell.jsx";
import RenderModifiedCell from "./ModifiedCell.jsx";
import ShareModal from "./Modal/ShareModal.jsx";
import { setOperation } from "../features/operation/operationSlice.jsx";
import ItemDetails from "./ItemDetails.jsx";
import { setFileDetails } from "../features/itemdetails/fileDetails.Slice.jsx";
import { setRowHover } from "../features/rowhover/rowHover.Slice.jsx";

const colFn = (layout, path, nav) => [
  {
    accessorKey: "name",
    header: "Name",
    size: 350,
    enableColumnActions: false,
    muiTableHeadCellProps: {
      align: "left",
    },
    enableEditing: true,

    Edit: ({ row, table }) => <CellEdit row={row.original} table={table} />,
    Cell: ({ row }) => (
      <RenderNameCell row={row.original} params={{ nav, layout, path }} />
    ),
  },
  {
    accessorKey: "size", //normal accessorKey
    header: "Size",
    size: 100,
    enableEditing: false,
    enableColumnActions: false,
    muiTableHeadCellProps: {
      align: "left",
    },
  },
  {
    accessorKey: "versions",
    header: "Versions",
    size: 100,
    enableEditing: false,
    enableColumnActions: false,
    muiTableHeadCellProps: {
      align: "left",
    },
    muiTableBodyCellProps: {
      align: "left",
    },
  },
  {
    accessorKey: "last_modified",
    header: "Modified",
    enableEditing: false,
    enableColumnActions: false,
    size: 150,
    Cell: ({ row }) => <RenderModifiedCell row={row.original} />,
  },
];

const DataTable = ({ layout, path, nav, loading }) => {
  const [newRows, setNewRows] = useState([]);

  const [coords, setCoords] = useState({ x: 0, y: 0 });

  const [selected, setItemsSelection] = useRecoilState(itemsSelectedAtom);
  const navigate = useNavigate();
  const params = useParams();
  const subpath = params["*"];

  const pathRef = useRef();

  const page = useRef(1);
  const reachedEnd = useRef(false);

  const edit = useSelector((state) => state.rename);
  const operation = useSelector((state) => state.operation);
  const fileDetails = useSelector((state) => state.fileDetails);

  const dispatch = useDispatch();

  const selectedToEdit = useRef();
  const tableContainerRef = useRef(null);
  const rowVirtualizerInstanceRef = useRef(null);

  const [isFetching, setIsFetching] = useState(false);
  console.log("material react table rendered");
  //should be memoized or stable
  const [rowSelection, setRowSelection] = useState({});
  const device = useRef(null);
  const currentDir = useRef(null);
  const navigatedToNewDir = useRef(false);
  const [showContextMenu, setShowContextMenu] = useState(false);

  const [reLoad, setReload] = useState(false);

  const [browseFolderQuery, browseFolderStatus] = useBrowseFolderMutation();
  let { isLoading, isError, isSuccess, status, data, startedTimeStamp, error } =
    browseFolderStatus;
  data = data ? data : { files: [], folders: [] };
  error = error
    ? { msg: error.data.msg, status: error.status }
    : { msg: "", status: undefined };

  const columns = useMemo(() => colFn(layout, path, nav), [layout, path, nav]);

  const fetchRows = useCallback(
    (isRefresh) => {
      console.log(pathRef.current, isRefresh);
      const path = pathRef.current.split("/");
      if (!isRefresh) {
        page.current = 1;
        navigatedToNewDir.current = true;
        reachedEnd.current = false;
        setNewRows([]);
        setRowSelection({});
        setReload(false);
      } else {
        setReload(true);
      }
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

        browseFolderQuery({
          device: device.current,
          curDir: currentDir.current,
          sort: "ASC",
          start: (page.current - 1) * pageSize,
          end: pageSize,
        });
      }
    },
    [pathRef.current]
  );

  useEffect(() => {
    pathRef.current = subpath;
    // const start = setInterval(fetchRows, 10000, true);
    // return () => clearInterval(start);
  }, []);

  useEffect(() => {
    if (isError && (error.status === 403 || error.status === 401)) {
      navigate("/login");
    }
  }, [isError, error.status, navigate]);

  useEffect(() => {
    const files = [];
    const folders = [];

    for (const [id, val] of Object.entries(rowSelection)) {
      if (val) {
        const item = id.split(";");
        if (item[0] === "file") {
          files.push({
            id: item[1],
            path: item[2],
            file: item[3],
            origin: item[4],
            dir: item[5],
            device: item[6],
            versions: parseInt(item[7]),
          });
        }
        if (item[0] === "folder") {
          folders.push({
            id: item[1],
            path: item[2],
            folder: item[3],
            uuid: item[4],
            device: item[5],
          });
        }
      }
    }
    setItemsSelection(() => ({
      fileIds: [...files],
      directories: [...folders],
    }));
    if (Object.keys(rowSelection).length === 1) {
      selectedToEdit.current = Object.keys(rowSelection)[0];
      if (files.length === 1 && fileDetails.open) {
        const selectedRow = newRows.find(
          (row) => row.id === selectedToEdit.current
        );
        dispatch(setFileDetails({ open: true, file: selectedRow }));
      }
    } else {
      selectedToEdit.current = undefined;
      dispatch(setFileDetails({ open: false, file: {} }));
    }
  }, [rowSelection, setItemsSelection, fileDetails.open]);

  useEffect(() => {
    pathRef.current = subpath;
    fetchRows(false);
  }, [subpath]);

  useEffect(() => {
    if (edit.editStart && selectedToEdit.current) {
      const row = table.getRow(selectedToEdit.current);
      if (row) {
        const cell = row.getAllCells()[1];
        table.setEditingCell(cell);
      }
    }
  }, [edit, rowSelection]);

  useEffect(() => {
    console.log(data);
    if (isSuccess && (data.files?.length > 0 || data.folders?.length)) {
      console.log(data);
      const fileRows = data.files.map((file) => buildCellValueForFile(file));
      const folderRows = data.folders.map((fo) => buildCellValueForFolder(fo));

      if (navigatedToNewDir.current) {
        setNewRows([...fileRows, ...folderRows]);
      } else {
        console.log("new items fetched appending");
        setNewRows((prev) => [...prev, ...fileRows, ...folderRows]);
      }
      setIsFetching(false);
    } else if (
      isSuccess &&
      data.files.length === 0 &&
      data.folders.length === 0
    ) {
      reachedEnd.current = true;
      setIsFetching(false);
      // setNewRows([]);
    }
  }, [data.files?.length, data.folders?.length, isSuccess]);

  const contextMenu = (event, row) => {
    event.preventDefault();
    setRowSelection((prev) => {
      if (Object.keys(prev).length === 0 || Object.keys(prev).length === 1) {
        selectedToEdit.current = row;
        return { [row.id]: true };
      } else {
        if (rowSelection.hasOwnProperty(row.id)) {
          selectedToEdit.current = undefined;
          return { ...prev };
        } else {
          selectedToEdit.current = row;
          console.log(selectedToEdit.current);

          return { [row.id]: true };
        }
      }
    });

    setShowContextMenu(true);
    setCoords({ x: event.clientX + 2, y: event.clientY - 6 });
  };

  const handleContextClose = () => {
    setShowContextMenu(false);
  };

  const onDeleteSubmit = () => {
    console.log("triggered delete submit");
    const body = {
      fileIds: selected.fileIds,
      directories: selected.directories,
    };
    dispatch(
      setOperation({
        ...operation,
        type: DELETE,
        status: "initialized",
        data: body,
        open: false,
      })
    );
  };

  const handleRowClick = (id) => {
    setRowSelection(() => ({ [id]: true }));
  };

  const fetchMoreOnBottomReached = useCallback(
    (containerRefElement) => {
      if (containerRefElement) {
        const { scrollHeight, scrollTop, clientHeight } = containerRefElement;
        const heightFromBottom = scrollHeight - scrollTop - clientHeight;
        if (
          heightFromBottom <= 0 &&
          !isLoading &&
          status !== "pending" &&
          Date.now() - startedTimeStamp >= 1000
        ) {
          if (!reachedEnd.current) {
            setIsFetching(true);
            navigatedToNewDir.current = false;
            page.current = page.current + 1;
            browseFolderQuery({
              device: device.current,
              curDir: currentDir.current,
              sort: "ASC",
              start: (page.current - 1) * pageSize,
              end: pageSize,
            });
          }
        }
      }
    },
    [
      isLoading,
      browseFolderQuery,
      // reachedEnd.current,
      // page.current,
      startedTimeStamp,
      status,
      // navigatedToNewDir.current,
    ]
  );

  const table = useMaterialReactTable({
    columns,
    data: newRows, //data must be memoized or stable (useState, useMemo, defined outside of this component, etc.)
    enableRowSelection: true,
    enablePagination: false,
    enableRowVirtualization: true,
    enableEditing: true,
    editDisplayMode: "cell",
    enableStickyHeader: true,
    enableStickyFooter: true,
    enableBottomToolbar: true,
    // enableColumnResizing: true,
    initialState: { density: "compact", editingCell: null },

    onRowSelectionChange: setRowSelection,
    getRowId: (original) => original.id,
    muiToolbarAlertBannerProps: isError
      ? {
          color: "error",
          children: "Error loading data",
        }
      : undefined,
    muiTableBodyRowProps: ({ row }) => ({
      onClick: () => handleRowClick(row.id),
      onContextMenu: (e) => contextMenu(e, row),
      onMouseEnter: () =>
        dispatch(setRowHover({ rowId: row.id, isHover: true })),
      onMouseLeave: () =>
        dispatch(setRowHover({ rowId: null, isHover: false })),
      sx: {
        height: "50px",
      },
    }),
    muiTableBodyCellProps: () => ({
      sx: { "&:hover": { outline: "none" } },
    }),
    muiTableContainerProps: ({ table }) => ({
      ref: tableContainerRef,
      sx: {
        height: `calc(100% - ${table.refs.topToolbarRef.current?.offsetHeight}px - ${table.refs.bottomToolbarRef.current?.offsetHeight}px)`,
        width: "100vw",
      },
      onScroll: (event) => fetchMoreOnBottomReached(event.target),
    }),

    state: {
      rowSelection,
      showProgressBars: isFetching,
      showSkeletons: reLoad ? false : isFetching ? false : isLoading,
      // showLoadingOverlay: isLoading,
      showAlertBanner: isError,
    },
    muiSkeletonProps: {
      animation: "pulse",
    },
    rowVirtualizerInstanceRef,
    rowVirtualizerOptions: { overscan: 4 },
  });

  return (
    <>
      <MaterialReactTable table={table} layoutMode={"grid"} />
      {fileDetails.open && <ItemDetails />}
      {showContextMenu && (
        <TableContext
          style={{ top: coords.y, left: coords.x }}
          open={showContextMenu}
          onClose={handleContextClose}
        />
      )}
      {operation.type === COPY && (
        <Modal
          mode={COPY}
          open={operation.open}
          onClose={() => dispatch(closeOperation(COPY))}
        />
      )}
      {operation.type === MOVE && (
        <Modal
          mode={MOVE}
          open={operation.open}
          onClose={() => dispatch(closeOperation(MOVE))}
        />
      )}
      {operation.type === SHARE && (
        <ShareModal
          open={operation.open}
          onClose={() => dispatch(closeOperation(SHARE))}
        />
      )}
      {operation.type === DELETE && (
        <DeleteModal
          title={"Delete Items"}
          content={"Are you sure you want to delete Items?"}
          open={operation.open}
          onClose={() => dispatch(closeOperation(DELETE))}
          onSubmit={onDeleteSubmit}
        />
      )}
    </>
  );
};

export default DataTable;
