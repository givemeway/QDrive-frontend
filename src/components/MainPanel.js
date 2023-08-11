import { Stack } from "@mui/material";

import Table from "./DataTable";

export default function MainPanel({ data }) {
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
