import DriveFileRenameOutlineIcon from "@mui/icons-material/DriveFileRenameOutline";
import { Button } from "@mui/material";
import { useContext, useEffect, useRef, useState } from "react";
import { ItemSelectionContext } from "./Context";
import { csrftokenURL, renameURL } from "../config";
import { fetchCSRFToken } from "../util";
export default function RenameItem({ val }) {
  const { fileIds, directories } = useContext(ItemSelectionContext);
  const csrfToken = useRef("");
  const [rename, setRename] = useState({
    init: false,
    renaming: false,
    renamed: false,
    success: false,
    failed: [],
  });

  const handleClick = () => {
    setRename((prev) => ({ ...prev, init: true, renaming: true }));
  };

  useEffect(() => {
    if (rename.init && csrfToken.current.length > 0) {
      setRename((prev) => ({
        ...prev,
        init: true,
        renamed: false,
        renaming: true,
      }));
      const headers = {
        "X-CSRF-Token": csrfToken.current,
        "Content-Type": "application/json",
      };
      let body = {};
      if (fileIds.length > 0) {
        body.type = "fi";
        body.uuid = fileIds[0].id;
        body.to = val;
      } else {
        body.type = "fo";
        body.uuid = directories[0].uuid;
        let path_array = directories[0].path.split("/").slice(0, -1);
        path_array.push(val);
        body.to = path_array.join("/");
      }

      const options = {
        method: "POST",
        credentials: "include",
        headers: headers,
        body: body,
      };
      fetch(renameURL, options)
        .then((res) => res.json())
        .then((data) => {
          console.log(data);
          setRename((prev) => ({
            ...prev,
            init: false,
            renamed: true,
            renaming: false,
          }));
        });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rename.init]);

  useEffect(() => {
    fetchCSRFToken(csrftokenURL)
      .then((csrfToken) => (csrfToken.current = csrfToken))
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
