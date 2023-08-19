import { Box, Button, Stack, Typography, LinearProgress } from "@mui/material";
import CachedIcon from "@mui/icons-material/Cached";
import ErrorIcon from "@mui/icons-material/Error";
import ScheduleIcon from "@mui/icons-material/Schedule";
import CloseIcon from "@mui/icons-material/Close";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import ExpandMoreIcon from "@mui/icons-material/ExpandMoreOutlined.js";
import ExpandLessIcon from "@mui/icons-material/ExpandLessOutlined.js";
import { useState, useEffect } from "react";
import { formatBytes } from "../util.js";
import { FixedSizeList as List } from "react-window";
import { styled } from "@mui/material/styles";
import React from "react";
import Draggable, { DraggableCore } from "react-draggable";

const SlowLinearProgress = styled(LinearProgress)({
  "& .MuiLinearProgress-bar": {
    // apply a new animation-duration to the `.bar` class
    animationDuration: "0.5s",
  },
});

export default React.memo(function UploadProgressDrawer({
  trackFilesProgress,
  uploadCompleted,
  filesStatus,
  showProgress,
  setUpload,
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

  function Row({ index, style }) {
    const [key, val] = Array.from(trackFilesProgress)[index];
    return (
      <div style={style} key={key}>
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
            {val.status === "failed" && <ErrorIcon sx={{ color: "red" }} />}
          </Box>
          <Stack
            sx={{
              width: "70%",
              flexGrow: 1,
            }}
          >
            <Typography fontSize={14} align="left">
              {val.name}
            </Typography>
            {val.status === "queued" && (
              <Typography fontSize={10} align="left">
                In Queue
              </Typography>
            )}
            {val.status === "failed" && (
              <Typography fontSize={10} align="left">
                {val.error}
              </Typography>
            )}
            {val.status === "uploading" && (
              <Typography fontSize={10} align="left">
                Uploading {formatBytes((val.bytes * val.progress) / 100)} /{" "}
                {val.size} - {val.eta} left..
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
                boxShadow: 0,
                fontSize: 10,
                marginRight: 1,
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
                boxShadow: 0,
                fontSize: 10,
                marginRight: 1,
                background: "#F5EFE5",
                color: "#1A1918",
                "&:hover": { backgroundColor: "transparent" },
              }}
            >
              Cancel
            </Button>
          )}
        </Box>
        {val.status === "uploading" && (
          <LinearProgress variant="determinate" value={val.progress} />
        )}
      </div>
    );
  }
  return (
    <Draggable>
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
          // left: 200,
        }}
      >
        <Box
          onClick={close}
          sx={{
            display: "flex",
            flexDirection: "row",
            flexWrap: "nowrap",
            justifyContent: "space-between",
            alignItems: "center",
            width: "100%",
            height: 48,
            background: "#F5EFE5",
            border: "1px solid #BBB5AE",
            boxSizing: "border-box",
            cursor: "pointer",
          }}
        >
          <Box sx={{ flexGrow: 1, marginLeft: 2 }}>
            {!uploadCompleted && (
              <Typography align="left">
                Uploading {filesStatus.processed} of {filesStatus.total} items,{" "}
                {filesStatus.eta} left
              </Typography>
            )}
            {uploadCompleted && (
              <Typography align="left">
                {filesStatus.processed} of {filesStatus.total} uploads complete
              </Typography>
            )}
          </Box>
          <Box
            sx={{
              flexGrow: 1,
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "flex-end",
              marginRight: 2,
            }}
          >
            {progressBlock === "block" ? (
              <ExpandMoreIcon color="#363432" sx={{ fontSize: "2rem" }} />
            ) : (
              <ExpandLessIcon color="#363432" sx={{ fontSize: "2rem" }} />
            )}
            {uploadCompleted && (
              <CloseIcon color="#363432" onClick={() => setUpload(null)} />
            )}
          </Box>

          {/* </Box> */}
        </Box>
        {!expandProgress && !uploadCompleted && (
          <Box sx={{ width: "100%" }}>
            {/* <LinearProgress
            variant="determinate"
            value={Math.ceil((filesStatus.processed / filesStatus.total) * 100)}
          /> */}
            <LinearProgress />
          </Box>
        )}
        <Stack
          sx={{
            display: progressBlock,
            maxHeight: 500,
            overflow: "auto",
          }}
        >
          {showProgress && (
            <List
              height={500}
              itemCount={Array.from(trackFilesProgress).length}
              itemSize={65}
            >
              {Row}
            </List>
          )}
        </Stack>
      </Box>
    </Draggable>
  );
});
