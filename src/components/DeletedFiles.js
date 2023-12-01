import FileOpenIcon from "@mui/icons-material/FileOpenRounded";
import FolderIcon from "@mui/icons-material/FolderRounded";
import { DataGrid, useGridApiRef } from "@mui/x-data-grid";

import React, { useEffect } from "react";
import {
  Typography,
  Box,
  Stack,
  Button,
  Snackbar,
  CircularProgress,
} from "@mui/material";
import useFetchDeletedItems from "./hooks/FetchDeletedItems";
import CollapsibleBreadCrumbs from "./breadCrumbs/CollapsibleBreadCrumbs";
import FileIcon from "./icons/FileIcon";
import { get_file_icon } from "./fileFormats/FileFormat";
import TrashModal from "./Modal/TrashModal";
import { TrashContext } from "./UseContext";
import BulkTrashModal from "./Modal/BulkTrashModal";

const options = {
  year: "numeric",
  month: "short",
  day: "numeric",
  hour: "numeric",
  minute: "numeric",
  hour12: true,
};

const buildIndividualFilePath = (device, directory) => {
  if (device === "/") {
    return "/";
  } else if (directory === "/") {
    return "/" + device;
  } else {
    return `/${device}/${directory}`;
  }
};

const dataGridStyle = {
  "& .MuiDataGrid-cell:focus-within": {
    outline: "none !important",
  },
  "& .MuiDataGrid-row:hover": { backgroundColor: "#F5EFE5", cursor: "pointer" },
  "& .MuiDataGrid-cell": {
    borderBottom: "none",
    marginLeft: 0,
    marginRight: 0,
    paddingLeft: 0,
    paddingRight: 0,
  },
  "& .MuiDataGrid-cell--editing": {
    // backgroundColor: "red",
    border: "2px solid #0061FE",
    fontSize: 20,
    boxShadow: 4,
  },
  borderTop: "none",
  borderRadius: 0,
  borderLeft: "none",
  width: "100%",
};

const gridContainerStyle = {
  // height: "100%",
  width: "100%",
  display: "flex",
  flexDirection: "column",
  alignItems: "flex-start",
  border: "none",
};

const flexRowStyle = {
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "flex-start",
  padding: 0,
  margin: 0,
};

const typoGraphyStyle = {
  fontSize: "1rem",
  flexGrow: 1,
  textAlign: "left",
  padding: 0,
  margin: 0,
  fontWeight: 450,
  color: "#1A1918",
  fontFamily: "system-ui",
};

const iconStyle = {
  width: 30,
  height: 35,
  color: "#A1C9F7",
  padding: 0,
  margin: 0,
};

const columnDef = () => {
  return [
    {
      field: "icon",
      headerName: "Type",
      width: 30,
      align: "center",
      headerAlign: "left",
      editable: false,
      renderCell: (param) => {
        if (param.row.item === "folder") {
          return <FolderIcon sx={iconStyle} />;
        } else if (param.row.item === "file") {
          return <FileIcon sx={iconStyle} />;
        } else if (param.row.item === "singleFile") {
          return get_file_icon(param.row.name);
        }
      },
    },
    {
      field: "name",
      headerName: "Name",
      flex: 0.55,
      align: "left",
      headerAlign: "left",
      editable: true,
      renderCell: (cellValues) => {
        return (
          <>
            {
              <Box sx={flexRowStyle}>
                <Typography sx={typoGraphyStyle}>
                  {cellValues.row.name}
                </Typography>
                <Stack>
                  <CollapsibleBreadCrumbs
                    path={cellValues.row.path}
                    id={cellValues.row.id}
                  />
                </Stack>
              </Box>
            }
          </>
        );
      },
    },
    {
      field: "deleted",
      headerName: "Deleted",
      flex: 0.15,
      editable: false,
    },
  ];
};

