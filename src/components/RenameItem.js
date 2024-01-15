import DriveFileRenameOutlineIcon from "@mui/icons-material/DriveFileRenameOutline";
import { Button } from "@mui/material";
import { useContext } from "react";
import { EditContext } from "./UseContext";
import useInitRename from "./hooks/InitRenameItemHook";
import { useRecoilState, useSetRecoilState } from "recoil";
import { editAtom } from "../Recoil/Store/atoms";
export default function RenameItem() {
  // const { setEdit } = useContext(EditContext);
  const setEdit = useSetRecoilState(editAtom);
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
