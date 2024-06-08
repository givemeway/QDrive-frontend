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
import CircularSpinner from "./icons/circularSpinner.js";

import { useMemo } from "react";
import { formatBytes, formatSeconds } from "../util";

const SlowLinearProgress = styled(LinearProgress)({
  "& .MuiLinearProgress-bar": {
    // apply a new animation-duration to the `.bar` class
    animationDuration: "3.0s",
  },
});

const Row = React.memo(({ index, data, style }) => {
  const timer = useRef(null);
  const [eta, setETA] = useState("--");
  const [speed, setSpeed] = useState("0/s");

  const calculateETA = () => {
    const timeElapsed = Date.now() - data[index][1].startTime;
    const uploadSpeed = data[index][1].transferred / (timeElapsed / 1000);
    const time =
      (data[index][1].bytes - data[index][1].transferred) / uploadSpeed;
    const left = formatSeconds(time);
    const rate = formatBytes(uploadSpeed) + "/s";
    setETA(left);
    setSpeed(rate);
  };

  useEffect(() => {
    if (data[index][1].status === "uploading") {
      timer.current = setInterval(calculateETA, 1000, data[index][1]);
    }
    if (
      (data[index][1].status === "uploaded" ||
        data[index][1].status === "failed") &&
      timer.current
    ) {
      clearInterval(timer.current);
    }
  }, [data[index][1].status]);

  return (
    <div style={style} key={data[index][0]}>
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
          {data[index][1].status === "queued" && <ScheduleIcon />}
          {data[index][1].status === "uploading" && <CircularSpinner />}
          {data[index][1].status === "preparing" && <CachedIcon />}
          {data[index][1].status === "finalizing" && <CachedIcon />}
          {data[index][1].status === "uploaded" && (
            <CheckCircleOutlineIcon sx={{ color: "#7CAC61" }} />
          )}
          {data[index][1].status === "failed" && (
            <ErrorIcon sx={{ color: "red" }} />
          )}
        </Box>
        <Stack
          sx={{
            width: "70%",
            flexGrow: 1,
          }}
        >
          <Typography fontSize={14} align="left">
            {data[index][1].name}
          </Typography>
          {data[index][1].status === "queued" && (
            <Typography fontSize={10} align="left">
              In Queue
            </Typography>
          )}
          {data[index][1].status === "preparing" && (
            <Typography fontSize={10} align="left">
              Preparing..
            </Typography>
          )}
          {data[index][1].status === "finalizing" && (
            <Typography fontSize={10} align="left">
              Finalizing..
            </Typography>
          )}
          {data[index][1].status === "failed" && (
            <Typography fontSize={10} align="left">
              {data[index][1].error}
            </Typography>
          )}
          {data[index][1].status === "uploading" && (
            <Stack>
              <Typography fontSize={10} align="left">
                Uploading {data[index][1].transferred_b} / {data[index][1].size}{" "}
                - {eta} left.. Rate: {speed}
              </Typography>
            </Stack>
          )}
          {data[index][1].status === "uploaded" && (
            <Typography fontSize={10} align="left">
              Uploaded To {data[index][1].folder}
            </Typography>
          )}
        </Stack>
      </Box>
      {data[index][1].status === "uploading" && (
        <LinearProgress variant="determinate" value={data[index][1].progress} />
      )}
      {(data[index][1].status === "preparing" ||
        data[index][1].status === "finalizing") && (
        <LinearProgress variant="indeterminate" />
      )}
    </div>
  );
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

  return (
    <Draggable>
      <div className="flex flex-col z-[300] absolute shadow-md bg-white bottom-2 w-full md:w-[400px]">
        <div
          onClick={close}
          className="flex flex-nowrap justify-between items-center w-full h-[50px]
               bg-[#F5EFE5] border border-[#BBB5AE] box-border cursor-pointer p-1"
        >
          <div className="w-[80%] flex justify-left items-center h-full">
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
          <div className="flex flex-row justify-left items-center w-[20%] h-full">
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
            itemSize={70}
            itemData={dataArray}
            ref={ref}
          >
            {Row}
          </List>
        </div>
      </div>
    </Draggable>
  );
});
