import React, {
  useMemo,
  useState,
  useEffect,
  useRef,
  useCallback,
} from "react";
import {
  MaterialReactTable,
  useMaterialReactTable,
} from "material-react-table";

import { useRecoilState } from "recoil";
import { itemsSelectedAtom } from "../Recoil/Store/atoms";
import { useDispatch, useSelector } from "react-redux";
import { COPY, MOVE, pageSize, SHARE, DELETE } from "../config.js";

import TableContext from "./context/TableContext.js";
import Modal from "./Modal";
import { closeOperation } from "../features/operation/operationSlice.jsx";
import { DeleteModal } from "./Modal/DeleteModal.js";
import CellEdit from "./TableCellEdit.jsx";
import RenderNameCell from "./NameCell.jsx";
import RenderModifiedCell, { DownloadCell } from "./ModifiedCell.jsx";
import ShareModal from "./Modal/ShareModal.jsx";
import { setOperation } from "../features/operation/operationSlice.jsx";
import ItemDetails from "./ItemDetails.jsx";
import { setFileDetails } from "../features/itemdetails/fileDetails.Slice.jsx";
import { setRowHover } from "../features/rowhover/rowHover.Slice.jsx";
import {
  setBrowseItems,
  setSelectedToEdit,
  setRowSelected,
} from "../features/browseItems/browseItemsSlice.js";
import { extract_items_from_ids } from "../util.js";

const colFn = (layout, path, nav) => [
  {
    accessorKey: "name",
    header: "Name",
    size: 200,
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
    size: 75,
    enableEditing: false,
    enableColumnActions: false,
    muiTableHeadCellProps: {
      align: "left",
    },
  },
  {
    accessorKey: "versions",
    header: "Versions",
    size: 75,
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
    size: 100,
    Cell: ({ row }) => <DownloadCell row={row.original} />,
  },
];

const DataTable = ({
  layout,
  path,
  nav,
  isLoading,
  isError,
  status,
  startedTimeStamp,
  rows,
  isFetching,
}) => {
  const [coords, setCoords] = useState({ x: 0, y: 0 });

  const [selected, setItemsSelection] = useRecoilState(itemsSelectedAtom);

  const edit = useSelector((state) => state.rename);
  const operation = useSelector((state) => state.operation);
  const fileDetails = useSelector((state) => state.fileDetails);
  const browse = useSelector((state) => state.browseItems);
  const dispatch = useDispatch();
  const tableContainerRef = useRef(null);
  const rowVirtualizerInstanceRef = useRef(null);

  const [rowSelection, setRowSelection] = useState({});

  const [showContextMenu, setShowContextMenu] = useState(false);

  const columns = useMemo(() => colFn(layout, path, nav), [layout, path, nav]);

  useEffect(() => {
    const { files, folders } = extract_items_from_ids(browse.rowSelection);

    setItemsSelection(() => ({
      fileIds: [...files],
      directories: [...folders],
    }));
    if (Object.keys(browse.rowSelection).length === 1) {
      dispatch(setSelectedToEdit(Object.keys(browse.rowSelection)[0]));
      if (files.length === 1 && fileDetails.open) {
        const selectedRow = rows.find(
          (row) => row.id === browse.selectedToEdit
        );
        dispatch(setFileDetails({ open: true, file: selectedRow }));
      }
    } else {
      dispatch(setSelectedToEdit(undefined));
      dispatch(setFileDetails({ open: false, file: {} }));
    }
  }, [browse.rowSelection, setItemsSelection, fileDetails.open]);

  useEffect(() => {
    if (edit.editStart && browse.selectedToEdit) {
      const row = table.getRow(browse.selectedToEdit);
      if (row) {
        const cell = row.getAllCells()[1];
        table.setEditingCell(cell);
      }
    }
  }, [edit, browse.rowSelection]);

  const updateSelectedRow = (prev, row) => {
    if (Object.keys(prev).length === 0 || Object.keys(prev).length === 1) {
      dispatch(setSelectedToEdit({ [row.id]: true }));
      return { [row.id]: true };
    } else {
      if (browse.rowSelection.hasOwnProperty(row.id)) {
        dispatch(setSelectedToEdit(undefined));

        return { ...prev };
      } else {
        // dispatch(setSelectedToEdit(row));
        dispatch(setSelectedToEdit({ [row.id]: true }));

        return { [row.id]: true };
      }
    }
  };

  const contextMenu = (event, row) => {
    event.preventDefault();

    dispatch(setRowSelected(updateSelectedRow(browse.rowSelection, row)));

    setShowContextMenu(true);
    setCoords({ x: event.clientX + 2, y: event.clientY - 6 });
  };

  useEffect(() => {
    dispatch(setRowSelected(rowSelection));
  }, [rowSelection]);

  const handleContextClose = () => {
    setShowContextMenu(false);
  };

  const onDeleteSubmit = () => {
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

  const handleRowClick = (row, e) => {
    if (e.target.id !== row.id.split(";")[1]) {
      dispatch(setRowSelected({ [row.id]: true }));
    }
    if (row.original.item === "file") {
    }
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
          if (browse.page * pageSize <= browse.total) {
            dispatch(
              setBrowseItems({
                ...browse,
                page: browse.page + 1,
                query: true,
                reLoad: false,
              })
            );
          } else {
            dispatch(
              setBrowseItems({
                ...browse,
                query: false,
                isFetching: false,
                reLoad: false,
              })
            );
          }
        }
      }
    },
    [isLoading, startedTimeStamp, status, browse]
  );

  const table = useMaterialReactTable({
    columns,
    data: rows,
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
    muiTopToolbarProps: () => ({ sx: { display: "block" } }),
    muiBottomToolbarProps: () => ({
      sx: { display: "block" },
    }),
    // muiTableBodyProps: () => ({
    //   sx: { minHeight: "60vh" },
    // }),
    muiTableBodyRowProps: ({ row }) => ({
      onClick: (e) => handleRowClick(row, e),
      onContextMenu: (e) => contextMenu(e, row, e),
      onMouseEnter: () =>
        dispatch(setRowHover({ rowId: row.id, isHover: true })),
      onMouseLeave: () =>
        dispatch(setRowHover({ rowId: null, isHover: false })),
      sx: {
        height: "60px",
      },
    }),
    muiTableBodyCellProps: () => ({
      sx: { "&:hover": { outline: "none" } },
    }),
    muiTableContainerProps: ({ table }) => ({
      ref: tableContainerRef,
      sx: {
        height: `calc(100% - ${table.refs.topToolbarRef.current?.offsetHeight}px - ${table.refs.bottomToolbarRef.current?.offsetHeight}px)`,
        width: "100%",
      },
      onScroll: (event) => fetchMoreOnBottomReached(event.target),
    }),

    state: {
      rowSelection: browse.rowSelection,
      showProgressBars: isFetching,
      showSkeletons: browse.reLoad ? false : isFetching ? false : isLoading,
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

export default React.memo(DataTable);
