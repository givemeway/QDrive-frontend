import { Stack } from "@mui/material";
import React from "react";
import DeleteSnackBar from "./SnackBar.js";

import Table from "./DeletedFiles.js";

export default React.memo(function MainPanel() {
  return (
    <Stack
      display="flex"
      flexDirection="row"
      sx={{ height: "100%", width: "100%" }}
    >
      <Table layout={"dashboard"} path={"/dashboard/home"} />

      <DeleteSnackBar />
    </Stack>
  );
});
