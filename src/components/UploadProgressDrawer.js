import { Box, Button, Stack, Typography, LinearProgress } from "@mui/material";
import CachedIcon from "@mui/icons-material/Cached";
import ScheduleIcon from "@mui/icons-material/Schedule";
import CloseIcon from "@mui/icons-material/Close";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import ExpandMoreIcon from "@mui/icons-material/ExpandMoreOutlined.js";
import ExpandLessIcon from "@mui/icons-material/ExpandLessOutlined.js";
import { useState, useEffect } from "react";
import { formatBytes } from "../util.js";
import { FixedSizeList as List } from "react-window";

export default function UploadProgressDrawer({
  trackFilesProgress,
  uploadCompleted,
  filesStatus,
  showProgres,
}) {
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

  function getRowStyles() {
    return { height: 70 };
  }

  function Row({ index, style }) {
    const [key, val] = Array.from(trackFilesProgress)[index];

    return (
      <div style={style} key={key}>
        <Stack>
          <Box
            sx={{
              width: "100%",
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-evenly",
              alignItems: "center",
              borderBottom: "1px solid #DFDCD8",
            }}
          >
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                width: "10%",
              }}
            >
              {val.status === "queued" && <ScheduleIcon />}
              {val.status === "uploading" && <CachedIcon />}
              {val.status === "uploaded" && (
                <CheckCircleOutlineIcon sx={{ color: "#7CAC61" }} />
              )}
            </Box>
            <Stack sx={{ width: "65%" }}>
              <Typography fontSize={14} align="left">
                {val.name}
              </Typography>
              {val.status === "queued" && (
                <Typography fontSize={10} align="left">
                  Queued
                </Typography>
              )}
              {val.status === "uploading" && (
                <Typography fontSize={10} align="left">
                  Uploading {formatBytes((val.bytes * val.progress) / 100)} /{" "}
                  {val.size}
                </Typography>
              )}
              {val.status === "uploaded" && (
                <Typography fontSize={10} align="left">
                  Uploaded To {val.folder}
                </Typography>
              )}
            </Stack>

            {val.status === "uploaded" && (
              <Button
                variant="contained"
                size="small"
                disableRipple
                sx={{
                  width: "25%",
                  boxShadow: 0,
                  fontSize: 10,
                  background: "#F5EFE5",
                  color: "#1A1918",
                  "&:hover": { backgroundColor: "transparent" },
                }}
              >
                Copy Link
              </Button>
            )}
            {(val.status === "uploading" || val.status === "queued") && (
              <Button
                variant="contained"
                size="small"
                disableRipple
                sx={{
                  width: "25%",
                  fontSize: 10,
                  boxShadow: 0,
                  background: "#F5EFE5",
                  color: "#1A1918",
                  "&:hover": { backgroundColor: "transparent" },
                }}
              >
                Cancel
              </Button>
            )}
          </Box>
          {val.status !== "uploaded" && (
            <LinearProgress variant="determinate" value={val.progress} />
          )}
        </Stack>
      </div>
    );
  }
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        background: "white",
        boxShadow: 1,
        width: "30%",
        zIndex: 300,
        position: "absolute",
        bottom: 2,
        left: 200,
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          flexWrap: "nowrap",
          justifyContent: "space-evenly",
          alignItems: "center",
          width: "100%",
          height: 48,
          background: "#F5EFE5",
          border: "1px solid #BBB5AE",
          boxSizing: "border-box",
        }}
      >
        <Button
          onClick={close}
          fullWidth
          disableRipple
          sx={{
            color: "#66625F",
            fontSize: "1rem",
            fontWeight: 500,
            textTransform: "none",
            margin: 0,
            padding: 0,
            "&:hover": { backgroundColor: "transparent" },
          }}
        >
          {!uploadCompleted && (
            <Typography>
              Uploading {filesStatus.processed} of {filesStatus.total} items
            </Typography>
          )}
          {uploadCompleted && (
            <Typography>
              {filesStatus.processed} of {filesStatus.total} uploads complete
            </Typography>
          )}
          {progressBlock === "block" ? (
            <ExpandMoreIcon color="#363432" sx={{ fontSize: "2rem" }} />
          ) : (
            <ExpandLessIcon color="#363432" fontSize="medium" />
          )}
          {uploadCompleted && <CloseIcon color="#363432" />}
        </Button>
      </Box>
      <Stack
        sx={{
          display: progressBlock,
          maxHeight: 500,
          overflow: "auto",
        }}
      >
        {showProgres && (
          <List
            height={300}
            itemCount={Array.from(trackFilesProgress).length}
            itemSize={60}
          >
            {Row}
          </List>
        )}
      </Stack>
    </Box>
  );
}
