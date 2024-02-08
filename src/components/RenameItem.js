import DriveFileRenameOutlineIcon from "@mui/icons-material/DriveFileRenameOutline";
import { Button } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { setEdit } from "../features/rename/renameSlice";
export default function RenameItem() {
  const dispatch = useDispatch();
  const renameState = useSelector((state) => state.rename);

  const handleClick = () => {
    // initRename();
    dispatch(setEdit({ ...renameState, mode: "edit", editStart: true }));
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
