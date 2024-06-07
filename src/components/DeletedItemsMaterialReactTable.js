import FolderIcon from "../components/icons/FolderIcon";
import FileIcon from "../components/icons/FileIcon";

import React, { useEffect, useMemo } from "react";
import {
  Typography,
  Box,
  Button,
  Snackbar,
  CircularProgress,
} from "@mui/material";

import { BreadCrumb } from "./breadCrumbs/CollapsibleBreadCrumbs";

import { svgIconStyle } from "./fileFormats/FileFormat";
import TrashModal from "./Modal/TrashModal";
import { TrashContext } from "./UseContext";
import BulkTrashModal from "./Modal/BulkTrashModal";
import BulkTrashDeleteModal from "./Modal/BulkTrashDeleteModal";
import {
  MaterialReactTable,
  useMaterialReactTable,
} from "material-react-table";

import DeleteForeverIcon from "@mui/icons-material/DeleteForeverSharp";
import { useDispatch } from "react-redux";
import { setSelectedTrashBatch } from "../features/trash/selectedTrashBatch";

const restoreButtonStyle = {
  textTransform: "none",
  width: 200,
  ":hover": {
    background: "#004DC7",
  },
  background: "#0061FE",
  borderRadius: 0,
  boxShadow: "none",
  fontWeight: 600,
};

const deleteButtonStyle = {
  textTransform: "none",
  background: "transparent",
  position: "relative",
  margin: 0,
  padding: 0,
  "&::after": {
    content: '""',
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: "1px",
    background: "rgb(187,181,174)",
  },
  "&:hover::after": {
    background: "black",
  },
  ":hover": {
    background: "transparent",
  },
  width: 200,
  color: "black",
  fontWeight: 600,
};

const NameCell = ({ row }) => {
  if (row.item === "folder")
    return (
      <div className="flex flex-col justify-start items-center">
        <div className="flex justify-start items-center">
          <FolderIcon style={svgIconStyle} />
          {row.name}
        </div>
        <div className="w-full pl-[4px]">
          <BreadCrumb path={row.path} id={row.id} />
        </div>
      </div>
    );
  return (
    <div className="flex flex-col justify-start items-center">
      <div className="flex justify-start items-center">
        <FileIcon style={svgIconStyle} />
        {row.name}
      </div>
      <div className="w-full pl-[4px]">
        <BreadCrumb path={row.path} id={row.id} />
      </div>
    </div>
  );
};

const colFn = () => [
  {
    accessorKey: "name",
    header: "Name",
    size: 150,
    enableColumnActions: false,
    enableEditing: false,
    muiTableHeadCellProps: {
      align: "left",
    },
    Cell: ({ row, table }) => <NameCell row={row.original} />,
  },

  {
    accessorKey: "deleted",
    header: "Deleted",
    size: 100,
    enableColumnActions: false,
    enableEditing: false,
  },
];

