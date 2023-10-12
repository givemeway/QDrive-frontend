/*global axios */
import DriveFileRenameOutlineIcon from "@mui/icons-material/DriveFileRenameOutline";
import { Button } from "@mui/material";
import { useContext, useEffect, useRef } from "react";
import { ItemSelectionContext } from "./Context";
import { csrftokenURL, renameURL } from "../config";
import { fetchCSRFToken } from "../util";
import { EditContext } from "./Context";
export default function RenameItem() {
  const { fileIds, directories } = useContext(ItemSelectionContext);
  const csrfToken = useRef("");

  const { edit, setEdit } = useContext(EditContext);
  const handleClick = () => {
    setEdit((prev) => ({ ...prev, editStart: true }));
  };

  useEffect(() => {
    if (edit.editing && edit.val && csrfToken.current.length > 0) {
      const headers = {
        "X-CSRF-Token": csrfToken.current,
        "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
      };
      let body = {};
      if (fileIds.length > 0) {
        body.type = "fi";
        body.uuid = fileIds[0].id;
        body.to = edit.val;
      } else {
        body.type = "fo";
        body.uuid = directories[0].uuid;
        let path_array = directories[0].path.split("/").slice(0, -1);
        path_array.push(edit.val);
        body.to = path_array.join("/");
      }

      (async () => {
        try {
          const res = await axios.post(renameURL, body, { headers: headers });
          console.log(res.data);
          setEdit((prev) => ({
            ...prev,
            edited: true,
            editStart: undefined,
            editStop: undefined,
            editing: false,
          }));
        } catch (err) {
          console.error(err);
        }
      })();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [edit]);

  useEffect(() => {
    setEdit(false);
    fetchCSRFToken(csrftokenURL)
      .then((token) => (csrfToken.current = token))
      .catch((err) => console.error(err));
  }, []);

  return (
    <>
      <Button
        variant="outlined"
        disableRipple
        sx={{
          border: "none",
          boxSizing: "border-box",
          "&:hover": {
            backgroundColor: "#EFF3FA",
            border: "none",
          },
        }}
        onClick={handleClick}
      >
        <DriveFileRenameOutlineIcon sx={{ cursor: "pointer", fontSize: 25 }} />
      </Button>
    </>
  );
}
