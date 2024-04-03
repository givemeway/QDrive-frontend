import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { useGetSharesMutation } from "../features/api/apiSlice";
import { timeOpts } from "../config";
import { FixedSizeList as List } from "react-window";
import SpinnerGIF from "./icons/SpinnerGIF";
export const ShareList = () => {
  const { CSRFToken } = useSelector((state) => state.csrfToken);
  const elementRef = useRef(null);
  const [shareListQuery, shareListStatus] = useGetSharesMutation();
  const [height, setHeight] = useState(undefined);
  const { isLoading, isSuccess, isError, data, error } = shareListStatus;

  useEffect(() => {
    shareListQuery({ CSRFToken });
    const parentElement = elementRef.current;
    const parentHeight = parentElement.getBoundingClientRect().height;
    setHeight(parentHeight);
  }, []);
  const Row = React.memo(({ index, style }) => {
    return (
      <div
        className="grid grid-cols-4 content-center"
        style={{ ...style, background: index % 2 === 0 ? "white" : "#F8F8F0" }}
      >
        {Object.entries(data[index])
          .filter(
            ([k, v]) =>
              k !== "uuid" &&
              k !== "_id" &&
              k !== "__v" &&
              k !== "item" &&
              k !== "password" &&
              k !== "files" &&
              k !== "folders"
          )
          .map(([k, v]) => {
            if (k === "created_at" || k === "expires_at") {
              return (
                <div className="col-span-1 text-left pl-2">
                  {new Date(v).toLocaleString("en-in", timeOpts)}
                </div>
              );
            } else {
              return <div className="col-span-1 text-left pl-2">{v}</div>;
            }
          })}
      </div>
    );
  });
  return (
    <div
      className="w-full h-full flex flex-col justify-center items-center"
      ref={elementRef}
    >
      {isSuccess && data && height && (
        <div className="w-full grid grid-cols-4 content-center">
          <h4 className="col-span-1 text-left pl-2 font-bold">Share By</h4>
          <h4 className="col-span-1 text-left pl-2 font-bold">Owner</h4>
          <h4 className="col-span-1 text-left pl-2 font-bold">Created At</h4>
          <h4 className="col-span-1 text-left pl-2 font-bold">Expires At</h4>
        </div>
      )}

      {isSuccess && data && height && (
        <List
          height={height}
          width={"100%"}
          itemCount={data.length}
          itemSize={50}
        >
          {Row}
        </List>
      )}
      {isLoading && <SpinnerGIF style={{ height: 50, width: 50 }} />}
      {isError && <>Something Went wrong</>}
    </div>
  );
};
