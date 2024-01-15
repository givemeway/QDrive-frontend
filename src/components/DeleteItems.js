import React, { useEffect, useState, useContext } from "react";
import { Button } from "@mui/material";
import DeleteIcon from "@mui/icons-material/DeleteRounded";
import { csrftokenURL } from "../config";
import {
  ItemSelectionContext,
  UploadFolderContenxt,
  SnackBarContext,
} from "./UseContext";

import { useParams } from "react-router-dom";
import useFetchItems from "./hooks/FetchCurrentDirectoryItems";
import useFetchCSRFToken from "./hooks/FetchCSRFToken";
import useDeleteItems from "./hooks/DeleteItemsHook";
import { useRecoilState, useSetRecoilState, useRecoilValue } from "recoil";
import {
  dataAtom,
  itemsDeletionAtom,
  itemsSelectedAtom,
} from "../Recoil/Store/atoms";

const DeleteItems = () => {
  const CSRFToken = useFetchCSRFToken(csrftokenURL);
  // const { fileIds, directories } = useContext(ItemSelectionContext);
  const { fileIds, directories } = useRecoilValue(itemsSelectedAtom);
  const [isDeleting, setIsDeleting] = useState(null);
  const [isDeleted, setIsDeleted] = useState(null);
  // const { setData } = useContext(UploadFolderContenxt);
  const setData = useSetRecoilState(dataAtom);
  // const { setItemDeletion } = useContext(SnackBarContext);
  const setItemDeletion = useSetRecoilState(itemsDeletionAtom);
  const params = useParams();
  const subpath = params["*"];

  const [items, , getItems, itemsLoaded] = useFetchItems(subpath, CSRFToken);
  const [initDelete, , deleted, failed, itemsDeleted] = useDeleteItems(
    fileIds,
    directories,
    CSRFToken
  );
  console.log("delete item rendered");

  const handleDelete = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setItemDeletion((prev) => ({
      ...prev,
      isDeleting: true,
      isOpen: true,
      total: fileIds.length + directories.length,
    }));
    setIsDeleting(true);
    setIsDeleted(false);
  };

  useEffect(() => {
    if (itemsLoaded && isDeleted) {
      setData(items);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [itemsLoaded]);

  useEffect(() => {
    if (deleted) {
      setItemDeletion((prev) => ({
        ...prev,
        isDeleting: false,
        itemsFailed: failed,
        itemsDeleted: itemsDeleted,
      }));
      setIsDeleted(true);
      setIsDeleting(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [deleted, failed, itemsDeleted]);

  useEffect(() => {
    if (isDeleted) {
      getItems();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isDeleted]);

  useEffect(() => {
    if (isDeleting) {
      initDelete();
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isDeleting]);

  return (
    <>
      <Button
        onClick={handleDelete}
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
