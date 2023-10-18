import DownloadItems from "./DownloadItems";

import FileOpenIcon from "@mui/icons-material/FileOpenRounded";
import FolderIcon from "@mui/icons-material/FolderRounded";
import { DataGrid } from "@mui/x-data-grid";

import React, { useEffect, useContext } from "react";
import { Typography, Box } from "@mui/material";
import { Link } from "react-router-dom";
import { Link as Atag } from "@mui/material";
import { useGridApiRef } from "@mui/x-data-grid";
import Activity from "./FileActivity.js";

import { formatBytes } from "../util.js";
import { downloadURL } from "../config.js";
import { ItemSelectionContext, UploadFolderContenxt } from "./UseContext.js";

const multiple = "multiple";
const file = "file";
const folder = "folder";
const fileVersion = "fileVersion";
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
  border: "1px solid #E0E0E0",
  borderRadius: 0,
  height: 400,
  width: 500,
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

function getFileInfo(files, versionedFiles, id) {
  if (files.has(id) && files.get(id).versions > 1) return versionedFiles[id];
  else if (files.has(id) && files.get(id).versions === 1) {
    const file = new Map([]);
    file.set(id, files.get(id));
    return file;
  }
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
                {/* <FolderIcon sx={iconStyle} /> */}
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
                </Link>
              </Box>
            ) : (
              <Box sx={flexRowStyle}>
                {/* <FileOpenIcon sx={iconStyle} /> */}
                <Atag
                  href={cellValues.row.url}
                  rel="noreferrer"
                  target="_blank"
                  sx={style}
                >
                  <Typography sx={typoGraphyStyle}>
                    {cellValues.row.name}
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

export default React.memo(function DataGridTable({
  layout,
  path,
  nav,
  loading,
}) {
  let rows = [];
  const columns = columnDef(path, nav, layout);
  const [newRows, setNewRows] = React.useState([]);
  const rowClick = React.useRef(false);
  const [rowSelectionModel, setRowSelectionModel] = React.useState([]);
  const filteredFiles = React.useRef(new Map([]));
  const versionedFiles = React.useRef({});
  const tempFiles = React.useRef({});
  const { setItemsSelection, itemsSelected } = useContext(ItemSelectionContext);
  const { fileIds, directories } = itemsSelected;
  const data = useContext(UploadFolderContenxt);
  const [activity, setActivity] = React.useState(false);
  const apiRef = useGridApiRef();
  const gridRef = React.useRef();
  const selectedToEdit = React.useRef();

  console.log("table rendered");

  const rowClicked = (params, event, details) => {
    selectedToEdit.current = params.id;
    rowClick.current = false;

    setRowSelectionModel((prev) => {
      if (prev.includes(params.id) && prev.length === 1) {
        rowClick.current = true;
        setActivity(false);
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
      setActivity(false);
    }
  }, [rowSelectionModel, setItemsSelection]);

  useEffect(() => {
    return apiRef.current.subscribeEvent("scrollPositionChange", () => {
      const data = gridRef.current.querySelector(
        ".MuiDataGrid-virtualScroller"
      );
      console.log(data.scrollTop + data.clientHeight, data.scrollHeight);
    });
  }, [apiRef]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/exhaustive-deps
    if (!loading) {
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
      console.log(data.folders);
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
      setNewRows(rows);
    } else {
      setNewRows([]);
    }
  }, [data]);
  return (
    <Box sx={gridContainerStyle}>
      <DataGrid
        rows={newRows}
        ref={gridRef}
        apiRef={apiRef}
        columns={columns}
        initialState={{
          pagination: {
            paginationModel: {
              pageSize: 50,
            },
          },
        }}
        pageSizeOptions={[5, 10, 15, 20, 50, 100]}
        loading={loading}
        disableVirtualization={false}
        onRowClick={rowClicked}
        onProcessRowUpdateError={(err) => console.log(err)}
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
      {activity && selectedToEdit.current && (
        <Activity
          versions={getFileInfo(
            filteredFiles.current,
            versionedFiles.current,
            selectedToEdit.current.split(";")[4]
          )}
          setActivity={setActivity}
        />
      )}
    </Box>
  );
});
