import React, { useContext } from "react";
import { Snackbar, Box, Button, Typography, IconButton } from "@mui/material";
import CircularProgress from "@mui/material/CircularProgress";
import CloseIcon from "@mui/icons-material/Close";
import { SnackBarContext } from "./UseContext";
import { useRecoilState, useSetRecoilState } from "recoil";
import { itemsDeletionAtom } from "../Recoil/Store/atoms";

const DeleteSnackBar = () => {
  const [itemDeletion, setItemDeletion] = useRecoilState(itemsDeletionAtom);
  const { isOpen, isDeleting, itemsDeleted, total, itemsFailed } = itemDeletion;

  const handleClose = (e, reason) => {
    e.preventDefault();
    e.stopPropagation();
    setItemDeletion((prev) => ({
      ...prev,
      isOpen: false,
      isDeleting: false,
      isDeleted: false,
      itemsDeleted: 0,
      total: 0,
      itemsFailed: 0,
    }));
  };

  const action = (
    <React.Fragment>
      {!isDeleting && (
        <>
          <Button color="secondary" size="small" onClick={handleClose}>
            UNDO
          </Button>
          <IconButton
            size="small"
            aria-label="close"
            color="inherit"
            onClick={handleClose}
          >
            <CloseIcon fontSize="small" />
          </IconButton>{" "}
        </>
      )}
    </React.Fragment>
  );
  return (
    <Snackbar
      open={isOpen}
      anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      onClose={handleClose}
      action={action}
      message={
        <Box
          display="flex"
          flexDirection="row"
          alignItems="center"
          justifyContent="flex-start"
          gap={2}
        >
          {isDeleting && <CircularProgress />}
          {isDeleting && <Typography>Deleting {total} items</Typography>}
          {!isDeleting && (
            <>
              <Typography>Deleted {itemsDeleted} items</Typography>
              {itemsFailed > 0 && (
                <Typography>Deletion Failed for {itemsFailed} items</Typography>
              )}
            </>
          )}
        </Box>
      }
    ></Snackbar>
  );
};

export default React.memo(DeleteSnackBar);
