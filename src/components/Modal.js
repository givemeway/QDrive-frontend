/*global axios */
import * as React from "react";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import { useState } from "react";
import FolderRounded from "@mui/icons-material/FolderRounded";
import { TreeView } from "@mui/x-tree-view/TreeView";
import { Button, Modal, Typography, Divider } from "@mui/material";
import { useEffect, useContext, useRef } from "react";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import IconExpandedTreeItem from "./CustomTreeItem";
import { ModalContext } from "./UseContext";
import { useRecoilValue } from "recoil";
import { itemsSelectedAtom } from "../Recoil/Store/atoms";
import { useDispatch, useSelector } from "react-redux";
import {
  useGetCSRFTokenQuery,
  useGetFoldersMutation,
} from "../features/api/apiSlice";
import SpinnerGIF from "./icons/SpinnerGIF";
import { setCSRFToken } from "../features/csrftoken/csrfTokenSlice";
import { setOperation } from "../features/operation/operationSlice";
import { MOVE, COPY } from "../config";

const style = {
  position: "absolute",
  display: "flex",
  flexDirection: "column",
  justifyContent: "space-between",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 500,
  height: 600,
  overflow: "auto",
  bgcolor: "background.paper",
  border: "2px solid #6EA5CE",
  boxShadow: 24,
  p: 4,
};

const FolderTreeView = ({ CSRFToken, setToPath, toPath, setNodeSelected }) => {
  const [expanded, setExpanded] = useState([]);
  const [folders, setFolders] = useState([]);
  const clickedNode = useRef("1");
  const [getFoldersMutation, getFolders] = useGetFoldersMutation();
  let { status, isLoading, isError, isSuccess, data } = getFolders;
  console.log(status);
  if (!data) {
    data = {};
    data.folders = [];
  }

  useEffect(() => {
    setExpanded(["1"]);
    getFoldersMutation({ path: toPath, CSRFToken });
  }, []);

  useEffect(() => {
    if (status === "fulfilled" && data.folders.length > 0 && isSuccess) {
      setExpanded((prev) => [...prev, clickedNode.current]);

      setFolders((prevFolders) => {
        if (prevFolders.length > 0) {
          return updateNode(prevFolders, clickedNode.current, data.folders);
        } else {
          return data.folders;
        }
      });
    } else if (
      status === "fulfilled" &&
      data.folders.length === 0 &&
      isSuccess
    ) {
      setExpanded((prev) => {
        return prev.includes(clickedNode.current)
          ? prev.filter((el) => el !== clickedNode.current)
          : [...prev, clickedNode.current];
      });
    }
  }, [data.folders, isSuccess, status]);

  const handleClick = async (path, nodeId) => {
    // Fetch folders from server while expanding
    if (!expanded.includes(nodeId)) {
      clickedNode.current = nodeId;
      getFoldersMutation({ path, CSRFToken });
    } else {
      setExpanded((prev) => {
        return prev.includes(nodeId)
          ? prev.filter((el) => el !== nodeId)
          : [...prev, nodeId];
      });
    }
  };

  const handleSelect = (event, nodeId) => {
    if (nodeId === "1") {
      setToPath("/");
      setNodeSelected(true);
    } else {
      setToPath(nodeId.split(";")[1]);
      setNodeSelected(true);
    }
  };
  const handleNodeToggle = (event, nodeIds) => {
    setExpanded(nodeIds);
  };

  const updateNode = (nodes, nodeId, newChildren) => {
    return nodes.map((node) => {
      if (node.uuid + ";" + node.path === nodeId) {
        return { ...node, children: newChildren };
      } else if (node.children) {
        return {
          ...node,
          children: updateNode(node.children, nodeId, newChildren),
        };
      } else {
        return node;
      }
    });
  };

  const renderTree = (nodes) => {
    return nodes.map((node) => (
      <IconExpandedTreeItem
        nodeId={`${node.uuid};${node.path}`}
        key={node.uuid}
        label={
          <Box
            display={"flex"}
            flexDirection={"row"}
            gap={1}
            justifyContent={"flex-start"}
          >
            <FolderRounded sx={{ color: "#A1C9F7" }} /> {node.folder}
          </Box>
        }
        icon={
          expanded.includes(node.uuid + ";" + node.path) ? (
            <ExpandMoreIcon
              onClick={() =>
                handleClick(node.path, `${node.uuid};${node.path}`)
              }
            />
          ) : (
            <ChevronRightIcon
              onClick={() =>
                handleClick(node.path, `${node.uuid};${node.path}`)
              }
            />
          )
        }
      >
        {node.children && renderTree(node.children)}
      </IconExpandedTreeItem>
    ));
  };

  return (
    <TreeView
      aria-label="customized"
      defaultExpanded={["1"]}
      defaultCollapseIcon={<ExpandMoreIcon />}
      defaultExpandIcon={<ChevronRightIcon />}
      onNodeSelect={handleSelect}
      onNodeToggle={handleNodeToggle}
      expanded={expanded}
      sx={{ overflowX: "hidden", height: 500, width: "100%" }}
    >
      <IconExpandedTreeItem nodeId="1" label="Home">
        {renderTree(folders)}
      </IconExpandedTreeItem>
    </TreeView>
  );
};

