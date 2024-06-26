import { DataGrid } from "@mui/x-data-grid";
import FolderIcon from "./icons/FolderIcon";

import React, { useEffect } from "react";
import { Typography, Box } from "@mui/material";
import { Link, useParams } from "react-router-dom";
import { Link as Atag } from "@mui/material";
import { useGridApiRef } from "@mui/x-data-grid";
import Activity from "./FileActivity.js";
import { formatBytes } from "../util.js";
import { downloadURL } from "../config.js";
import {
  itemsSelectedAtom,
  editAtom,
  dataAtom,
} from "../Recoil/Store/atoms.js";

import {
  ItemSelectionContext,
  ModalContext,
  RightClickContext,
} from "./UseContext.js";
import Modal from "./Modal";
import MUltipleSelectionOverlayMenu from "./context/MultipleSelectionContext";
import FolderSelectionOverlayMenu from "./context/FolderContext";
import FileVersionSelectionOverlayMenu from "./context/FileVersionContext";
import Share from "./Share";
import { get_file_icon, svgIconStyle } from "./fileFormats/FileFormat.js";
import useRename from "./hooks/RenameItemHook";

import { useRecoilState, useRecoilValue } from "recoil";

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
  margin: 2,
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
    )};${file.filename};${file.origin};${file.directory};${file.device}`,
    name: file.filename,
    icon: "file",
    size: formatBytes(file.size),
    dir: `${file.device}/${file.directory}`,
    path: `${downloadURL}?device=${encodeURIComponent(
      file.device
    )}&dir=${encodeURIComponent(file.directory)}&file=${encodeURIComponent(
      file.filename
    )}&uuid=${encodeURIComponent(file.uuid)}`,
    url: `http://localhost:3001${downloadURL}?file=${encodeURIComponent(
      file.filename
    )}&uuid=${encodeURIComponent(file.uuid)}&db=files`,
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
        return param.row.item === "folder" ? (
          <FolderIcon style={svgIconStyle} />
        ) : (
          get_file_icon(param.row.name, param.row.url)
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
  const [rowModesModel, setRowModesModel] = React.useState([]);
  const rowClick = React.useRef(false);
  const [coords, setCoords] = React.useState({ x: 0, y: 0 });
  const [openContext, setOpenContext] = React.useState(null);
  const [rowSelectionModel, setRowSelectionModel] = React.useState([]);
  const filteredFiles = React.useRef(new Map([]));
  const versionedFiles = React.useRef({});
  const tempFiles = React.useRef({});
  const originFileId = React.useRef("");
  const [deleteOldId, setDeleteOldId] = React.useState({
    delete: undefined,
    id: "",
    old_id: "",
    row: {},
  });
  const ref = React.useRef();
  const [selected, setItemsSelection] = useRecoilState(itemsSelectedAtom);
  const params = useParams();
  const subpath = params["*"];
  const { fileIds, directories } = selected;
  const data = useRecoilValue(dataAtom);
  const [edit, setEdit] = useRecoilState(editAtom);
  const [open, setOpen] = React.useState(false);
  const [selectionType, setSelectionType] = React.useState("");
  const [share, setShare] = React.useState(false);
  const [activity, setActivity] = React.useState(false);
  const [mode, setMode] = React.useState(null);
  const apiRef = useGridApiRef();
  const gridRef = React.useRef();
  const selectedToEdit = React.useRef();
  const [rename] = useRename(fileIds, directories, edit, setEdit);
  console.log(subpath);
  const fileContextProps = {
    setOpenContext,
    setOpen,
    setMode,
    setActivity,
    coords,
    setShare,
    ref,
    edit,
    setEdit,
  };
  const folderContextProps = {
    setOpenContext,
    setOpen,
    setMode,
    coords,
    setShare,
    ref,
    edit,
    setEdit,
  };
  const multipleSelectionContext = {
    setOpenContext,
    setOpen,
    setMode,
    coords,
    setShare,
    ref,
  };

  const initialState = {
    pagination: {
      paginationModel: {
        pageSize: 50,
      },
    },
  };

  console.log("table rendered");

  const onRowSelectionModelChange = (newRowSelectionModel) => {
    if (!rowClick.current) setRowSelectionModel(newRowSelectionModel);
    rowClick.current = false;
  };

  const contextMenu = (event) => {
    event.preventDefault();
    const type = event.currentTarget.getAttribute("data-id").split(";")[0];
    const rowId = event.currentTarget.getAttribute("data-id");
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
        selectedToEdit.current = rowId;
        return [rowId];
      } else {
        if (rowSelectionModel.includes(rowId)) {
          setSelectionType(multiple);
          setActivity(false);
          selectedToEdit.current = undefined;
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
          selectedToEdit.current = rowId;
          return [rowId];
        }
      }
    });

    setOpenContext(true);
    setCoords({ x: event.clientX + 2, y: event.clientY - 6 });
  };

  const slotProps = {
    row: {
      onContextMenu: contextMenu,
      style: { cursor: "context-menu" },
    },
    toolbar: { setNewRows, setRowModesModel },
  };

  const processRowUpdate = (newRow) => {
    if (edit.mode === "edit") {
      rename();
      setEdit((prev) => ({
        ...prev,
        val: newRow.name,
        editStop: true,
        editStart: false,
      }));
    }
    return newRow;
  };

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
          dir: item[5],
          device: item[6],
        });
      }
      if (item[0] === "folder") {
        folders.push({
          id: item[1],
          path: item[2],
          folder: item[3],
          uuid: item[4],
          device: item[5],
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
    if (selectedToEdit.current && edit.editStart) {
      const params = { id: selectedToEdit.current, field: "name" };
      apiRef.current.startCellEditMode(params);
      setEdit((prev) => ({ ...prev, editing: true }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [apiRef, edit.editStart]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/exhaustive-deps
    if (!loading && !Array.isArray(data)) {
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
          id: `folder;${folder.uuid};${folder.path};${folder.folder};${folder.uuid};${folder.device}`,
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
        initialState={initialState}
        pageSizeOptions={[5, 10, 15, 20, 50, 100]}
        checkboxSelection
        slotProps={slotProps}
        loading={loading}
        disableVirtualization={false}
        onRowClick={rowClicked}
        processRowUpdate={processRowUpdate}
        onProcessRowUpdateError={(err) => console.log(err)}
        editMode="cell"
        rowModesModel={rowModesModel}
        onRowSelectionModelChange={onRowSelectionModelChange}
        rowSelectionModel={rowSelectionModel}
        rowHeight={40}
        density={"standard"}
        sx={dataGridStyle}
        keepNonExistentRowsSelected
        // hideFooter={true}
      />
      {openContext &&
        (selectionType === fileVersion || selectionType === file) && (
          <RightClickContext.Provider value={fileContextProps}>
            <ItemSelectionContext.Provider value={selected}>
              <FileVersionSelectionOverlayMenu />
            </ItemSelectionContext.Provider>
          </RightClickContext.Provider>
        )}
      {openContext && selectionType === folder && (
        <RightClickContext.Provider value={folderContextProps}>
          <ItemSelectionContext.Provider value={selected}>
            <FolderSelectionOverlayMenu />
          </ItemSelectionContext.Provider>
        </RightClickContext.Provider>
      )}
      {openContext && selectionType === multiple && (
        <RightClickContext.Provider value={multipleSelectionContext}>
          <ItemSelectionContext.Provider value={selected}>
            <MUltipleSelectionOverlayMenu />
          </ItemSelectionContext.Provider>
        </RightClickContext.Provider>
      )}
      {open && mode !== null && (
        <ItemSelectionContext.Provider value={selected}>
          <ModalContext.Provider value={{ open, setOpen }}>
            <Modal mode={mode} />
          </ModalContext.Provider>
        </ItemSelectionContext.Provider>
      )}
      {share && (
        <ItemSelectionContext.Provider value={selected}>
          <Share shareImmediate={true} />
        </ItemSelectionContext.Provider>
      )}
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
