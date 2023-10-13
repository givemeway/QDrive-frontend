import { useEffect, useContext } from "react";
import { Box, Divider, Typography, Fab, IconButton, Link } from "@mui/material";
import { styled } from "@mui/material/styles";

import Badge from "@mui/material/Badge";
import DownloadForOfflineIcon from "@mui/icons-material/DownloadForOffline";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import TextSnippetIcon from "@mui/icons-material/TextSnippet";
import ClearIcon from "@mui/icons-material/Clear";
import { ItemSelectionContext } from "./Context";
import { useState } from "react";
import InfoIcon from "@mui/icons-material/InfoRounded";
import ImageIcon from "@mui/icons-material/Image";
import { fireEvent } from "@testing-library/react";

const container = {
  display: "flex",
  flexDirection: "column",
  justifyContent: "flex-start",
  alignItems: "flex-start",
  width: 400,
  border: "1px solid #E0E0E0",
  borderTop: "none",
  borderLeft: "none",
};
const styleVersions = {
  display: "flex",
  flexDirection: "row",
  justifyContent: "flex-start",
  alignItems: "center",
  width: "100%",
  border: "1px solid #E0E0E0",
  borderTop: "none",
  borderLeft: "none",
  gap: 2,
};

const heading = {
  display: "flex",
  flexDirection: "row",
  justifyContent: "flex-start",
  alignItems: "center",
  borderBottom: "1px solid #E0E0E0",
  height: 56,
  width: "100%",
  boxSizing: "border-box",
};

const header = {
  background: "#ECF5FC",
  height: 30,
  width: "100%",
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
  borderBottom: "1px solid #E0E0E0",
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

export default function Activity({ versions, setActivity }) {
  const [versionedFiles, setVersionedFiles] = useState([]);
  const handleClose = () => {
    setActivity(false);
  };
  useEffect(() => {
    setVersionedFiles(
      Array.from(versions)
        .map((file) => ({
          modified: file[1].last_modified,
          version: file[1].versions,
          size: file[1].size,
          id: file[1].id,
          url: file[1].url,
        }))
        .sort((a, b) => b.version - a.version)
    );
  }, [versions]);

  return (
    <Box sx={container}>
      <Box sx={heading}>
        <InfoIcon sx={{ width: 40 }} />

        <Typography
          component={"h1"}
          sx={{
            textAlign: "left",
            fontSize: "1.25rem",
            width: 320,
          }}
        >
          Info
        </Typography>
        <ClearIcon
          sx={{ width: 40, cursor: "pointer" }}
          onClick={handleClose}
        />
      </Box>
      <Box
        sx={{
          ...header,
          background: "transparent",
          borderBottom: "none",
          height: 200,
        }}
      >
        <ImageIcon sx={{ fontSize: 200 }} />
      </Box>
      <Box sx={header}>
        <Typography sx={{ fontSize: "1rem", fontWeight: 600 }}>
          Previous Versions
        </Typography>
      </Box>
      {versionedFiles.map((file) => {
        return (
          <Box sx={styleVersions} key={file.id}>
            <CustomizedBadges
              version={file.version}
              sx={{ width: 30, fontSize: 12 }}
            />
            <Typography sx={{ width: 180, fontSize: 12, textAlign: "left" }}>
              Modified: {file.modified}
            </Typography>
            <Typography sx={{ width: 100, fontSize: 12, textAlign: "left" }}>
              Size: {file.size}
            </Typography>
            <Link href={file.url} rel="noreferrer" target="_parent">
              <DownloadForOfflineIcon
                color={"primary"}
                sx={{ width: 30, cursor: "pointer" }}
              />
            </Link>
          </Box>
        );
      })}
    </Box>
  );
}
