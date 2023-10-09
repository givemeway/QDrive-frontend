import DownloadItems from "./DownloadItems";

import FileOpenIcon from "@mui/icons-material/FileOpenRounded";
import FolderIcon from "@mui/icons-material/FolderRounded";
import { DataGrid } from "@mui/x-data-grid";

import React, { useEffect, useContext } from "react";
import { Typography, Box } from "@mui/material";
import { Link } from "react-router-dom";
import { Link as Atag } from "@mui/material";

import { formatBytes } from "../util.js";
import { downloadURL } from "../config.js";
import {
  ItemSelectionContext,
  PathContext,
  UploadFolderContenxt,
} from "./Context.js";
import Modal from "./Modal";
import FileSelectionOverlayMenu from "./context/FileContext";
import MUltipleSelectionOverlayMenu from "./context/MultipleSelectionContext";
import FolderSelectionOverlayMenu from "./context/FolderContext";
import FileVersionSelectionOverlayMenu from "./context/FileVersionContext";
import Share from "./Share";

const multiple = "multiple";
const file = "file";
const folder = "folder";
const fileVersion = "fileVersion";

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
};

const typoGraphyStyle = {
  fontSize: "1.25rem",
  flexGrow: 1,
  textAlign: "left",
};

const iconStyle = {
  width: 50,
  height: 50,
  color: "#A1C9F7",
};

