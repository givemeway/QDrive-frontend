import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import {
  useDeleteShareMutation,
  useGetSharesMutation,
} from "../features/api/apiSlice";

import SharedTabs from "./SharedTab.js";
import SharedTable from "./SharedTable.js";
import "./ShareList.css";

const tabs = { folders: true, files: false, transfer: false };

export const ShareList = () => {
  const { CSRFToken } = useSelector((state) => state.csrfToken);
  const [activeTab, setActiveTab] = useState(tabs);
  const elementRef = useRef(null);
  const [shareListQuery, shareListStatus] = useGetSharesMutation();
  const [delShareQuery, delShareStatus] = useDeleteShareMutation();
  const [height, setHeight] = useState(undefined);
  const { isLoading, isSuccess, isError, data, error } = shareListStatus;

  useEffect(() => {
    shareListQuery({ CSRFToken });
    const parentElement = elementRef.current;
    const parentHeight = parentElement.getBoundingClientRect().height;
    setHeight(parentHeight);
  }, []);

  useEffect(() => {
    if (delShareStatus.isSuccess) {
      shareListQuery({ CSRFToken });
    }
  }, [delShareStatus.isSuccess, delShareStatus.data, delShareStatus.isError]);

  return (
    <>
      <div className="w-full h-full flex flex-col justify-start items-center">
        <SharedTabs activeTab={activeTab} setActiveTab={setActiveTab} />
        {activeTab.folders && (
          <SharedTable
            params={{
              ref: elementRef,
              height,
              rows: data,
              isLoading,
              isSuccess,
              isError,
              delShare: delShareQuery,
              CSRFToken,
            }}
          />
        )}
        {activeTab.files && (
          <div className="w-full flex grow justify-center items-center">
            Files
          </div>
        )}
        {activeTab.transfer && (
          <div className="w-full flex grow justify-center items-center">
            Transfer
          </div>
        )}
      </div>
    </>
  );
};
