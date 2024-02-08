import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setEdit } from "../features/rename/renameSlice";
import { setOperation } from "../features/operation/operationSlice";
import { useRecoilValue } from "recoil";
import { itemsSelectedAtom } from "../Recoil/Store/atoms";
import { RENAME, folder } from "../config";
import { svgIconStyle, get_file_icon } from "./fileFormats/FileFormat";
import { Box, TextField } from "@mui/material";
import FolderIcon from "./icons/FolderIcon";

const flexRowStyle = {
  display: "flex",
  flexDirection: "row",
  justifyContent: "flex-start",
  alignItems: "center",
  flexGrow: 2,
  gap: 0,
  padding: 0,
  margin: 0,
};

export default function Edit({ row, table }) {
  const [value, setValue] = useState(row.name);
  const selected = useRecoilValue(itemsSelectedAtom);
  const { fileIds, directories } = selected;
  const dispatch = useDispatch();
  const operation = useSelector((state) => state.operation);

  const editIdle = {
    mode: "idle",
    editStart: undefined,
    editStop: undefined,
    edited: undefined,
    editing: undefined,
    val: "",
  };

  const renameInit = {
    ...operation,
    type: RENAME,
    status: "initialized",
    data: {},
  };

  const renameUninit = { ...operation, type: RENAME, status: "uninitialized" };

  const prepareBody = () => {
    let body = {};
    if (fileIds.length === 1) {
      body.type = "fi";
      body.uuid = fileIds[0].origin;
      body.to = value;
      body.device = fileIds[0].device;
      body.dir = fileIds[0].dir;
      body.filename = fileIds[0].file;
    } else if (directories.length === 1) {
      body.type = "fo";
      body.uuid = directories[0].uuid;
      body.device = directories[0].device;
      body.folder = directories[0].folder;
      body.oldPath = directories[0].path;
      let path_array = directories[0].path.split("/").slice(0, -1);
      path_array.push(value);
      body.to = path_array.join("/");
    }
    return body;
  };

  const onBlur = () => {
    if (row.name !== value && value.length !== 0) {
      const body = prepareBody();

      dispatch(setOperation({ ...renameInit, data: body }));
    }
    dispatch(setEdit(editIdle));
    table.setEditingCell(null);
  };
  const onChange = (event) => {
    setValue(event.target.value);
  };

  const onKeyDown = (event) => {
    if (event.key === "Enter") {
      if (row.name !== value && value.length !== 0) {
        const body = prepareBody();

        dispatch(setOperation({ ...renameInit, data: body }));
      }
      dispatch(setEdit(editIdle));
      table.setEditingCell(null);
    }
  };

  const onFocus = () => {
    dispatch(setOperation(renameUninit));
  };

  return (
    <>
      {row.item === folder ? (
        <Box sx={flexRowStyle}>
          <FolderIcon style={svgIconStyle} />
          <TextField
            fullWidth
            size="small"
            onBlur={onBlur}
            onChange={onChange}
            onKeyDown={onKeyDown}
            autoFocus={true}
            value={value}
            onFocus={onFocus}
          ></TextField>
        </Box>
      ) : (
        <Box sx={flexRowStyle}>
          {get_file_icon(row.name, row.url)}
          <TextField
            fullWidth
            size="small"
            onBlur={onBlur}
            onChange={onChange}
            onKeyDown={onKeyDown}
            autoFocus={true}
            value={value}
          ></TextField>
        </Box>
      )}
    </>
  );
}
