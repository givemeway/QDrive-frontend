import { useState } from "react";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import { Button } from "@mui/material";
import { ModalContext } from "./UseContext.js";
import { COPY } from "../config.js";
import Modal from "./Modal.js";

export default function CopyItems() {
  const [open, setOpen] = useState(false);
  const handleClick = () => {
    setOpen(true);
  };

  const onClose = () => {
    setOpen(false);
  };
  return (
    <>
      <Button
        variant="outlined"
        disableRipple
        onClick={handleClick}
        sx={{
          border: "none",
          boxSizing: "border-box",
          "&:hover": {
            backgroundColor: "#EFF3FA",
            border: "none",
          },
        }}
      >
        <ContentCopyIcon sx={{ cursor: "pointer", fontSize: 25 }} />
      </Button>
      {open && <Modal mode={COPY} open={open} onClose={onClose} />}
    </>
  );
}
