import { Box, Stack } from "@mui/material";
import Table from "./DataTable";
import Menu from "./UploadMenu";

export default function MainPanel() {
  return (
    <>
      <Stack flexDirection="column">
        <Menu />
        <Table />
      </Stack>
      <Stack></Stack>
    </>
  );
}
