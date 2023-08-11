import { Stack } from "@mui/material";
import React from "react";

import Table from "./DataTable";

export default React.memo(function MainPanel({ data }) {
  return (
    <Stack
      display="flex"
      flexDirection="column"
      sx={{ height: "100%", width: "100%" }}
    >
      <Table data={data} />
    </Stack>
  );
});