export default React.memo(function DeletedItemsTable({
  rows,
  isLoading,
  isError,
  error,
  isFetching,
  reLoad,
}) {
  const [rowSelectionModel, setRowSelectionModel] = React.useState([]);

  const [openTrashItem, setOpenTrashItem] = React.useState(false);
  const [openTrashItems, setOpenTrashItems] = React.useState(false);
  const [showRestoreButton, setShowRestoreButton] = React.useState(false);
  const [selectedTrashItem, setSelectedTrashItem] = React.useState("");
  const [selectedItems, setSelectedItems] = React.useState([]);
  const columns = useMemo(colFn, []);

  const [openBulkTrashDelete, setOpenBulkTrashDelete] = React.useState(false);

  const [restoring, setRestoring] = React.useState(false);
  const dispatch = useDispatch();

  const handleBulkRestore = () => {
    setShowRestoreButton(false);
    setOpenTrashItems(true);
  };

  const handleBulkTrashDelete = () => {
    setShowRestoreButton(false);
    setOpenBulkTrashDelete(true);
  };

  const updateRow = (prev, row) => {
    if (Object.keys(prev).length > 0) {
      if (prev.hasOwnProperty(row.id)) {
        const filtered = Object.keys(prev)
          .filter((id) => id !== row.id)
          .map((row) => [row, true]);
        const filtered_obj = Object.fromEntries(filtered);
        console.log(filtered_obj);
        setSelectedItems(filtered_obj);
        return filtered_obj;
      }
      setSelectedItems({ ...prev, [row.id]: true });
      return { ...prev, [row.id]: true };
    } else if (Object.keys(prev).length === 0) {
      setOpenTrashItem(true);
      dispatch(setSelectedTrashBatch({ ...row.original }));
      return {};
    }
  };

  const rowClicked = (row, e) => {
    setSelectedItems({});
    updateRow(rowSelectionModel, row);
  };

  useEffect(() => {
    let selected = [];
    Object.keys(rowSelectionModel).forEach((rowID) => {
      selected = [...selected, ...rows.filter((row) => rowID === row.id)];
    });
    setSelectedItems(selected);

    if (Object.keys(rowSelectionModel).length > 0) {
      setShowRestoreButton(true);
    } else {
      setShowRestoreButton(false);
    }
  }, [rowSelectionModel]);

  const table = useMaterialReactTable({
    columns,
    data: rows,
    enablePagination: false,
    enableRowVirtualization: true,
    enableTopToolbar: true,
    enableBottomToolbar: false,
    initialState: { density: "compact" },
    enableRowSelection: true,
    onRowSelectionChange: setRowSelectionModel,
    getRowId: (original) => original.id,
    muiToolbarAlertBannerProps: isError
      ? {
          color: "error",
          children: "Error loading data",
        }
      : undefined,
    muiTableBodyRowProps: ({ row }) => ({
      onClick: (e) => rowClicked(row, e),
      sx: {
        height: "75px",
      },
    }),
    muiTopToolbarProps: () => ({
      sx: { display: "none" },
    }),
    muiTableBodyCellProps: () => ({
      sx: { "&:hover": { outline: "none" } },
    }),
    muiTableContainerProps: ({ table }) => ({
      sx: {
        height: "600px",
        width: "100%",
      },
    }),

    state: {
      rowSelection: rowSelectionModel,
      showProgressBars: isFetching,
      showSkeletons: reLoad ? false : isFetching ? false : isLoading,
      showAlertBanner: isError,
    },
    muiSkeletonProps: {
      animation: "pulse",
    },
    rowVirtualizerOptions: { overscan: 4 },
  });

  return (
    <div className={`w-full h-full flex flex-row`}>
      <div className="w-full h-full">
        <h2 className="w-full text-left font-sans font-semibold text-2xl">
          Deleted Files
        </h2>
        <h3 className="w-full text-left font-sans text-md">
          You can restore any file deleted in the last 30 days.
        </h3>
        <MaterialReactTable table={table} layoutMode={"grid"} />

        {openTrashItem && (
          <TrashContext.Provider
            value={{
              openTrashItem,
              setOpenTrashItem,
              selectedTrashItem,
              setRestoring,
            }}
          >
            <TrashModal />
          </TrashContext.Provider>
        )}
        {openBulkTrashDelete && (
          <TrashContext.Provider
            value={{
              openBulkTrashDelete,
              setOpenBulkTrashDelete,
              selectedItems,
              setRestoring,
            }}
          >
            <BulkTrashDeleteModal />
          </TrashContext.Provider>
        )}
        {openTrashItems && (
          <TrashContext.Provider
            value={{
              openTrashItems,
              setOpenTrashItems,
              selectedItems,
            }}
          >
            <BulkTrashModal />
          </TrashContext.Provider>
        )}
        {restoring && (
          <Snackbar
            open={restoring}
            message={
              <>
                <CircularProgress /> <Typography>Restoring...</Typography>
              </>
            }
          ></Snackbar>
        )}
      </div>

      {showRestoreButton && (
        <Box
          sx={{
            width: "20%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Typography align="center">
            {Object.keys(selectedItems).length} item selected
          </Typography>
          <Button
            variant="contained"
            sx={restoreButtonStyle}
            disableElevation
            onClick={handleBulkRestore}
          >
            Restore
          </Button>
          <Button
            variant="text"
            sx={deleteButtonStyle}
            startIcon={<DeleteForeverIcon />}
            onClick={handleBulkTrashDelete}
          >
            Permanently delete
          </Button>
        </Box>
      )}
    </div>
  );
});
