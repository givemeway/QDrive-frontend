import React, { useEffect } from "react";
import { Button } from "@mui/material";
import { DOWNLOAD } from "../config";
import CloudDownloadIcon from "@mui/icons-material/CloudDownloadRounded";

import { ItemSelectionContext } from "./UseContext";

import useDownload from "./hooks/DownloadItemsHook";
import { useRecoilValue } from "recoil";
import { itemsSelectedAtom } from "../Recoil/Store/atoms";
import { useDispatch, useSelector } from "react-redux";
import { setOperation } from "../features/operation/operationSlice";

const Download = () => {
  const { fileIds, directories } = useRecoilValue(itemsSelectedAtom);
  const dispatch = useDispatch();
  const operation = useSelector((state) => state.operation);

  console.log("download items rendered");

  useEffect(() => {
    dispatch(
      setOperation({
        ...operation,
        type: DOWNLOAD,
        status: "uninitialized",
      })
    );
  }, []);

  const handleClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    dispatch(
      setOperation({
        ...operation,
        type: DOWNLOAD,
        status: "initialized",
        data: { files: fileIds, directories },
      })
    );
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
        <CloudDownloadIcon
          color="primary"
          sx={{ cursor: "pointer", fontSize: 25 }}
        />
      </Button>
    </>
  );
};

export default React.memo(Download);
