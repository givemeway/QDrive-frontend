import { Stack } from "@mui/material";
import React from "react";
import DeleteSnackBar from "./SnackBar.js";

import Table from "./DataTable";

export default React.memo(function MainPanel() {
  return (
    <Stack
      display="flex"
      flexDirection="column"
      sx={{ height: "100%", width: "100%" }}
    >
      <Table layout={"dashboard"} />
      <DeleteSnackBar />
    </Stack>
  );
});