export default function CustomizedTreeView({ mode, open, onClose }) {
  const operation = useSelector((state) => state.operation);
  const items = useGetCSRFTokenQuery();

  const { data, isLoading, isError, isSuccess } = items;
  const { CSRFToken } = data ? data : { CSRFToken: "" };
  const dispatch = useDispatch();
  const { fileIds, directories } = useRecoilValue(itemsSelectedAtom);
  const [nodeSelected, setNodeSelected] = useState(false);
  console.log("Modal rendered-->", mode);
  const [toPath, setToPath] = useState("/");

  useEffect(() => {
    if (isSuccess) {
      dispatch(setCSRFToken(CSRFToken));
      if (mode === MOVE) {
        dispatch(
          setOperation({
            ...operation,
            type: MOVE,
            status: "uninitialized",
          })
        );
      } else if (mode === COPY) {
        dispatch(
          setOperation({
            ...operation,
            type: COPY,
            status: "uninitialized",
          })
        );
      }
    }
  }, [isSuccess]);

  const handleSubmit = async () => {
    const body = {
      files: fileIds.length > 0 ? fileIds : null,
      folders: directories.length > 0 ? directories : null,
    };

    if (mode === MOVE) {
      dispatch(
        setOperation({
          ...operation,
          type: MOVE,
          status: "initialized",
          data: { body, to: toPath },
        })
      );
    } else if (mode === COPY) {
      dispatch(
        setOperation({
          ...operation,
          type: COPY,
          status: "initialized",
          data: { body, to: toPath },
        })
      );
    }
    onClose(mode);
  };

  return (
    <>
      <Modal
        open={open}
        onClose={onClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography variant="h6" component="h2">
            {mode === MOVE && <>Move </>} {mode === COPY && <>Copy </>}
            {fileIds.length + directories.length} Item(s) to...
          </Typography>
          <Divider orientation="horizontal" />
          {isSuccess && (
            <FolderTreeView
              CSRFToken={CSRFToken}
              toPath={toPath}
              setToPath={setToPath}
              setNodeSelected={setNodeSelected}
            />
          )}
          {isLoading && (
            <div className="flex justify-center items-center">
              <SpinnerGIF style={{ width: "50px", height: "50px" }} />
            </div>
          )}
          {isError && (
            <Modal>
              <Box sx={style}>
                <Typography>Something went wrong</Typography>
              </Box>
            </Modal>
          )}
          <Divider orientation="horizontal" />
          {isSuccess && (
            <Stack
              sx={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                gap: 1,
                justifyContent: "flex-end",
              }}
            >
              <Button
                variant="contained"
                disableRipple
                sx={{
                  background: "#F5EFE5",
                  color: "#1A1918",
                  textTransform: "none",
                  width: 75,
                  fontWeight: 900,
                  "&:hover": { backgroundColor: "#F5EFE5F0" },
                }}
                onClick={onClose}
              >
                Cancel
              </Button>
              <Button
                disableRipple
                variant="contained"
                disabled={!nodeSelected}
                sx={{
                  background: nodeSelected ? "#0061FE" : "#BBB5AE",
                  width: 75,
                  fontWeight: 900,
                  color: nodeSelected ? "#F2F7FF" : "#F2F7FF",
                  "&:hover": { backgroundColor: "#BBB5AEF0" },
                  textTransform: "none",
                }}
                onClick={() => handleSubmit()}
              >
                {mode === MOVE && <>Move </>} {mode === COPY && <>Copy </>}
              </Button>
            </Stack>
          )}
        </Box>
      </Modal>
    </>
  );
}
