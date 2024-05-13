import { Box, Stack, Typography, LinearProgress } from "@mui/material";
import CachedIcon from "@mui/icons-material/Cached";
import ErrorIcon from "@mui/icons-material/Error";
import ScheduleIcon from "@mui/icons-material/Schedule";
import CloseIcon from "@mui/icons-material/Close";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import ExpandMoreIcon from "@mui/icons-material/ExpandMoreOutlined.js";
import ExpandLessIcon from "@mui/icons-material/ExpandLessOutlined.js";
import { useState, useEffect, useRef } from "react";
import { FixedSizeList as List } from "react-window";
import { styled } from "@mui/material/styles";
import React from "react";
import Draggable from "react-draggable";

import { useMemo } from "react";

const SlowLinearProgress = styled(LinearProgress)({
  "& .MuiLinearProgress-bar": {
    // apply a new animation-duration to the `.bar` class
    animationDuration: "3.0s",
  },
});

export default React.memo(function UploadProgressDrawer({
  trackFilesProgress,
  uploadCompleted,
  filesStatus,
  onClose,
}) {
  const [expandProgress, setExpandProgress] = useState(true);
  const [progressBlock, setProgressBlock] = useState("block");

  const ref = useRef(null);
  const close = () => {
    setExpandProgress((prev) => !prev);
  };

  const dataArray = useMemo(
    () => Object.entries(trackFilesProgress),
    [trackFilesProgress]
  );

  useEffect(() => {
    if (expandProgress) {
      setProgressBlock("block");
    } else {
      setProgressBlock("hidden");
    }
  }, [expandProgress]);

  useEffect(() => {
    ref.current?.scrollToItem(filesStatus.processed, "center");
  }, [filesStatus.processed]);

  const Row = React.memo(({ index, style }) => {
    const [key, val] = dataArray[index];

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
            {val.status === "preparing" && <CachedIcon />}
            {val.status === "finalizing" && <CachedIcon />}
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
            {val.status === "preparing" && (
              <Typography fontSize={10} align="left">
                Preparing..
              </Typography>
            )}
            {val.status === "finalizing" && (
              <Typography fontSize={10} align="left">
                Finalizing..
              </Typography>
            )}
            {val.status === "failed" && (
              <Typography fontSize={10} align="left">
                {val.error}
              </Typography>
            )}
            {val.status === "uploading" && (
              <Stack>
                <Typography fontSize={10} align="left">
                  Uploading {val.transferred_b} / {val.size} - {val.eta} left..
                  Rate: {val.speed}
                </Typography>
              </Stack>
            )}
            {val.status === "uploaded" && (
              <Typography fontSize={10} align="left">
                Uploaded To {val.folder}
              </Typography>
            )}
          </Stack>
        </Box>
        {val.status === "uploading" && (
          <LinearProgress variant="determinate" value={val.progress} />
        )}
        {(val.status === "preparing" || val.status === "finalizing") && (
          <LinearProgress variant="indeterminate" />
        )}
      </div>
    );
  });

  return (
    <Draggable>
      <div className="flex flex-col z-[300] absolute shadow-md bg-white bottom-2 w-full md:w-[300px]">
        <div
          onClick={close}
          className="flex flex-nowrap justify-between items-center w-full h-[48px]
               bg-[#F5EFE5] border border-[#BBB5AE] box-border cursor-pointer"
        >
          <div className="grow">
            {!uploadCompleted && (
              <span className="w-full text-left">
                Uploading {filesStatus.processed} of {filesStatus.total} items,{" "}
                {filesStatus.eta} left
              </span>
            )}
            {uploadCompleted && (
              <span className="w-full text-left">
                {filesStatus.processed} of {filesStatus.total} uploads complete
              </span>
            )}
          </div>
          <div
            sx={{
              flexGrow: 1,
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "flex-end",
              marginRight: 2,
            }}
            className="grow flex flex-row justify-end items-center"
          >
            {progressBlock === "block" ? (
              <ExpandMoreIcon color="#363432" sx={{ fontSize: "2rem" }} />
            ) : (
              <ExpandLessIcon color="#363432" sx={{ fontSize: "2rem" }} />
            )}
            {uploadCompleted && <CloseIcon color="#363432" onClick={onClose} />}
          </div>
        </div>
        {!expandProgress && !uploadCompleted && (
          <div className="w-full">
            <SlowLinearProgress />
          </div>
        )}
        <div className={`max-h-[500px] overflow-auto ${progressBlock}`}>
          <List
            height={500}
            itemCount={dataArray.length}
            itemSize={65}
            ref={ref}
          >
            {Row}
          </List>
        </div>
      </div>
    </Draggable>
  );
});
