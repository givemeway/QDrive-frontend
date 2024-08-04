import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { setNotify } from "../../features/notification/notifySlice";

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const MessageSnackBar = ({ severity, msg, anchor }) => {
  const [open, setOpen] = useState(true);
  const dispatch = useDispatch();
  const handleClose = () => {
    setOpen(false);
    dispatch(setNotify({ show: false, msg: "", severity: "" }));
  };
  return (
    <Snackbar
      open={open}
      autoHideDuration={6000}
      onClose={handleClose}
      anchorOrigin={{
        vertical: !anchor ? "bottom" : anchor?.vertical,
        horizontal: !anchor ? "center" : anchor?.horizontal,
      }}
    >
      <Alert onClose={handleClose} severity={severity} sx={{ width: "100%" }}>
        {msg}
      </Alert>
    </Snackbar>
  );
};

export default MessageSnackBar;
