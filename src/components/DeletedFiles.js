import DownloadItems from "./DownloadItems";

import FileOpenIcon from "@mui/icons-material/FileOpenRounded";
import FolderIcon from "@mui/icons-material/FolderRounded";
import { DataGrid } from "@mui/x-data-grid";

import React, { useEffect, useContext } from "react";
import { Typography, Box } from "@mui/material";
import { Link } from "react-router-dom";
import { Link as Atag } from "@mui/material";
import { useGridApiRef } from "@mui/x-data-grid";
import { formatBytes } from "../util.js";
import { downloadURL, trashTotalURL } from "../config.js";
import { EditContext, ItemSelectionContext } from "./UseContext.js";

import useRename from "./hooks/RenameItemHook";
import useFetchDeletedItems from "./hooks/FetchDeletedItems";
import useFetchTotal from "./hooks/FetchTotalHook";

const options = {
  year: "numeric",
  month: "short",
  day: "numeric",
  hour: "numeric",
  minute: "numeric",
  hour12: true,
};

const dataGridStyle = {
  "& .MuiDataGrid-cell:focus-within": {
    outline: "none !important",
  },
  "& .MuiDataGrid-row:hover": { backgroundColor: "#F5EFE5" },
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
};

const gridContainerStyle = {
  height: "100%",
  width: "100%",
  display: "flex",
  flexDirection: "row",
  border: "none",
};

const style = {
  textDecoration: "none",
  textTransform: "none",
  fontSize: "1rem",
  fontWeight: 300,
  color: "rgb(128, 128, 128)",
  "&:hover": { backgroundColor: "transparent" },
};

const flexRowStyle = {
  display: "flex",
  flexDirection: "row",
  justifyContent: "flex-start",
  alignItems: "center",
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

const buildCellValueForFile = (file) => {
  return {
    id: `file;${file.uuid};device=${encodeURIComponent(
      file.device
    )}&dir=${encodeURIComponent(file.directory)}&file=${encodeURIComponent(
      file.filename
    )};${file.filename};${file.origin}`,
    name: file.filename,
    icon: "file",
    size: formatBytes(file.size),
    dir: `${file.device}/${file.directory}`,
    path: `${downloadURL}?device=${encodeURIComponent(
      file.device
    )}&dir=${encodeURIComponent(file.directory)}&file=${encodeURIComponent(
      file.filename
    )}&uuid=${encodeURIComponent(file.uuid)}`,
    url: `https://localhost:3001${downloadURL}?file=${encodeURIComponent(
      file.filename
    )}&uuid=${encodeURIComponent(file.uuid)}`,
    origin: file.origin,
    versions: file.versions,
    last_modified: new Date(file.last_modified).toLocaleString(
      "en-IN",
      options
    ),
    item: "file",
  };
};

function ensureStartsWithSlash(input) {
  return input.startsWith("/") ? input : "/" + input;
}

function generateLink(url, folderPath, layout, nav, id) {
  if (layout === "dashboard") return url + folderPath;
  if (layout === "share") {
    const dir = folderPath.split(nav)[1];
    return dir === "" ? url + "/h" : url + "/h" + dir;
  }
  if (layout === "transfer") {
    let dir = folderPath.split(nav)[1];
    if (nav === "/") {
      dir = folderPath.split(nav).slice(1).join("/");
    }
    return dir === ""
      ? url + `/h?k=${id}`
      : url + "/h" + ensureStartsWithSlash(dir) + `?k=${id}`;
  }
}
const columnDef = (path, nav, layout) => {
  return [
    {
      field: "icon",
      headerName: "Type",
      width: 30,
      align: "center",
      headerAlign: "left",
      editable: false,
      renderCell: (param) => {
        <FolderIcon sx={iconStyle} />;
        return param.row.item === "folder" ? (
          <FolderIcon sx={iconStyle} />
        ) : (
          <FileOpenIcon sx={iconStyle} />
        );
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
            {cellValues.row.item === "folder" ? (
              <Box sx={flexRowStyle}>
                <Link
                  to={generateLink(
                    path,
                    cellValues.row.path,
                    layout,
                    nav,
                    cellValues.row.id.split(";")[4]
                  )}
                  style={{ ...style, gap: 15 }}
                >
                  <Typography sx={typoGraphyStyle}>
                    {cellValues.row.name}
                  </Typography>
                  <Typography
                    sx={{ ...typoGraphyStyle, fontSize: 12, color: "#736C64" }}
                  >
                    {cellValues.row.path}
                  </Typography>
                </Link>
              </Box>
            ) : (
              <Box sx={flexRowStyle}>
                <Atag
                  href={cellValues.row.url}
                  rel="noreferrer"
                  target="_blank"
                  sx={style}
                >
                  <Typography sx={typoGraphyStyle}>
                    {cellValues.row.name}
                  </Typography>
                  <Typography
                    sx={{ ...typoGraphyStyle, fontSize: 12, color: "#736C64" }}
                  >
                    {cellValues.row.dir}
                  </Typography>
                </Atag>
              </Box>
            )}
          </>
        );
      },
    },
    {
      field: "size",
      headerName: "Size",
      headerAlign: "center",
      align: "center",
      flex: 0.1,
      editable: false,
    },
    {
      field: "versions",
      headerAlign: "center",
      headerName: "Versions",
      type: "number",
      align: "center",
      flex: 0.1,
      editable: false,
    },
    {
      field: "last_modified",
      headerName: "Modified",
      description: "This column has a value getter and is not sortable.",
      flex: 0.15,
      editable: false,
    },
  ];
};

