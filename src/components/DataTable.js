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
import Checkbox from "@mui/material/Checkbox";
import { Check, CheckBox } from "@mui/icons-material";
import { useEffect } from "react";
import { Button } from "@mui/material";
import { Link, useLocation } from "react-router-dom";

const columns = [
  { id: "name", label: "Name", minWidth: 400 },
  {
    id: "Size",
    label: "Size",
    minWidth: 50,
    align: "left",
  },
  {
    id: "versions",
    label: "Versions",
    minWidth: 50,
    align: "left",
  },
  {
    id: "modified",
    label: "Modified",
    minWidth: 170,
    align: "left",
  },
];

function createData(name, code, population, size) {
  const density = population / size;
  return { name, code, population, size, density };
}

let rows = [];

export default function StickyHeadTable({ data }) {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  useEffect(() => {
    rows = [];
    rows = data.files.map((file) => ({
      id: file.id,
      label: file.filename,
      size: file.size,
      path: file.directory,
      versions: file.versions,
      modified: file.last_modified,
      item: "file",
    }));
    rows = [
      ...rows,
      ...data.folders.map((folder) => ({
        id: folder.id,
        label: folder.folder,
        size: "--",
        path: folder.path,
        versions: "--",
        modified: "--",
        item: "folder",
      })),
    ];
    console.log(rows);
  }, [data]);
  return (
    <Paper sx={{ width: "100%", overflow: "hidden" }}>
      <TableContainer sx={{ maxHeight: 500 }}>
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell
                  key={column.id}
                  align={column.align}
                  style={{ width: column.minWidth }}
                >
                  {column.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {rows
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((row) => {
                return (
                  <TableRow hover tabIndex={-1} key={row.id}>
                    <TableCell style={{ width: 400 }}>
                      {row.item === "folder" ? (
                        <Link to={"/dashboard" + row.path}>
                          <Button>
                            <FolderOpenIcon color="primary" fontSize="large" />
                            {row.label}
                          </Button>
                        </Link>
                      ) : (
                        <Button
                          startIcon={
                            <FileOpenIcon color="primary" fontSize="large" />
                          }
                        >
                          {row.label}
                        </Button>
                      )}
                    </TableCell>
                    <TableCell style={{ width: 50 }}>{row.size}</TableCell>
                    <TableCell style={{ width: 50 }}>{row.versions}</TableCell>
                    <TableCell style={{ width: 170 }}>{row.modified}</TableCell>
                  </TableRow>
                );
              })}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[10, 25, 100]}
        component="div"
        count={rows.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Paper>
  );
}
