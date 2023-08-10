import { Stack, Box, Button, Typography } from "@mui/material";
import { useState, useEffect } from "react";
import ExpandMoreIcon from "@mui/icons-material/ExpandMoreOutlined.js";
import ExpandLessIcon from "@mui/icons-material/ExpandLessOutlined.js";
import Drawer from "./DrawerUpload.js";

import Table from "./DataTable";

export default function MainPanel({ data }) {
  const [expandProgress, setExpandProgress] = useState(true);
  const [progressBlock, setProgressBlock] = useState("block");
  const close = () => {
    setExpandProgress((prev) => !prev);
  };
  useEffect(() => {
    if (expandProgress) {
      setProgressBlock("block");
    } else {
      setProgressBlock("none");
    }
  }, [expandProgress]);
  return (
    <Stack
      display="flex"
      flexDirection="column"
      sx={{ height: "100%", width: "100%" }}
    >
      <Table data={data} />
    </Stack>
  );
}
