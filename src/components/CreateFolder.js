import { useEffect, useState } from "react";
import CreateFolderModal from "./Modal/CreateFolderModal";
import CreateNewFolderIcon from "@mui/icons-material/CreateNewFolder";
import { Button, IconButton } from "@mui/material";

export default function CreateFolder() {
  const [open, setOpen] = useState(false);
  const handleClick = () => {
    setOpen(true);
  };

  return (
    <>
      <IconButton
        onClick={handleClick}
        disableRipple
        sx={{ cursor: "pointer", fontSize: 25 }}
      >
        <CreateNewFolderIcon color="primary" />
      </IconButton>
      {open && <CreateFolderModal open={open} setOpen={setOpen} />}
    </>
  );
}
