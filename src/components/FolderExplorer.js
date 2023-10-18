/*global axios */
import * as React from "react";
import Box from "@mui/material/Box";
import { useState } from "react";
import FolderRounded from "@mui/icons-material/FolderRounded";
import { TreeView } from "@mui/x-tree-view/TreeView";
import { Divider } from "@mui/material";
import { useEffect, useRef } from "react";
import { csrftokenURL, getSubFoldersURL } from "../config";

import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import IconExpandedTreeItem from "./CustomTreeItem";

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

export default function CustomizedTreeView({ nav, setNav }) {
  const [expanded, setExpanded] = useState([]);
  const [folders, setFolders] = useState([]);
  console.log("Modal rendered");
  // const { nav, setNav } = path;
  console.log(nav, setNav);
  const toPath = useRef("/");
  const [nodeSelected, setNodeSelected] = useState(false);

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

  const handleSelect = (event, nodeId) => {
    setNodeSelected(true);
    if (nodeId === "1") {
      toPath.current = "/";
      console.log(toPath.current);
    } else {
      console.log(nodeId.split(";")[1]);
      toPath.current = nodeId.split(";")[1];
    }
    console.log(toPath.current);
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
          {renderTree(folders)}
        </IconExpandedTreeItem>
      </TreeView>
    </>
  );
}
