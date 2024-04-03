import DriveFileMoveIcon from "@mui/icons-material/DriveFileMove";
import { useState } from "react";
import { MOVE } from "../config";

import { Button } from "@mui/material";
import Modal from "./Modal";

export default function MoveItems() {
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
        <DriveFileMoveIcon sx={{ cursor: "pointer", fontSize: 25 }} />
      </Button>
      {open && <Modal mode={MOVE} open={open} onClose={onClose} />}
    </>
  );
}
