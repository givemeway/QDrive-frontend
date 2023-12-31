import DriveFileMoveIcon from "@mui/icons-material/DriveFileMove";
import { useState } from "react";
import { ModalContext } from "./UseContext";

import { Button } from "@mui/material";
import Modal from "./Modal";

const MOVE = "move";

export default function MoveItems() {
  const [open, setOpen] = useState(false);

  const handleClick = () => {
    setOpen(true);
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
      {open && (
        <ModalContext.Provider value={{ open, setOpen }}>
          <Modal mode={MOVE} />
        </ModalContext.Provider>
      )}
    </>
  );
}
