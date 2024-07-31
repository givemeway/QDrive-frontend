import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import React, { useState } from "react";

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const MessageSnackBar = ({ msg, severity, setMessage, anchor }) => {
  const [open, setOpen] = useState(true);
  const handleClose = () => {
    setOpen(false);
    setMessage(() => ({ show: false, msg: "", severity: null }));
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
