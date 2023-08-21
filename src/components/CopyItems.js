import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import { Button } from "@mui/material";
export default function CopyItems() {
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
        <ContentCopyIcon sx={{ cursor: "pointer", fontSize: 25 }} />
      </Button>
    </>
  );
}
