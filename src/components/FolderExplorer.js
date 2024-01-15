/*global axios */
import * as React from "react";
import Box from "@mui/material/Box";
import { useState, useContext } from "react";
import FolderRounded from "@mui/icons-material/FolderRounded";
import { TreeView } from "@mui/x-tree-view/TreeView";
import { Divider } from "@mui/material";
import { useEffect, useRef } from "react";
import { csrftokenURL, getSubFoldersURL } from "../config";
import { useNavigate } from "react-router-dom";
import LoadingGif from "./icons/LoadingGif";
import { CircularProgress } from "@mui/material";

import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import IconExpandedTreeItem from "./CustomTreeItem";
import { FolderExplorerContext } from "./UseContext";
import { useRecoilValue } from "recoil";
import { folderExplorerSelector } from "../Recoil/Store/selector";

const HOME = "/dashboard/home";

async function fetchCSRFToken(csrfurl) {
  const response = await fetch(csrfurl);
  const { CSRFToken } = await response.json();
  return CSRFToken;
}

// const style = {
//   display: "flex",
//   flexDirection: "column",
//   justifyContent: "space-between",
//   transform: "translate(-50%, -50%)",
//   width: 300,
//   height: 300,
//   overflow: "auto",
//   bgcolor: "background.paper",
// };

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

export default function CustomizedTreeView() {
  const navigate = useNavigate();
  const { nodeIDToExpand, breadCrumb } = useRecoilValue(folderExplorerSelector);
  const [expanded, setExpanded] = useState([]);
  const [folders, setFolders] = useState([]);
  console.log("Modal rendered");
  const [loading, setLoading] = useState(true);

  const handleClick = async (path, nodeId) => {
    // Fetch folders from server while expanding
    let newFolders = [];
    if (!expanded.includes(nodeId)) {
      newFolders = (await fetchFoldersFromServer(path)).folders;
      // Find the clicked node and update its children
      setLoading(false);

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
      if (node.path === nodeId) {
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

  const RenderTree = (nodes) => {
    return nodes.map((node) => (
      <IconExpandedTreeItem
        nodeId={node.path}
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
          expanded.includes(node.path) ? (
            <ExpandMoreIcon onClick={() => handleClick(node.path, node.path)} />
          ) : (
            <ChevronRightIcon
              onClick={() => handleClick(node.path, node.path)}
            />
          )
        }
      >
        {node.children && RenderTree(node.children)}
        {!node?.children && (
          <CircularProgress
            size={25}
            sx={{
              color: "#0061FE",
              position: "relative",
              left: 15,
            }}
          />
        )}
      </IconExpandedTreeItem>
    ));
  };
  useEffect(() => {
    (async () => {
      setFolders((await fetchFoldersFromServer("/")).folders);
      setLoading(false);
    })();

    setExpanded(["1"]);
  }, []);

  useEffect(() => {
    const temp_breadCrumb = [...breadCrumb];
    temp_breadCrumb[0] = "";
    for (let i = 0; i < temp_breadCrumb.length; i++) {
      const slice = temp_breadCrumb.slice(0, i + 1);
      const id = slice.join("/");
      setExpanded((prev) => [...prev, id]);
      let newFolders = [];
      (async () => {
        if (!expanded.includes(id)) {
          newFolders = (await fetchFoldersFromServer(id)).folders;
          // Find the clicked node and update its children
          setExpanded((prev) => [...prev, id]);
          setFolders((prevFolders) => updateNode(prevFolders, id, newFolders));
        } else {
          setExpanded((prev) => {
            return prev.includes(id)
              ? prev.filter((el) => el !== id)
              : [...prev, id];
          });
        }
      })();
    }
  }, [nodeIDToExpand, breadCrumb]);

  const handleSelect = (event, nodeId) => {
    if (nodeId === "1") {
      navigate(HOME);
    } else {
      navigate(HOME + nodeId);
    }
  };
  const handleNodeToggle = (event, nodeIds) => {
    setExpanded(nodeIds);
  };

  return (
    <>
      <TreeView
        aria-label="customized"
        defaultExpanded={["1"]}
        defaultCollapseIcon={<ExpandMoreIcon />}
        defaultExpandIcon={<ChevronRightIcon />}
        // defaultEndIcon={<ExpandMoreIcon />}
        onNodeSelect={handleSelect}
        onNodeToggle={handleNodeToggle}
        expanded={expanded}
        sx={{
          overflow: "auto",
          height: "100%",
          width: "100%",
          borderTop: "1px solid #D4D2D0",
          borderBottom: "1px solid #D4D2D0",
        }}
      >
        <IconExpandedTreeItem
          nodeId="1"
          label="Home"
          sx={{ textAlign: "left" }}
        >
          {RenderTree(folders)}
          {loading && <CircularProgress size={50} sx={{ color: "#0061FE" }} />}
        </IconExpandedTreeItem>
      </TreeView>
    </>
  );
}