export default React.memo(function DataGridTable({ layout, path, nav }) {
  const rows = React.useRef([]);
  const columns = columnDef(path, nav, layout);
  const [newRows, setNewRows] = React.useState([]);
  const rowClick = React.useRef(false);
  const [rowSelectionModel, setRowSelectionModel] = React.useState([]);
  const filteredFiles = React.useRef(new Map([]));
  const versionedFiles = React.useRef({});
  const tempFiles = React.useRef({});
  const { setItemsSelection, itemsSelected } = useContext(ItemSelectionContext);
  const { fileIds, directories } = itemsSelected;
  const { edit, setEdit } = useContext(EditContext);
  const apiRef = useGridApiRef();
  const gridRef = React.useRef();
  const selectedToEdit = React.useRef();
  const [paginationModel, setPaginationModel] = React.useState({
    page: 0,
    pageSize: 2,
  });
  const [total, fetchTotal] = useFetchTotal(trashTotalURL);
  const [rowCount, setRowCount] = React.useState(0);
  const [data, setData] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [page, setPage] = React.useState(0);
  const scrollPosition = React.useRef({});
  const [rowCountState, setRowCountState] = React.useState(rowCount);

  const [rename] = useRename(fileIds, directories, edit, setEdit);
  const [deletedItems, initFetchDeleted, deletedLoaded] =
    useFetchDeletedItems();

  console.log("table rendered");

  const rowClicked = (params, event, details) => {
    selectedToEdit.current = params.id;
    rowClick.current = false;

    setRowSelectionModel((prev) => {
      if (prev.includes(params.id) && prev.length === 1) {
        rowClick.current = true;
        selectedToEdit.current = undefined;
        return [];
      } else if (prev.length >= 1) {
        rowClick.current = true;
        selectedToEdit.current = params.id;
        return [params.id];
      }
    });
  };

  useEffect(() => {
    fetchTotal(trashTotalURL);
    setLoading(true);
  }, []);

  useEffect(() => {
    setRowCount(total);
  }, [total]);

  useEffect(() => {
    if (deletedLoaded) {
      setData(deletedItems);
      setLoading(false);
    }
  }, [deletedLoaded, deletedItems]);

  useEffect(() => {
    setLoading(true);
    initFetchDeleted(
      paginationModel.page * parseInt(paginationModel.pageSize / 2),
      parseInt(paginationModel.pageSize / 2)
    );
    setPage(paginationModel.page);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paginationModel.page, paginationModel.pageSize]);
  useEffect(() => {
    setRowCountState((prevRowCountState) =>
      rowCount !== undefined ? rowCount : prevRowCountState
    );
  }, [rowCount, setRowCountState]);

  useEffect(() => {
    const files = [];
    const folders = [];
    rowSelectionModel.forEach((val) => {
      const item = val.split(";");
      if (item[0] === "file") {
        files.push({
          id: item[1],
          path: item[2],
          file: item[3],
          origin: item[4],
        });
      }
      if (item[0] === "folder") {
        folders.push({
          id: item[1],
          path: item[2],
          folder: item[3],
          uuid: item[4],
        });
      }
    });
    setItemsSelection((prev) => ({
      fileIds: [...files],
      directories: [...folders],
    }));

    if (rowSelectionModel.length === 1)
      selectedToEdit.current = rowSelectionModel[0];
    else {
      selectedToEdit.current = undefined;
    }
  }, [rowSelectionModel, setItemsSelection]);

  // useEffect(() => {
  //   return apiRef.current.subscribeEvent("scrollPositionChange", (params) => {
  //     scrollPosition.current = params;
  //     const data = gridRef.current.querySelector(
  //       ".MuiDataGrid-virtualScroller"
  //     );
  //     console.log(data.scrollTop + data.clientHeight, data.scrollHeight);
  //     if (data.scrollTop + data.clientHeight === data.scrollHeight) {
  //       console.log(rows.current.length, paginationModel.pageSize);
  //       if (rows.current.length > paginationModel.pageSize) {
  //         setPage((prev) => {
  //           apiRef.current.setPage(prev + 1);
  //           apiRef.current.scroll({
  //             ...params,
  //             top: parseInt(params.top - 100),
  //           });
  //           return prev + 1;
  //         });
  //       }
  //     }
  //   });
  // }, [apiRef]);

  useEffect(() => {
    let rows = [];
    // eslint-disable-next-line react-hooks/exhaustive-deps
    if (!Array.isArray(data)) {
      // eslint-disable-next-line react-hooks/exhaustive-deps
      versionedFiles.current = {};
      tempFiles.current = {};
      data.files.forEach((file) => {
        const fileItem = buildCellValueForFile(file);
        if (!filteredFiles.current.has(file.origin)) {
          filteredFiles.current.set(file.origin, fileItem);
          tempFiles.current[file.origin] = new Map();

          tempFiles.current[file.origin].set(file.uuid, fileItem);
        } else {
          tempFiles.current[file.origin]?.set(file.uuid, fileItem);
          const curVer = filteredFiles.current.get(file.origin)["versions"];
          if (curVer < file.versions) {
            filteredFiles.current.set(file.origin, fileItem);
          }
        }
      });
      // eslint-disable-next-line react-hooks/exhaustive-deps
      const versionArray = Object.entries(tempFiles.current).filter(
        (val) => Array.from(val[1]).map((file) => file[1]).length > 1
      );
      versionArray.forEach((file) => {
        versionedFiles.current[file[0]] = new Map();
        Array.from(file[1]).forEach((item) =>
          versionedFiles.current[file[0]].set(item[0], item[1])
        );
      });
      // eslint-disable-next-line react-hooks/exhaustive-deps

      rows = Array.from(filteredFiles.current).map((file) => file[1]);

      rows = [
        ...rows,
        ...data.folders.map((folder) => ({
          id: `folder;${folder.uuid};${folder.path};${folder.folder};${folder.uuid}`,
          icon: "folder",
          name: folder.folder,
          size: "--",
          path: folder.path,
          versions: "--",
          last_modified: new Date(folder.created_at).toLocaleString(
            "en-in",
            options
          ),
          item: "folder",
        })),
      ];
      setNewRows([...rows]);
    } else {
      setNewRows([]);
    }
  }, [data, loading]);

  useEffect(() => {
    console.log(newRows);
  }, [newRows]);

  return (
    <Box sx={gridContainerStyle}>
      <DataGrid
        rows={newRows}
        ref={gridRef}
        apiRef={apiRef}
        columns={columns}
        paginationMode="server"
        rowCount={rowCountState}
        onPaginationModelChange={setPaginationModel}
        pageSizeOptions={[2, 5, 10, 15, 20, 50, 100]}
        initialState={{
          pagination: {
            paginationModel: {
              pageSize: 2,
            },
          },
        }}
        checkboxSelection
        loading={loading}
        disableVirtualization={false}
        onRowClick={rowClicked}
        processRowUpdate={(newRow) => {
          rename();
          setEdit((prev) => ({
            ...prev,
            val: newRow.name,
            editStop: true,
            editStart: false,
          }));
          return newRow;
        }}
        onProcessRowUpdateError={(err) => console.log(err)}
        editMode="cell"
        onRowSelectionModelChange={(newRowSelectionModel) => {
          if (!rowClick.current) setRowSelectionModel(newRowSelectionModel);
          rowClick.current = false;
        }}
        rowSelectionModel={rowSelectionModel}
        // hideFooter={true}
        rowHeight={40}
        density={"standard"}
        sx={dataGridStyle}
      />
    </Box>
  );
});
