import { LinearProgress } from "@mui/material";
import CachedIcon from "@mui/icons-material/Cached";
import ErrorIcon from "@mui/icons-material/Error";
import ScheduleIcon from "@mui/icons-material/Schedule";
import CloseIcon from "@mui/icons-material/Close";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import ExpandMoreIcon from "@mui/icons-material/ExpandMoreOutlined.js";
import { useState, useEffect, useRef } from "react";
import { FixedSizeList as List } from "react-window";
import { styled } from "@mui/material/styles";
import React from "react";
import Draggable from "react-draggable";
import CircularSpinner from "./icons/circularSpinner.js";
import "./UploadProgressDrawer.css";
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
      <div className="row-container">
        <div className="row-file-icon">
          {get_file_icon(data[index][1].name)}
        </div>

        <div className=" row-file-status">
          <span className="row-file-heading ">{data[index][1].name}</span>
          {data[index][1].status === "queued" && (
            <span className="row-file-status-text">In Queue</span>
          )}
          {data[index][1].status === "preparing" && (
            <span className="row-file-status-text">Preparing..</span>
          )}
          {data[index][1].status === "finalizing" && (
            <span className="row-file-status-text">Finalizing..</span>
          )}
          {data[index][1].status === "failed" && (
            <span className="row-file-status-text">Unknown Error</span>
          )}
          {data[index][1].status === "uploading" && (
            <span className="row-file-status-text">
              Uploading {data[index][1].transferred_b} / {data[index][1].size} -{" "}
              {eta} left.. Rate: {speed}
            </span>
          )}
          {data[index][1].status === "uploaded" && (
            <div className="row-file-uploaded-container">
              <span className="row-file-status-text row-file-uploaded-status">
                Uploaded To
              </span>
              <Link
                to={"/dashboard/home" + data[index][1].path}
                onClick={(e) => e.stopPropagation()}
                className="row-file-status-text row-file-uploaded-to-link"
              >
                <p className="row-file-uploaded-to-link-p ">
                  {data[index][1].folder}
                </p>
              </Link>
            </div>
          )}
        </div>
        <div className="row-file-uploading-status">
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
      <div className="drawer-container">
        <div className="drawer-top">
          <div
            className="drawer-top-text-container"
            onClick={toggleProgressBody}
          >
            {!uploadCompleted && (
              <span className="drawer-top-text">
                Uploading {filesStatus.processed} of {filesStatus.total} items,{" "}
                {filesStatus.eta} left
              </span>
            )}
            {uploadCompleted && (
              <span className="drawer-top-text">
                {filesStatus.processed} of {filesStatus.total} uploads complete
              </span>
            )}
          </div>
          <div className="drawer-top-icons">
            {
              <ExpandMoreIcon
                color="#363432"
                sx={{ fontSize: "2rem", cursor: "pointer" }}
                className={`icon-expandmore ${
                  progressBlock === "block" ? "icon-expandless" : ""
                }`}
                onClick={toggleProgressBody}
              />
            }
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
          <div style={{ width: "100%" }}>
            <SlowLinearProgress />
          </div>
        )}
        <div
          className={`progress-body ${
            progressBlock === "block" ? "active" : ""
          }`}
        >
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
