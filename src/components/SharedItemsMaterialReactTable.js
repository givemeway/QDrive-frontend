import React, { useMemo, useRef, useCallback } from "react";
import {
  MaterialReactTable,
  useMaterialReactTable,
} from "material-react-table";

import { useDispatch, useSelector } from "react-redux";
import { pageSize } from "../config.js";

import CellEdit from "./TableCellEdit.jsx";
import RenderNameCell from "./NameCell.jsx";
import { DownloadCell } from "./ModifiedCell.jsx";

import { setRowHover } from "../features/rowhover/rowHover.Slice.jsx";
import { setBrowseItems } from "../features/browseItems/browseItemsSlice.js";

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
    size: 50,
    enableEditing: false,
    enableColumnActions: false,
    muiTableHeadCellProps: {
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
  const browse = useSelector((state) => state.browseItems);
  const dispatch = useDispatch();
  const tableContainerRef = useRef(null);
  const rowVirtualizerInstanceRef = useRef(null);

  const columns = useMemo(() => colFn(layout, path, nav), [layout, path, nav]);

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
    enablePagination: false,
    enableRowVirtualization: true,
    enableTopToolbar: true,
    enableBottomToolbar: true,
    initialState: { density: "compact" },
    getRowId: (original) => original.id,
    muiToolbarAlertBannerProps: isError
      ? {
          color: "error",
          children: "Error loading data",
        }
      : undefined,
    muiTableBodyRowProps: ({ row }) => ({
      onMouseEnter: () =>
        dispatch(setRowHover({ rowId: row.id, isHover: true })),
      onMouseLeave: () =>
        dispatch(setRowHover({ rowId: null, isHover: false })),
      sx: {
        height: "50px",
      },
    }),
    muiTopToolbarProps: () => ({
      sx: { display: "none" },
    }),
    muiTableBodyCellProps: () => ({
      sx: { "&:hover": { outline: "none" } },
    }),
    muiTableContainerProps: ({ table }) => ({
      ref: tableContainerRef,
      sx: {
        // height: `calc(100% - ${table.refs.topToolbarRef.current?.offsetHeight}px - ${table.refs.bottomToolbarRef.current?.offsetHeight}px)`,
        height: "300px",
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
    </>
  );
};

export default React.memo(DataTable);
