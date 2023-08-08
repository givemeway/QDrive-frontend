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
import { Button, Typography } from "@mui/material";
import { Link, useLocation } from "react-router-dom";
import { download } from "../download.js";
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

const downloadUrl = `/app/downloadFiles`;

export default function StickyHeadTable({ data }) {
  let rows = [];
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [newRows, setNewRows] = React.useState([]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  useEffect(() => {
    rows = data.files.map((file) => ({
      id: file.id,
      label: file.filename,
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
        label: folder.folder,
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
    <Paper sx={{ height: "100%" }}>
      <TableContainer sx={{ maxHeight: 500, minWidth: 600, width: "100%" }}>
        <Table stickyHeader aria-label="sticky table" size="small">
          <TableBody sx={{ height: "100%" }}>
            {newRows
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((row) => {
                return (
                  <TableRow
                    hover
                    tabIndex={-1}
                    key={row.id}
                    sx={{ height: 50 }}
                  >
                    <TableCell
                      align="left"
                      style={{
                        width: "100%",
                        display: "flex",
                        flexDirection: "row",
                        justifyContent: "flex-start",
                        alignItems: "center",
                      }}
                    >
                      {row.item === "folder" ? (
                        <Link
                          to={"/dashboard/home" + row.path}
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
                          <FolderOpenIcon
                            color="primary"
                            sx={{ width: 50, height: 50 }}
                          />

                          <Typography sx={{ fontSize: "1.25rem" }}>
                            {row.label}
                          </Typography>
                        </Link>
                      ) : (
                        <Button
                          onClick={() => download(row.path)}
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
                          <FileOpenIcon
                            color="primary"
                            sx={{ width: 50, height: 50 }}
                          />

                          <Typography
                            align="right"
                            sx={{ fontSize: "1.25rem" }}
                          >
                            {row.label}
                          </Typography>
                        </Button>
                      )}
                    </TableCell>
                    <TableCell align="left" style={{ width: "10%" }}>
                      {row.size}
                    </TableCell>
                    <TableCell align="left" style={{ width: "10%" }}>
                      {row.versions}
                    </TableCell>
                    <TableCell align="left" style={{ width: "20%" }}>
                      {row.modified}
                    </TableCell>
                  </TableRow>
                );
              })}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[5, 10, 25, 100]}
        component="div"
        count={newRows.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        sx={{ position: "sticky", bottom: 0, top: 0 }}
      />
    </Paper>
  );
}
