import DriveFileRenameOutlineIcon from "@mui/icons-material/DriveFileRenameOutline";
import { Button } from "@mui/material";
import { useContext } from "react";
import { EditContext } from "./Context";
import useInitRename from "./hooks/InitRenameItemHook";
export default function RenameItem() {
  const { setEdit } = useContext(EditContext);
  const [initRename] = useInitRename(setEdit);

  const handleClick = () => {
    initRename();
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
        <DriveFileRenameOutlineIcon sx={{ cursor: "pointer", fontSize: 25 }} />
      </Button>
    </>
  );
}
