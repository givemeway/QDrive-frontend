import DriveFileMoveIcon from "@mui/icons-material/DriveFileMove";
import { Button } from "@mui/material";
export default function MoveItems() {
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
      >
        <DriveFileMoveIcon sx={{ cursor: "pointer", fontSize: 25 }} />
      </Button>
    </>
  );
}
