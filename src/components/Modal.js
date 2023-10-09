/*global axios */
import * as React from "react";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import { useState } from "react";
import FolderRounded from "@mui/icons-material/FolderRounded";
import { TreeView } from "@mui/x-tree-view/TreeView";
import {
  Button,
  Modal,
  Typography,
  Divider,
  Snackbar,
  CircularProgress,
} from "@mui/material";
import { useEffect, useContext, useRef } from "react";
import { csrftokenURL, getSubFoldersURL, moveItemsURL } from "../config";
import { ItemSelectionContext } from "./Context";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import IconExpandedTreeItem from "./CustomTreeItem";
import { useLocation, useNavigate } from "react-router-dom";

async function fetchCSRFToken(csrfurl) {
  const response = await fetch(csrfurl);
  const { CSRFToken } = await response.json();
  return CSRFToken;
}

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

const fetchFoldersFromServer = async (path) => {
  const CSRFToken = await fetchCSRFToken(csrftokenURL);
  const headers = {
    "X-CSRF-Token": CSRFToken,
    "Content-Type": "application/x-www-form-urlencoded",
    path: path,
    username: "sandeep.kumar@idriveinc.com",
    sortorder: "ASC",
  };
  const options = {
    credentials: "include",
    method: "POST",
    headers: headers,
  };

  const res = await fetch(getSubFoldersURL, options);
  const newFolders = await res.json();
  return newFolders;
};

export default function CustomizedTreeView({ setStartMove, moveImmediate }) {
  const [open, setOpen] = useState(true);
  const [expanded, setExpanded] = useState([]);
  const [folders, setFolders] = useState([]);
  const { fileIds, directories } = useContext(ItemSelectionContext);
  console.log("Modal rendered");
  const toPath = useRef("/");
  const [nodeSelected, setNodeSelected] = useState(false);
  const [openSnackbar, setOpenSnackBarOpen] = useState(false);
  const [move, setMove] = useState({
    initiated: false,
    moving: false,
    moved: false,
    movedItems: 0,
    movedFailed: 0,
  });

  const handleClose = () => {
    setOpen(false);
    setOpenSnackBarOpen(false);
  };

  const handleSubmit = async () => {
    setMove((prev) => ({ ...prev, initiated: true, moving: true }));
    setOpenSnackBarOpen(true);
    const CSRFToken = await fetchCSRFToken(csrftokenURL);
    const headers = {
      "X-CSRF-Token": CSRFToken,
      "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
    };
    const body = {
      files: fileIds.length > 0 ? fileIds : null,
      folders: directories.length > 0 ? directories : null,
    };
    console.log(body);
    const res = await axios.post(moveItemsURL + `?to=${toPath.current}`, body, {
      headers: headers,
    });
    console.log(res.data);
    setMove((prev) => ({
      ...prev,
      initiated: false,
      moving: false,
      moved: true,
      movedItems: res.data.moved,
      moveFailed: res.data.failed,
    }));
  };

  const handleClick = async (path, nodeId) => {
    // Fetch folders from server while expanding
    let newFolders = [];
    if (!expanded.includes(nodeId)) {
      newFolders = (await fetchFoldersFromServer(path)).folders;
      // Find the clicked node and update its children
      setExpanded((prev) => [...prev, nodeId]);
      setFolders((prevFolders) => updateNode(prevFolders, nodeId, newFolders));
    } else {
      setExpanded((prev) => {
        return prev.includes(nodeId)
          ? prev.filter((el) => el !== nodeId)
          : [...prev, nodeId];
      });
    }
  };

  const updateNode = (nodes, nodeId, newChildren) => {
    return nodes.map((node) => {
      if (node.uuid + ";" + node.path === nodeId) {
        // This is the clicked node, update its children
        return { ...node, children: newChildren };
      } else if (node.children) {
        // This node has children, recurse on the children
        return {
          ...node,
          children: updateNode(node.children, nodeId, newChildren),
        };
      } else {
        // This node is not the clicked node and it has no children, leave it as is
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
  useEffect(() => {
    (async () => setFolders((await fetchFoldersFromServer("/")).folders))();
    setExpanded(["1"]);
  }, []);

  useEffect(() => {
    if (move.moved) {
      if (moveImmediate === true) {
        setStartMove(false);
      }
    }
  }, [move.moved]);

  const handleSelect = (event, nodeId) => {
    setNodeSelected(true);
    if (nodeId === "1") {
      toPath.current = "/";
      console.log(toPath.current);
    } else {
      console.log(nodeId.split(";")[1]);
      toPath.current = nodeId.split(";")[1];
    }
  };
  const handleNodeToggle = (event, nodeIds) => {
    setExpanded(nodeIds);
  };

  return (
    <>
      {!move.initiated && !move.moved && (
        <Modal
          open={open}
          onClose={handleClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={style}>
            <Typography variant="h6" component="h2">
              Move {fileIds.length + directories.length} Item(s) to...
            </Typography>
            <Divider orientation="horizontal" />
            <TreeView
              aria-label="customized"
              defaultExpanded={["1"]}
              defaultCollapseIcon={<ExpandMoreIcon />}
              defaultExpandIcon={<ChevronRightIcon />}
              // defaultEndIcon={<ExpandMoreIcon />}
              onNodeSelect={handleSelect}
              onNodeToggle={handleNodeToggle}
              expanded={expanded}
              sx={{ overflowX: "hidden", height: 500, width: "100%" }}
            >
              <IconExpandedTreeItem nodeId="1" label="Home">
                {renderTree(folders)}
              </IconExpandedTreeItem>
            </TreeView>
            <Divider orientation="horizontal" />
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
                onClick={handleClose}
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
                onClick={() => handleSubmit(toPath)}
              >
                Move
              </Button>
            </Stack>
          </Box>
        </Modal>
      )}
      {openSnackbar && (
        <Snackbar
          open={openSnackbar}
          autoHideDuration={5000}
          anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
          onClose={handleClose}
          message={
            <Box
              display="flex"
              flexDirection="row"
              alignItems="center"
              justifyContent="flex-start"
              gap={2}
            >
              {move.moving && <CircularProgress />}
              {move.moving && (
                <Typography>
                  Moving {fileIds.length + directories.length} items
                </Typography>
              )}
              {move.moved && (
                <>
                  <Typography>Moved {move.movedItems} items</Typography>
                  {move.movedFailed > 0 && (
                    <Typography>
                      Move Failed for {move.movedFailed} items
                    </Typography>
                  )}
                </>
              )}
            </Box>
          }
        ></Snackbar>
      )}
    </>
  );
}