const buildCellValueForFile = (file) => {
  return {
    id: `file;${file.uuid};device=${encodeURIComponent(
      file.device
    )}&dir=${encodeURIComponent(file.directory)}&file=${encodeURIComponent(
      file.filename
    )};${file.filename};${file.origin}`,
    name: file.filename,
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
    modified: file.last_modified,
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
      field: "name",
      headerName: "Name",
      flex: 0.55,
      editable: true,
      renderCell: (cellValues) => {
        return (
          <>
            {cellValues.row.item === "folder" ? (
              <Box sx={flexRowStyle}>
                <FolderIcon sx={iconStyle} />
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
                <FileOpenIcon sx={iconStyle} />
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
      flex: 0.15,
      editable: false,
    },
    {
      field: "versions",
      headerName: "Versions",
      type: "number",
      flex: 0.15,
      editable: false,
    },
    {
      field: "modified",
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
  const [coords, setCoords] = React.useState({ x: 0, y: 0 });
  const [openContext, setOpenContext] = React.useState(null);
  const [rowSelectionModel, setRowSelectionModel] = React.useState([]);
  const filteredFiles = React.useRef(new Map([]));
  const versionedFiles = React.useRef({});
  const originFileId = React.useRef("");
  const ref = React.useRef();
  const { setItemsSelection, itemsSelected } = useContext(ItemSelectionContext);
  const data = useContext(UploadFolderContenxt);
  const [startMove, setStartMove] = React.useState(false);
  const [download, setDownload] = React.useState(false);
  const [selectionType, setSelectionType] = React.useState("");
  const [share, setShare] = React.useState(false);

  console.log("table rendered");

  const contextMenu = (event) => {
    event.preventDefault();
    const type = event.currentTarget.getAttribute("data-id").split(";")[0];
    const rowId = event.currentTarget.getAttribute("data-id");

    console.log("triggered");
    setRowSelectionModel((prev) => {
      if (prev.length === 0 || prev.length === 1) {
        const originId = (originFileId.current = event.currentTarget
          .getAttribute("data-id")
          .split(";")[4]);
        const hasVersions = versionedFiles.current.hasOwnProperty(originId);
        if (type === file && hasVersions) {
          setSelectionType(fileVersion);
        } else {
          setSelectionType(type);
        }
        return [rowId];
      } else {
        if (rowSelectionModel.includes(rowId)) {
          setSelectionType(multiple);
          return [...prev];
        } else {
          const originId = (originFileId.current = event.currentTarget
            .getAttribute("data-id")
            .split(";")[4]);
          const hasVersions = versionedFiles.current.hasOwnProperty(originId);
          if (type === file && hasVersions) {
            setSelectionType(fileVersion);
          } else {
            setSelectionType(type);
          }
          return [rowId];
        }
      }
    });
    setOpenContext(true);
    setCoords({ x: event.clientX + 2, y: event.clientY - 6 });
  };
  useEffect(() => {
    console.log("selection type: ", selectionType);
  }, [selectionType]);

  const moveItems = () => {
    setStartMove(true);
    setOpenContext(null);
  };

  const handleClose = () => {
    setOpenContext(null);
  };

  const rowClicked = (params, event, details) => {
    rowClick.current = false;
    setRowSelectionModel((prev) => {
      if (prev.includes(params.id) && prev.length === 1) {
        rowClick.current = true;
        return [];
      } else if (prev.length >= 1) {
        rowClick.current = true;
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
        files.push({ id: item[1], path: item[2], file: item[3] });
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
  }, [rowSelectionModel]);

  useEffect(() => {
    console.log(download);
  }, [download]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/exhaustive-deps
    if (!loading) {
      // eslint-disable-next-line react-hooks/exhaustive-deps
      versionedFiles.current = {};
      data.files.forEach((file) => {
        const fileItem = buildCellValueForFile(file);

        if (!filteredFiles.current.has(file.origin)) {
          filteredFiles.current.set(file.origin, fileItem);
        } else {
          const curVer = filteredFiles.current.get(file.origin)["versions"];
          if (curVer < file.versions) {
            filteredFiles.current.set(file.origin, fileItem);
          }
          if (versionedFiles.current.hasOwnProperty(file.origin)) {
            versionedFiles.current[file.origin].set(file.uuid, file);
          } else {
            versionedFiles.current[file.origin] = new Map();
            versionedFiles.current[file.origin].set(file.uuid, file);
          }
        }
      });
      // eslint-disable-next-line react-hooks/exhaustive-deps

      // eslint-disable-next-line react-hooks/exhaustive-deps
      rows = Array.from(filteredFiles.current).map((file) => file[1]);

      rows = [
        ...rows,
        ...data.folders.map((folder) => ({
          id: `folder;${folder.uuid};${folder.path};${folder.folder};${folder.uuid}`,
          name: folder.folder,
          size: "--",
          path: folder.path,
          versions: "--",
          modified: folder.created_at,
          item: "folder",
        })),
      ];

      setNewRows(rows);
    } else {
      setNewRows([]);
    }
  }, [data]);
  return (
    <Box sx={{ height: "100%", width: "100%" }}>
      <DataGrid
        rows={newRows}
        columns={columns}
        initialState={{
          pagination: {
            paginationModel: {
              pageSize: 10,
            },
          },
        }}
        pageSizeOptions={[5, 10, 15, 20, 50, 100]}
        checkboxSelection
        slotProps={{
          row: {
            onContextMenu: contextMenu,
            style: { cursor: "context-menu" },
          },
        }}
        loading={loading}
        disableVirtualization={false}
        onRowClick={rowClicked}
        onRowSelectionModelChange={(newRowSelectionModel) => {
          if (!rowClick.current) setRowSelectionModel(newRowSelectionModel);
          rowClick.current = false;
        }}
        rowSelectionModel={rowSelectionModel}
        density={"comfortable"}
        sx={{
          "& .MuiDataGrid-cell:focus-within": {
            outline: "none !important",
          },
          "& .MuiDataGrid-cell": {
            borderBottom: "none",
          },
        }}
      />
      {openContext && selectionType === file && (
        <FileSelectionOverlayMenu
          handleClose={handleClose}
          moveItems={moveItems}
          setDownload={setDownload}
          coords={coords}
          setShare={setShare}
          reference={ref}
        />
      )}
      {openContext && selectionType === fileVersion && (
        <FileVersionSelectionOverlayMenu
          handleClose={handleClose}
          moveItems={moveItems}
          setDownload={setDownload}
          coords={coords}
          setShare={setShare}
          reference={ref}
        />
      )}
      {openContext && selectionType === folder && (
        <FolderSelectionOverlayMenu
          handleClose={handleClose}
          moveItems={moveItems}
          setDownload={setDownload}
          coords={coords}
          setShare={setShare}
          reference={ref}
        />
      )}
      {openContext && selectionType === multiple && (
        <MUltipleSelectionOverlayMenu
          handleClose={handleClose}
          moveItems={moveItems}
          setDownload={setDownload}
          coords={coords}
          setShare={setShare}
          reference={ref}
        />
      )}
      {startMove && (
        <ItemSelectionContext.Provider value={itemsSelected}>
          <Modal setStartMove={setStartMove} moveImmediate={true} />
        </ItemSelectionContext.Provider>
      )}
      {download && (
        <ItemSelectionContext.Provider value={itemsSelected}>
          <DownloadItems startImmediate={true} setDownload={setDownload} />
        </ItemSelectionContext.Provider>
      )}
      {share && (
        <ItemSelectionContext.Provider value={itemsSelected}>
          <Share shareImmediate={true} />
        </ItemSelectionContext.Provider>
      )}
    </Box>
  );
});
