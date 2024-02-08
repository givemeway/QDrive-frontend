import { ListItem, ListItemText, ListItemIcon } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import { Box } from "@mui/material";
import { FixedSizeList } from "react-window";
import { useRecoilValue } from "recoil";
import { itemsSelectedAtom } from "../../Recoil/Store/atoms";
import { Modal } from "./Modal";
import { useDispatch, useSelector } from "react-redux";
import { setOperation } from "../../features/operation/operationSlice";
import { SHARE } from "../../config";
import { CustomBlueButton } from "../Buttons/BlueButton";
import useOutSideClick from "../hooks/useOutsideClick";
import { file, folder } from "../../config";
import { useGetCSRFTokenQuery } from "../../features/api/apiSlice";
import { setCSRFToken } from "../../features/csrftoken/csrfTokenSlice";
import { get_file_icon, svgIconStyle } from "../fileFormats/FileFormat";
import FolderIcon from "../icons/FolderIcon";
import { GreyButton } from "../Buttons/GreyButton";

export default function ShareModal({ open, onClose }) {
  const { fileIds, directories } = useRecoilValue(itemsSelectedAtom);
  const [items, setItems] = useState([]);
  const dispatch = useDispatch();
  const operation = useSelector((state) => state.operation);
  const type = useRef("");
  const ref = useRef(null);
  const body = useRef({ files: [], directories: [] });
  const { isLoading, isSuccess, isError, data } = useGetCSRFTokenQuery();
  const { CSRFToken } = data ? data : { CSRFTOken: "" };

  const handleClose = () => {
    dispatch(
      setOperation({
        ...operation,
        type: "",
        status: "idle",
        data: [],
        open: false,
      })
    );
    onClose("");
  };

  useOutSideClick(ref, handleClose);

  const createShare = () => {
    if (items.length === 1) {
      if (items[0]?.type === file) {
        type.current = "fi";
      } else if (items[0]?.type === folder) {
        type.current = "fo";
      }
    } else if (items.length > 1) {
      type.current = "t";
    }
    body.current.files = fileIds;
    body.current.directories = directories;
    dispatch(
      setOperation({
        ...operation,
        type: SHARE,
        status: "initialized",
        open: false,
        data: { body: body.current, type: type.current },
      })
    );
  };

  useEffect(() => {
    if (operation.status === "initialized") {
      onClose(SHARE);
    }
  }, [operation.status]);

  useEffect(() => {
    if (isSuccess && CSRFToken.length > 0) {
      dispatch(setCSRFToken(CSRFToken));
    }
  }, [isSuccess]);

  function RenderRows(props) {
    const { index, style } = props;
    return (
      <ListItem
        style={style}
        key={items[index]?.id}
        component="div"
        disablePadding
      >
        <ListItemIcon>
          {items[index]?.type === file && get_file_icon(items[index]?.name)}
          {items[index]?.type === folder && <FolderIcon style={svgIconStyle} />}
        </ListItemIcon>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-start",
            gap: 0,
            alignItems: "flex-start",
          }}
        >
          <ListItemText primary={`${items[index]?.name}`} />
        </Box>
      </ListItem>
    );
  }

  useEffect(() => {
    dispatch(
      setOperation({ ...operation, type: SHARE, status: "uninitialized" })
    );
    setItems(() => [
      ...fileIds.map((fi) => ({
        id: fi.id,
        name: fi.file,
        type: file,
      })),
      ...directories.map((fo) => ({
        id: fo.uuid,
        name: fo.folder,
        type: folder,
      })),
    ]);
  }, []);

  return (
    <>
      {open && (
        <Modal>
          <div
            ref={ref}
            className="flex flex-col bg-white w-[500px] h-[250px] border-2 border-solid border-custom-blue"
          >
            <h3 className="text-xl text-left mx-2 my-2 ">Share</h3>
            <hr></hr>
            <FixedSizeList
              itemCount={items.length}
              itemSize={50}
              height={200}
              className="m-2"
            >
              {RenderRows}
            </FixedSizeList>
            <hr></hr>
            <div className="flex flex-row justify-end items-center my-2 mx-2 gap-2">
              <GreyButton
                text={"Cancel"}
                onClick={handleClose}
                style={{ height: "40px", width: "100px" }}
              />

              <CustomBlueButton
                text={"Create Link"}
                onClick={createShare}
                style={{ height: "40px", width: "100px" }}
              />
            </div>

            {isError && <div>Something Went wrong</div>}
          </div>
        </Modal>
      )}
    </>
  );
}
