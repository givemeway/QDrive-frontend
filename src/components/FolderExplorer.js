import * as React from "react";
import { useState } from "react";
import FolderRounded from "@mui/icons-material/FolderRounded";
import { TreeView } from "@mui/x-tree-view/TreeView";
import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import IconExpandedTreeItem from "./CustomTreeItem";

import { useGetFoldersMutation } from "../features/api/apiSlice";
import { useSelector } from "react-redux";
import SpinnerGIF from "./icons/SpinnerGIF";

const HOME = "/dashboard/home";

export default function CustomizedTreeView() {
  const navigate = useNavigate();
  const { CSRFToken } = useSelector((state) => state.csrfToken);
  const [expanded, setExpanded] = useState([]);
  const [folders, setFolders] = useState([]);
  const clickedNode = useRef("1");

  console.log("Folder Explorer rendered");
  const [getFolderQuery, getFolderStatus] = useGetFoldersMutation();
  let { isLoading, isError, error, isSuccess, data, status } = getFolderStatus;
  data = data ? data : { folders: [] };

  useEffect(() => {
    setExpanded(["1"]);
    getFolderQuery({ path: "/", CSRFToken });
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
    if (!expanded.includes(nodeId)) {
      clickedNode.current = nodeId;

      getFolderQuery({ path, CSRFToken });
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
      navigate(HOME);
    } else {
      navigate(HOME + nodeId);
    }
  };
  const handleNodeToggle = (event, nodeIds) => {
    setExpanded(nodeIds);
  };

  const updateNode = (nodes, nodeId, newChildren) => {
    return nodes.map((node) => {
      if (node.path === nodeId) {
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

  const RenderTree = (nodes) => {
    return nodes.map((node) => (
      <IconExpandedTreeItem
        nodeId={node.path}
        key={node.uuid}
        label={
          <div className="flex justify-start gap-1 items-center">
            <FolderRounded sx={{ color: "#A1C9F7" }} /> {node.folder}
            {node.path === clickedNode.current && isLoading && (
              <SpinnerGIF
                style={{
                  width: 20,
                  height: 20,
                }}
              />
            )}
          </div>
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
      </IconExpandedTreeItem>
    ));
  };
  console.log(clickedNode.current, isLoading, clickedNode.current === "1");

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
        {RenderTree(folders)}
        {clickedNode.current === "1" && isLoading && (
          <SpinnerGIF style={{ width: 50, height: 50 }} />
        )}
      </TreeView>
    </>
  );
}
