import FolderOpenIcon from "@mui/icons-material/FolderOpenRounded";
import FileOpenIcon from "@mui/icons-material/FileOpenRounded";
import FolderIcon from "@mui/icons-material/FolderRounded";
import { DataGrid, gridRowsLoadingSelector } from "@mui/x-data-grid";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import React, { useEffect, useContext } from "react";
import { Button, Typography, Box } from "@mui/material";
import { Link } from "react-router-dom";
import { Link as Atag } from "@mui/material";
import { download } from "../downloadFile.js";
import { formatBytes } from "../util.js";
import { downloadURL } from "../config.js";
import { ItemSelectionContext, UploadFolderContenxt } from "./Context.js";

const style = {
  textDecoration: "none",
  textTransform: "none",
  display: "flex",
  flexDirection: "row",
  justifyContent: "flex-start",
  gap: 2,
  alignItems: "center",
  fontSize: "1.5rem",
  color: "rgb(128, 128, 128)",
  "&:hover": { backgroundColor: "transparent" },
  width: "100%",
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
    )};${file.filename}`,
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

export default React.memo(function DataGridTable({
  layout,
  path,
  nav,
  loading,
}) {
  let rows = [];
  const [newRows, setNewRows] = React.useState([]);
  const [folderContextMenu, setFolderContextMenu] = React.useState(null);
  const [fileContextMenu, setFileContextMenu] = React.useState(null);

  const [rowSelectionModel, setRowSelectionModel] = React.useState([]);
  const filteredFiles = React.useRef(new Map([]));
  const versionedFiles = React.useRef({});
  const { setItemsSelection } = useContext(ItemSelectionContext);
  const data = useContext(UploadFolderContenxt);

  console.log("table rendered");
  const columns = [
    {
      field: "name",
      headerName: "Name",
      flex: 0.55,
      editable: true,
      renderCell: (cellValues) => {
        return (
          <>
            {cellValues.row.item === "folder" ? (
              <>
                <div
                  onContextMenu={handleFolderContextMenu}
                  style={{ cursor: "context-menu", width: "100%" }}
                >
                  <Link
                    to={generateLink(
                      path,
                      cellValues.row.path,
                      layout,
                      nav,
                      cellValues.row.id.split(";")[4]
                    )}
                    style={{ ...style, marginLeft: 10, gap: 15 }}
                  >
                    <FolderIcon sx={iconStyle} />

                    <Typography sx={typoGraphyStyle}>
                      {cellValues.row.name}
                    </Typography>
                  </Link>
                </div>
                <Menu
                  open={folderContextMenu !== null}
                  onClose={handleClose}
                  anchorReference="anchorPosition"
                  anchorPosition={
                    folderContextMenu !== null
                      ? {
                          top: folderContextMenu.mouseY,
                          left: folderContextMenu.mouseX,
                        }
                      : undefined
                  }
                >
                  <MenuItem onClick={handleClose}>Move</MenuItem>
                  <MenuItem onClick={handleClose}>Copy</MenuItem>
                  <MenuItem onClick={handleClose}>Rename</MenuItem>
                  <MenuItem onClick={handleClose}>Delete</MenuItem>
                  <MenuItem onClick={handleClose}>Share</MenuItem>
                  <MenuItem onClick={handleClose}>Details</MenuItem>
                </Menu>
              </>
            ) : (
              <>
                <div
                  onContextMenu={handleFileContextMenu}
                  style={{ cursor: "context-menu", width: "100%" }}
                >
                  <Atag
                    href={cellValues.row.url}
                    rel="noreferrer"
                    target="_blank"
                    sx={style}
                  >
                    <FileOpenIcon sx={iconStyle} />

                    <Typography sx={typoGraphyStyle}>
                      {cellValues.row.name}
                    </Typography>
                  </Atag>
                </div>
                <Menu
                  open={fileContextMenu !== null}
                  onClose={handleClose}
                  anchorReference="anchorPosition"
                  anchorPosition={
                    fileContextMenu !== null
                      ? {
                          top: fileContextMenu.mouseY,
                          left: fileContextMenu.mouseX,
                        }
                      : undefined
                  }
                >
                  {versionedFiles.current.hasOwnProperty(
                    cellValues.row.origin
                  ) ? (
                    <>
                      <MenuItem onClick={handleClose}>Move</MenuItem>
                      <MenuItem onClick={handleClose}>Copy</MenuItem>
                      <MenuItem onClick={handleClose}>Rename</MenuItem>
                      <MenuItem onClick={handleClose}>Delete</MenuItem>
                      <MenuItem onClick={handleClose}>Share</MenuItem>
                      <MenuItem onClick={handleClose}>Versions</MenuItem>
                    </>
                  ) : (
                    <>
                      <MenuItem onClick={handleClose}>Move</MenuItem>
                      <MenuItem onClick={handleClose}>Copy</MenuItem>
                      <MenuItem onClick={handleClose}>Rename</MenuItem>
                      <MenuItem onClick={handleClose}>Delete</MenuItem>
                      <MenuItem onClick={handleClose}>Share</MenuItem>
                    </>
                  )}
                </Menu>
              </>
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

  const handleFolderContextMenu = (event) => {
    event.preventDefault();
    setFolderContextMenu(
      folderContextMenu === null
        ? {
            mouseX: event.clientX + 2,
            mouseY: event.clientY - 6,
          }
        : null
    );
  };

  const handleFileContextMenu = (event) => {
    event.preventDefault();
    setFileContextMenu(
      fileContextMenu === null
        ? {
            mouseX: event.clientX + 2,
            mouseY: event.clientY - 6,
          }
        : null
    );
  };

  const handleClose = () => {
    setFolderContextMenu(null);
    setFileContextMenu(null);
  };

  const display_file_versions = (e) => {
    console.log(e);
    console.log(versionedFiles.current);
    console.log(versionedFiles.current[e]);
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
        disableRowSelectionOnClick
        // rowHeight={60}
        loading={loading}
        onRowSelectionModelChange={(newRowSelectionModel) => {
          setRowSelectionModel(newRowSelectionModel);
        }}
        rowSelectionModel={rowSelectionModel}
        density={"comfortable"}
      />
    </Box>
  );
});
