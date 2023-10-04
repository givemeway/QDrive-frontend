import FolderOpenIcon from "@mui/icons-material/FolderOpenRounded";
import DriveFileMoveIcon from "@mui/icons-material/DriveFileMove";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import DeleteIcon from "@mui/icons-material/DeleteRounded";
import ShareIcon from "@mui/icons-material/ShareRounded";
import DriveFileRenameOutlineIcon from "@mui/icons-material/DriveFileRenameOutline";
import CopyAllIcon from "@mui/icons-material/CopyAll";

import FileOpenIcon from "@mui/icons-material/FileOpenRounded";
import FolderIcon from "@mui/icons-material/FolderRounded";
import {
  DataGrid,
  gridRowsLoadingSelector,
  useGridApiRef,
} from "@mui/x-data-grid";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import React, { useEffect, useContext } from "react";
import { Button, Typography, Box, Stack, Divider } from "@mui/material";
import { Link } from "react-router-dom";
import { Link as Atag } from "@mui/material";
import { download } from "../downloadFile.js";
import { formatBytes } from "../util.js";
import { downloadURL } from "../config.js";
import { ItemSelectionContext, UploadFolderContenxt } from "./Context.js";
import Modal from "./Modal";

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

const overlayButtonStyle = {
  textDecoration: "none",
  textTransform: "none",
  display: "flex",
  flexDirection: "row",
  justifyContent: "flex-start",
  gap: 2,
  alignItems: "center",
  fontSize: "1.1rem",
  color: "rgb(128, 128, 128)",
  "&:hover": { backgroundColor: "#F5EFE5" },
  width: "100%",
};

const overlayStyle = {
  position: "absolute",
  display: "flex",
  flexDirection: "column",
  background: "#FFFFFF",
  border: "1px solid #CCCCCC",
  boxSizing: "border-box",
  zIndex: 100,
  height: 250,
  width: 150,
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

const OverlayMenu = ({ moveItems, handleClose, coords }) => {
  return (
    <Stack sx={{ ...overlayStyle, top: coords.y, left: coords.x, gap: 0 }}>
      <Button sx={overlayButtonStyle} variant="text" onClick={moveItems}>
        <DriveFileMoveIcon />
        Move
      </Button>
      <Button sx={overlayButtonStyle} variant="text" onClick={handleClose}>
        <ContentCopyIcon />
        Copy
      </Button>
      <Button sx={overlayButtonStyle} variant="text" onClick={handleClose}>
        <DriveFileRenameOutlineIcon />
        Rename
      </Button>
      <Button sx={overlayButtonStyle} variant="text" onClick={handleClose}>
        <ShareIcon />
        Share
      </Button>
      <Button sx={overlayButtonStyle} variant="text" onClick={handleClose}>
        <DeleteIcon />
        Delete
      </Button>
      <Button sx={overlayButtonStyle} variant="text" onClick={handleClose}>
        <CopyAllIcon />
        Versions
      </Button>
    </Stack>
  );
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
  const [rowSelectionModel, setRowSelectionModel] = React.useState([]);
  const filteredFiles = React.useRef(new Map([]));
  const versionedFiles = React.useRef({});
  const originFileId = React.useRef("");
  const { setItemsSelection, itemsSelected } = useContext(ItemSelectionContext);
  const data = useContext(UploadFolderContenxt);
  const [move, setMove] = React.useState(false);

  console.log("table rendered");

  const clickOnDataGrid = () => {
    console.log("clicked on datagrid");
  };
  const handleFileContextMenu = (event) => {
    event.preventDefault();

    originFileId.current = event.currentTarget
      .getAttribute("data-id")
      .split(";")[4];

    setCoords({ x: event.clientX + 2, y: event.clientY - 6 });
    setRowSelectionModel([event.currentTarget.getAttribute("data-id")]);
  };

  const moveItems = () => {
    // console.log(versionedFiles.current[originFileId.current]);
    setMove(true);
    setCoords({ x: 0, y: 0 });
  };

  const handleClose = () => {
    setCoords({ x: 0, y: 0 });
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
    if (!loading) {
      // eslint-disable-next-line react-hooks/exhaustive-deps
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
          id: `folder;${folder.id};${folder.path};${folder.folder};${folder.uuid}`,
          name: folder.folder,
          size: "--",
          path: folder.path,
          versions: "--",
          modified: "--",
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
            onContextMenu: handleFileContextMenu,
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
      {coords.x !== 0 && coords.y !== 0 && (
        <OverlayMenu
          handleClose={handleClose}
          moveItems={moveItems}
          coords={coords}
        />
      )}
      {move && (
        <ItemSelectionContext.Provider value={itemsSelected}>
          <Modal />
        </ItemSelectionContext.Provider>
      )}
    </Box>
  );
});
