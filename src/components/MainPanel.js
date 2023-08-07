import { Box, Stack } from "@mui/material";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import Table from "./DataTable";
import Menu from "./UploadMenu";

const url = "/app/browseFolder";
const csrfurl = "/app/csrftoken";

async function fetchCSRFToken(csrfurl) {
  const response = await fetch(csrfurl);
  const { CSRFToken } = await response.json();
  return CSRFToken;
}

export default function MainPanel({ data }) {
  return (
    <>
      <Stack flexDirection="column">
        <Table data={data} />
      </Stack>
    </>
  );
}
