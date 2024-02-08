import { Button } from "@mui/material";

import ShareIcon from "@mui/icons-material/ShareRounded";

import ShareModal from "./Modal/ShareModal";

import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setOperation } from "../features/operation/operationSlice";

export default function Share() {
  const [open, setOpen] = useState(false);
  const operation = useSelector((state) => state.operation);
  const dispatch = useDispatch();

  const onClose = () => {
    setOpen(false);
    dispatch(
      setOperation({ ...operation, type: "", status: "idle", open: false })
    );
  };

  const showShareWindow = () => {
    setOpen(true);
  };

  return (
    <>
      <Button
        onClick={showShareWindow}
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
        <ShareIcon color="primary" sx={{ cursor: "pointer", fontSize: 25 }} />
      </Button>

      {open && <ShareModal open={open} onClose={onClose} />}
    </>
  );
}
