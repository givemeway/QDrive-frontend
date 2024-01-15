import { Stack } from "@mui/material";
import React, { useContext } from "react";
import DeleteSnackBar from "./SnackBar.js";

import Table from "./DataTable.js";
import DeletedItemsTable from "./DeletedFiles.js";
import { PanelContext } from "./UseContext.js";
import { useRecoilValue } from "recoil";
import { tabSelectedAtom } from "../Recoil/Store/atoms.js";

export default React.memo(function MainPanel() {
  const tabSelected = useRecoilValue(tabSelectedAtom);
  return (
    <Stack
      display="flex"
      flexDirection="row"
      sx={{ height: "100%", width: "100%" }}
    >
      {tabSelected === 1 && (
        <Table layout={"dashboard"} path={"/dashboard/home"} />
      )}
      {tabSelected === 4 && <DeletedItemsTable />}

      <DeleteSnackBar />
    </Stack>
  );
});
