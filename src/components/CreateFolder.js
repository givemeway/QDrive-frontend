import { useState } from "react";
import CreateFolderModal from "./Modal/CreateFolderModal";
import CreateNewFolderIcon from "@mui/icons-material/CreateNewFolder";
import "./Buttons/BlueButton.css";

export default function CreateFolder() {
  const [open, setOpen] = useState(false);
  const handleClick = () => {
    setOpen(true);
  };

  return (
    <>
      <button
        onClick={handleClick}
        className="deleteButton fill-blue"
        style={{ width: 130, height: 80, padding: 12 }}
      >
        <div className="flex flex-col w-full h-full">
          <CreateNewFolderIcon color="black" />
          <span className="w-full text-left">Create Folder</span>
        </div>
      </button>
      {open && <CreateFolderModal open={open} setOpen={setOpen} />}
    </>
  );
}
