import { useEffect, useContext } from "react";
import { Box, Divider, Typography, Fab, IconButton } from "@mui/material";
import { styled } from "@mui/material/styles";

import Badge from "@mui/material/Badge";
import DownloadForOfflineIcon from "@mui/icons-material/DownloadForOffline";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import TextSnippetIcon from "@mui/icons-material/TextSnippet";
import ClearIcon from "@mui/icons-material/Clear";
import { ItemSelectionContext } from "./Context";
import { useState } from "react";
import { formatBytes } from "../util";

const container = {
  display: "flex",
  flexDirection: "column",
  justifyContent: "flex-start",
  alignItems: "flex-start",
  width: 400,
};
const styleVersions = {
  display: "flex",
  flexDirection: "row",
  justifyContent: "space-between",
  alignItems: "center",
  width: "100%",
  border: "1px solid #E0E0E0",
  borderTop: "none",
  borderLeft: "none",
};

const heading = {
  display: "flex",
  flexDirection: "row",
  justifyContent: "space-around",
  alignItems: "center",
  borderBottom: "1px solid #E0E0E0",
  height: 56,
  width: "100%",
};

const header = {
  background: "#ECF5FC",
  height: 30,
  width: "100%",
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
  fontWeight: 600,
  borderBottom: "1px solid #E0E0E0",
};
const fabStyle = {
  height: 25,
  width: 25,
};

const StyledBadge = styled(Badge)(({ theme }) => ({
  "& .MuiBadge-badge": {
    right: -3,
    top: 13,
    border: `2px solid ${theme.palette.background.paper}`,
    padding: "0 4px",
  },
}));

function CustomizedBadges({ version }) {
  return (
    <IconButton aria-label="file">
      <StyledBadge badgeContent={version} color="primary">
        <TextSnippetIcon fontSize="medium" />
      </StyledBadge>
    </IconButton>
  );
}

export default function Activity({ versions }) {
  const { itemsSelected } = useContext(ItemSelectionContext);
  const [versionedFiles, setVersionedFiles] = useState([]);
  const { fileIds } = itemsSelected;
  const options = {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    hour12: true,
  };
  const handleClick = () => {
    console.log("clicked");
  };
  useEffect(() => {
    setVersionedFiles(
      Array.from(versions).map((file) => ({
        modified: new Date(file[1].last_modified).toLocaleString(
          "en-in",
          options
        ),
        version: file[1].versions,
        size: file[1].size,
        id: file[1].uuid,
      }))
    );
  }, [versions]);
  return (
    <Box sx={container}>
      <Box sx={heading}>
        <InsertDriveFileIcon sx={{ color: "#6EA5CE" }} />
        <Typography component={"h3"} sx={{ color: "#6EA5CE" }}>
          '{fileIds[0]?.file}'
        </Typography>
        <ClearIcon />
      </Box>
      <Box sx={header}>
        <Typography>Previous Versions</Typography>
      </Box>
      {versionedFiles.map((file) => {
        return (
          <Box sx={styleVersions} key={file.id}>
            <CustomizedBadges
              version={file.version}
              sx={{ width: 30, fontSize: 12 }}
            />
            <Typography sx={{ width: 180, fontSize: 12 }}>
              Modified: {file.modified}
            </Typography>
            <Typography sx={{ width: 120, fontSize: 12 }}>
              Size: {formatBytes(file.size)}
            </Typography>

            <DownloadForOfflineIcon color={"primary"} sx={{ width: 30 }} />
          </Box>
        );
      })}
    </Box>
  );
}