export default React.memo(function DataGridTable() {
  const rows = React.useRef([]);
  const columns = columnDef();
  const [newRows, setNewRows] = React.useState([]);
  const [rowSelectionModel, setRowSelectionModel] = React.useState([]);
  const apiRef = useGridApiRef();
  const gridRef = React.useRef();
  const [data, setData] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [openTrashItem, setOpenTrashItem] = React.useState(false);
  const [openTrashItems, setOpenTrashItems] = React.useState(false);
  const [showRestoreButton, setShowRestoreButton] = React.useState(false);
  const [selectedTrashItem, setSelectedTrashItem] = React.useState("");
  const [selectedItems, setSelectedItems] = React.useState([]);
  const [deletedItems, initFetchDeleted, deletedLoaded] =
    useFetchDeletedItems();

  const [restoring, setRestoring] = React.useState(false);

  console.log("deleted -- table rendered");

  const handleBulkRestore = () => {
    setOpenTrashItems(true);
  };

  const rowClicked = (params, event, details) => {
    setSelectedItems([]);
    setRowSelectionModel((prev) => {
      if (prev.length > 0) {
        if (prev.includes(params.id))
          return prev.filter((id) => id !== params.id);
        return [...prev, params.id];
      } else if (prev.length === 0) {
        console.log("trigger modal action");
        setOpenTrashItem(true);
        setSelectedTrashItem(params.row);
        // bring the modal window
        // make a api call to fetch details
        return [];
      }
    });
  };

  useEffect(() => {
    setLoading(true);
    initFetchDeleted(0, 10000);
  }, []);

  useEffect(() => {
    if (deletedLoaded) {
      setData(deletedItems);
    }
  }, [deletedLoaded, deletedItems]);

  useEffect(() => {
    if (rowSelectionModel.length > 0) {
      setShowRestoreButton(true);
    } else {
      setShowRestoreButton(false);
    }
  }, [rowSelectionModel]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/exhaustive-deps
    console.log(data);
    if (!Array.isArray(data)) {
      // eslint-disable-next-line react-hooks/exhaustive-deps

      rows.current = data.files.map((file) => ({
        id: file.id,
        item: "file",
        name: file.name,
        path: file.path,
        begin: file?.limit?.begin,
        end: file?.limit?.end,
        items: file?.items,
        deleted: new Date(file.deleted).toLocaleString("en-in", options),
      }));

      rows.current = [
        ...rows.current,
        ...data.folders.map((folder) => ({
          id: folder.id,
          item: "folder",
          name: folder.name,
          path: folder.path,
          begin: folder?.limit?.begin,
          end: folder?.limit?.end,
          items: folder?.items,
          deleted: new Date(folder.deleted).toLocaleString("en-in", options),
        })),
      ];
      rows.current = [
        ...rows.current,
        ...data.file.map((file) => ({
          id: file.uuid,
          item: "singleFile",
          name: file.filename,
          path: buildIndividualFilePath(file.device, file.directory),
          begin: 0,
          end: 0,
          deleted: new Date(file.deletion_date).toLocaleString(
            "en-in",
            options
          ),
        })),
      ];
      console.log(rows.current);
      setNewRows(rows.current);
      setLoading(false);
    }
    // else {
    //   setNewRows([]);
    //   setLoading(false);
    // }
  }, [data, loading]);

  return (
    <Box
      sx={{
        width: "100%",
        display: "flex",
        flexDirection: "row",
        alignItems: "flex-start",
      }}
    >
      <Box
        sx={{
          ...gridContainerStyle,
          width: showRestoreButton ? "80%" : "100%",
        }}
      >
        <Typography sx={{ fontSize: 24, marginLeft: 2 }}>
          Deleted Files
        </Typography>
        <Typography sx={{ fontSize: 16, marginLeft: 2 }}>
          You can restore any file deleted in the last 30 days.
        </Typography>
        <DataGrid
          rows={newRows}
          ref={gridRef}
          apiRef={apiRef}
          columns={columns}
          pageSizeOptions={[2, 5, 10, 15, 20, 25, 50, 100]}
          initialState={{
            pagination: {
              paginationModel: {
                pageSize: 25,
              },
            },
          }}
          checkboxSelection
          disableRowSelectionOnClick={true}
          loading={loading}
          disableVirtualization={false}
          onRowClick={rowClicked}
          onRowSelectionModelChange={(newRowSelectionModel) => {
            if (newRowSelectionModel.length > 0) {
              let selected = [];
              newRowSelectionModel.forEach((rowId) => {
                selected = [
                  ...selected,
                  ...rows.current.filter((row) => rowId == row.id),
                ];
              });
              setSelectedItems(selected);
            } else {
              setSelectedItems([]);
            }
            setRowSelectionModel(newRowSelectionModel);
          }}
          rowSelectionModel={rowSelectionModel}
          rowHeight={50}
          density={"standard"}
          sx={dataGridStyle}
        />
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
        {openTrashItems && (
          <TrashContext.Provider
            value={{
              openTrashItems,
              setOpenTrashItems,
              selectedItems,
              setRestoring,
            }}
          >
            <BulkTrashModal />
          </TrashContext.Provider>
        )}
      </Box>
      {showRestoreButton && (
        <Box sx={{ width: "20%" }}>
          <Button variant="contained" onClick={handleBulkRestore}>
            Restore
          </Button>
        </Box>
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
    </Box>
  );
});
