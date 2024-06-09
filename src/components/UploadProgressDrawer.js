import { LinearProgress } from "@mui/material";
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
import { Link } from "react-router-dom";

import { useMemo } from "react";
import { formatBytes, formatSeconds } from "../util";
import { get_file_icon } from "./fileFormats/FileFormat.js";

const SlowLinearProgress = styled(LinearProgress)({
  "& .MuiLinearProgress-bar": {
    // apply a new animation-duration to the `.bar` class
    animationDuration: "3.0s",
  },
});

const Row = React.memo(({ index, data, style }) => {
  const timer = useRef(null);
  const [eta, setETA] = useState(data[index][1].eta);
  const [speed, setSpeed] = useState(data[index][1].speed);
  const [seconds, setSeconds] = useState(0);

  const calculateETA = (startTime, total, transferred) => {
    const timeElapsed = Date.now() - startTime;
    const uploadSpeed = transferred / (timeElapsed / 1000);
    const time = (total - transferred) / uploadSpeed;
    const left = formatSeconds(time);
    const rate = formatBytes(uploadSpeed) + "/s";
    setETA(left);
    setSpeed(rate);
  };

  useEffect(() => {
    if (data[index][1].status === "uploading") {
      timer.current = setInterval(() => setSeconds((prev) => prev + 1), 1000);
    }
    if (
      (data[index][1].status === "uploaded" ||
        data[index][1].status === "failed") &&
      timer.current
    ) {
      clearInterval(timer.current);
    }
  }, [data[index][1].status]);

  useEffect(() => {
    return () => {
      if (timer.current) {
        clearInterval(timer.current);
      }
    };
  }, []);

  useEffect(() => {
    calculateETA(
      data[index][1].startTime,
      data[index][1].bytes,
      data[index][1].transferred
    );
  }, [seconds]);

  return (
    <div
      style={{ ...style, borderBottom: "1px solid #DFDCD8" }}
      key={data[index][0]}
    >
      <div className="w-full h-full flex flex-row justify-evenly items-center">
        <div className="flex justify-center items-center w-[15%] h-full">
          {get_file_icon(data[index][1].name)}
        </div>

        <div className=" w-[75%] h-full flex flex-col items-center justify-end">
          <span className="text-sm text-left w-full text-black font-semibold truncate">
            {data[index][1].name}
          </span>
          {data[index][1].status === "queued" && (
            <span className="text-[12px] text-left w-full text-[rgb(71,70,68)]">
              In Queue
            </span>
          )}
          {data[index][1].status === "preparing" && (
            <span className="text-[12px] text-left w-full text-[rgb(71,70,68)]">
              Preparing..
            </span>
          )}
          {data[index][1].status === "finalizing" && (
            <span className="text-[12px] text-left w-full text-[rgb(71,70,68)]">
              Finalizing..
            </span>
          )}
          {data[index][1].status === "failed" && (
            <span className="text-[12px] text-left w-full text-[rgb(71,70,68)]">
              Unknown Error
            </span>
          )}
          {data[index][1].status === "uploading" && (
            <span className="text-[12px] text-left w-full text-[rgb(71,70,68)]">
              Uploading {data[index][1].transferred_b} / {data[index][1].size} -{" "}
              {eta} left.. Rate: {speed}
            </span>
          )}
          {data[index][1].status === "uploaded" && (
            <div className="w-full flex justify-start items-center">
              <span className="text-[12px] text-left text-[rgb(71,70,68)] w-[25%]">
                Uploaded To
              </span>
              <Link
                to={"/dashboard/home" + data[index][1].path}
                onClick={(e) => e.stopPropagation()}
                className="text-[12px] text-left text-[rgb(71,70,68)] underline hover:text-black w-[75%]"
              >
                <p className="w-full truncate">{data[index][1].folder}</p>
              </Link>
            </div>
          )}
        </div>
        <div className="flex justify-center items-center w-[10%] h-full">
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
        </div>
      </div>
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
  const toggleProgressBody = (e) => {
    e.stopPropagation();
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
          className="flex flex-nowrap justify-between items-center w-full h-[50px]
               bg-[#F5EFE5] border border-[#BBB5AE] box-border p-1"
        >
          <div
            className="w-[80%] flex justify-left items-center h-full cursor-pointer"
            onClick={toggleProgressBody}
          >
            {!uploadCompleted && (
              <span className="w-full text-left font-semibold text-md">
                Uploading {filesStatus.processed} of {filesStatus.total} items,{" "}
                {filesStatus.eta} left
              </span>
            )}
            {uploadCompleted && (
              <span className="w-full text-left font-semibold text-md">
                {filesStatus.processed} of {filesStatus.total} uploads complete
              </span>
            )}
          </div>
          <div className="flex flex-row justify-end items-center w-[20%] h-full">
            {progressBlock === "block" ? (
              <ExpandMoreIcon
                color="#363432"
                sx={{ fontSize: "2rem", cursor: "pointer" }}
                onClick={toggleProgressBody}
              />
            ) : (
              <ExpandLessIcon
                color="#363432"
                sx={{ fontSize: "2rem", cursor: "pointer" }}
                onClick={toggleProgressBody}
              />
            )}
            {uploadCompleted && (
              <CloseIcon
                color="#363432"
                sx={{ cursor: "pointer" }}
                onClick={onClose}
              />
            )}
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
            itemSize={60}
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
