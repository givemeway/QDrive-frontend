import * as React from "react";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import FolderOpenIcon from "@mui/icons-material/FolderOpenRounded";
import FileOpenIcon from "@mui/icons-material/FileOpenRounded";
import { DataGrid, gridRowsLoadingSelector } from "@mui/x-data-grid";
import { useEffect } from "react";
import { Button, Typography, Box } from "@mui/material";
import { Link, useLocation } from "react-router-dom";
import { download } from "../download.js";
// const columns = [
//   { id: "name", label: "Name", minWidth: 400 },
//   {
//     id: "Size",
//     label: "Size",
//     minWidth: 50,
//     align: "left",
//   },
//   {
//     id: "versions",
//     label: "Versions",
//     minWidth: 50,
//     align: "left",
//   },
//   {
//     id: "modified",
//     label: "Modified",
//     minWidth: 170,
//     align: "left",
//   },
// ];

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
            <Link
              to={"/dashboard/home" + cellValues.row.path}
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
              <FolderOpenIcon color="primary" sx={{ width: 50, height: 50 }} />

              <Typography sx={{ fontSize: "1.25rem" }}>
                {cellValues.row.name}
              </Typography>
            </Link>
          ) : (
            <Button
              onClick={() => download(cellValues.row.path)}
              fullWidth
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
              }}
            >
              <FileOpenIcon color="primary" sx={{ width: 50, height: 50 }} />

              <Typography align="right" sx={{ fontSize: "1.25rem" }}>
                {cellValues.row.name}
              </Typography>
            </Button>
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

const downloadUrl = `/app/downloadFiles`;

export default function StickyHeadTable({ data }) {
  let rows = [];
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [newRows, setNewRows] = React.useState([]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
    console.log("new page");
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  useEffect(() => {
    rows = data.files.map((file) => ({
      id: file.id,
      name: file.filename,
      size: file.size,
      path: `${downloadUrl}?device=${file.device}&dir=${file.directory}&file=${file.filename}`,
      versions: file.versions,
      modified: file.last_modified,
      item: "file",
    }));
    rows = [
      ...rows,
      ...data.folders.map((folder) => ({
        id: folder.id,
        name: folder.folder,
        size: "--",
        path: folder.path,
        versions: "--",
        modified: "--",
        item: "folder",
      })),
    ];

    setNewRows(rows);
    setPage(0);
    setRowsPerPage(10);
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
        rowHeight={75}
      />
    </Box>
  );
}
