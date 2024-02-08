import React, { useEffect, useState, useContext } from "react";
import { Button } from "@mui/material";
import DeleteIcon from "@mui/icons-material/DeleteRounded";

import { useRecoilValue } from "recoil";
import { itemsSelectedAtom } from "../Recoil/Store/atoms";
import { useDispatch, useSelector } from "react-redux";
import { DeleteModal } from "./Modal/DeleteModal";
import { setOperation } from "../features/operation/operationSlice";
import { useGetCSRFTokenQuery } from "../features/api/apiSlice";
import { setCSRFToken } from "../features/csrftoken/csrfTokenSlice";
import { DELETE } from "../config";

const DeleteItems = () => {
  const { fileIds, directories } = useRecoilValue(itemsSelectedAtom);

  const items = useGetCSRFTokenQuery();

  const { CSRFToken } = !items?.data ? { CSRFToken: "" } : items?.data;

  console.log("delete item rendered");

  const operation = useSelector((state) => state.operation);
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);

  const handleClick = () => {
    console.log("DELETE triggered");
    setOpen(true);
    console.log("initialized");
    dispatch(
      setOperation({
        ...operation,
        type: DELETE,
        status: "uninitialized",
      })
    );
  };

  const onSubmit = () => {
    console.log("triggered submit");
    const body = { fileIds, directories };
    dispatch(
      setOperation({
        ...operation,
        type: DELETE,
        status: "initialized",
        data: body,
      })
    );
    setOpen(false);
  };

  const onClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    if (CSRFToken && items.isSuccess) {
      dispatch(setCSRFToken(CSRFToken));
    }
  }, [CSRFToken, items.isSuccess]);

  return (
    <>
      {open && (
        <DeleteModal
          title={"Delete Items"}
          content={"Are you sure you want to delete Items?"}
          open={open}
          onClose={onClose}
          onSubmit={onSubmit}
        />
      )}

      <Button
        onClick={handleClick}
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
        <DeleteIcon color="primary" sx={{ cursor: "pointer", fontSize: 25 }} />
      </Button>
    </>
  );
};

export default React.memo(DeleteItems);
