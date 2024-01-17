import { Box, Button, CircularProgress, Typography } from "@mui/material";
import { useRecoilValue } from "recoil";
import { statusNotificationAtom } from "../Recoil/Store/atoms";

export function StatusNotification() {
  const open = useRecoilValue(statusNotificationAtom);
  return (
    <>
      {open.open && (
        <Box
          sx={{
            width: 500,
            height: 55,
            background: "black",
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            zIndex: 2,
            position: "absolute",
            bottom: 5,
            left: "40%",
            right: "40%",
          }}
        >
          <CircularProgress sx={{ marginLeft: 2 }} />
          <Typography sx={{ color: "blue" }}>{open.operation_type}</Typography>
          <Button>Cancel</Button>
        </Box>
      )}
    </>
  );
}
