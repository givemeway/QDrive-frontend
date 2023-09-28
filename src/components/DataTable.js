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

export default React.memo(function DataGridTable({
  layout,
  path,
  nav,
  loading,
}) {
  let rows = [];
  const [newRows, setNewRows] = React.useState([]);
  const [contextMenu, setContextMenu] = React.useState(null);
  const [rowSelectionModel, setRowSelectionModel] = React.useState([]);
  const { setItemsSelection } = useContext(ItemSelectionContext);
  const data = useContext(UploadFolderContenxt);

  console.log("table rendered");
  // let path;
  // if (layout === "dashboard") {
  //   path = "/dashboard/home";
  // } else {
  //   path = layout;
  // }
  console.log(nav);
  const columns = [
    {
      field: "name",
      headerName: "Name",
      flex: 0.5,
      editable: true,
      renderCell: (cellValues) => {
        return (
          <>
            {cellValues.row.item === "folder" ? (
              <>
                <div
                  onContextMenu={handleContextMenu}
                  style={{ cursor: "context-menu" }}
                >
                  <Link
                    // to={dir + cellValues.row.path}
                    to={
                      layout === "dashboard"
                        ? path + cellValues.row.path
                        : layout === "share"
                        ? cellValues.row.path.split(nav)[1] === ""
                          ? path + "/h"
                          : path + "/h" + cellValues.row.path.split(nav)[1]
                        : cellValues.row.path.split(nav)[1] === ""
                        ? path + "/h"
                        : path +
                          "/h" +
                          cellValues.row.path.split(nav)[1] +
                          `?k=${cellValues.row.id.split(";")[4]}`
                    }
                    style={{
                      textDecoration: "none",
                      display: "flex",
                      flexDirection: "row",
                      justifyContent: "flex-start",
                      marginLeft: 10,
                      gap: 15,
                      alignItems: "center",
                      color: "rgb(128, 128, 128)",
                    }}
                  >
                    <FolderIcon
                      sx={{
                        width: 50,
                        height: 50,
                        color: "#A1C9F7",
                      }}
                    />

                    <Typography sx={{ fontSize: "1.25rem" }}>
                      {cellValues.row.name}
                    </Typography>
                  </Link>
                </div>
                <Menu
                  open={contextMenu !== null}
                  onClose={handleClose}
                  anchorReference="anchorPosition"
                  anchorPosition={
                    contextMenu !== null
                      ? {
                          top: contextMenu.mouseY,
                          left: contextMenu.mouseX,
                        }
                      : undefined
                  }
                >
                  <MenuItem onClick={handleClose}>Copy</MenuItem>
                  <MenuItem onClick={handleClose}>Print</MenuItem>
                  <MenuItem onClick={handleClose}>Highlight</MenuItem>
                  <MenuItem onClick={handleClose}>Email</MenuItem>
                </Menu>
              </>
            ) : (
              // <Button
              //   onClick={() => download(cellValues.row.path)}
              //   fullWidth
              //   disableRipple
              //   sx={{
              //     textDecoration: "none",
              //     textTransform: "none",
              //     display: "flex",
              //     flexDirection: "row",
              //     justifyContent: "flex-start",
              //     gap: 2,
              //     alignItems: "center",
              //     fontSize: "1.5rem",
              //     color: "rgb(128, 128, 128)",
              //     "&:hover": { backgroundColor: "transparent" },
              //   }}
              // >
              //   <FileOpenIcon color="primary" sx={{ width: 50, height: 50 }} />

              //   <Typography align="right" sx={{ fontSize: "1.25rem" }}>
              //     {cellValues.row.name}
              //   </Typography>
              // </Button>
              <Atag
                href={cellValues.row.url}
                rel="noreferrer"
                target="_blank"
                // onClick={() => download(cellValues.row.path)}
                sx={{
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
                }}
              >
                <FileOpenIcon
                  sx={{
                    width: 50,
                    height: 50,
                    color: "#A1C9F7",
                  }}
                />

                <Typography align="right" sx={{ fontSize: "1.25rem" }}>
                  {cellValues.row.name}
                </Typography>
              </Atag>
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
      flex: 0.2,
      editable: false,
      // sortable: false,
      // width: 160,
      // valueGetter: (params) =>
      //   `${params.row.firstName || ""} ${params.row.lastName || ""}`,
    },
  ];

  const handleContextMenu = (event) => {
    event.preventDefault();
    setContextMenu(
      contextMenu === null
        ? {
            mouseX: event.clientX + 2,
            mouseY: event.clientY - 6,
          }
        : // repeated contextmenu when it is already open closes it with Chrome 84 on Ubuntu
          // Other native context menus might behave different.
          // With this behavior we prevent contextmenu from the backdrop to re-locale existing context menus.
          null
    );
  };

  const handleClose = () => {
    setContextMenu(null);
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
      rows = data.files.map((file) => ({
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
        versions: file.versions,
        modified: file.last_modified,
        item: "file",
      }));
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
        rowHeight={60}
        loading={loading}
        onRowSelectionModelChange={(newRowSelectionModel) => {
          setRowSelectionModel(newRowSelectionModel);
        }}
        rowSelectionModel={rowSelectionModel}
        // sx={{
        //   ".MuiDataGrid-cellCheckbox": {
        //     visibility: "hidden",
        //   },
        //   "&:hover .MuiDataGrid-cellCheckbox": {
        //     visibility: "visible",
        //   },
        //   ".datagrid-row-hover .MuiDataGrid-cellCheckbox": {
        //     visibility: "visible",
        //   },
        // }}
      />
    </Box>
  );
});
