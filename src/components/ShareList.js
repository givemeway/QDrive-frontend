import React, { useCallback, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  useDeleteShareMutation,
  useGetSharesMutation,
} from "../features/api/apiSlice";

import SharedTabs from "./SharedTab.js";
import SharedTable from "./SharedTable.js";
import "./ShareList.css";
import { setOperation } from "../features/operation/operationSlice.jsx";
import { COPYSHARE } from "../config.js";
import TableContext from "./context/TableContext.js";
const tabs = { folders: true, files: false, transfer: false };

export const ShareList = () => {
  const dispatch = useDispatch();
  const [rowSelection, setRowSelection] = useState({});

  const { CSRFToken } = useSelector((state) => state.csrfToken);
  // const { rowSelection } = useSelector((state) => state.sharedTable);
  const [cord, setCord] = useState({ x: 0, y: 0 });
  const [showContext, setShowContext] = useState(false);
  const shareListRef = useRef(null);

  const operation = useSelector((state) => state.operation);
  const [isFetching, setIsFetching] = useState(false);
  const [activeTab, setActiveTab] = useState(tabs);
  const elementRef = useRef(null);
  const [shareListQuery, shareListStatus] = useGetSharesMutation();
  const [delShareQuery, delShareStatus] = useDeleteShareMutation();
  const [height, setHeight] = useState(undefined);
  const { isLoading, isSuccess, isError, data, error } = shareListStatus;
  const pagination = useRef({ start: 0, page: 50 });
  const [type, setType] = useState("fo");
  const [tabSwitched, setTabSwitched] = useState(false);
  const [state, setState] = useState({
    hasNextPage: true,
    isNextPageLoading: false,
    total: 0,
    items: [],
  });

  const handleContextClose = () => {
    setShowContext(false);
  };

  const handleShareDelete = (e) => {
    const id = e.target.closest(".shared-table-row").id;
    delShareQuery({ id, CSRFToken, type: type });
  };

  const handleCopy = (e) => {
    const id = e.target.closest(".shared-table-row").id;
    dispatch(
      setOperation({
        ...operation,
        type: COPYSHARE,
        status: "initialized",
        data: { id, CSRFToken, type: type },
      })
    );
  };

  const handleContext = (e) => {
    setShowContext(true);
    if (shareListRef.current) {
      const { bottom, right } = shareListRef.current.getBoundingClientRect();
      const x = e.clientX;
      const y = e.clientY;
      const width = x + 150;
      const height = y + 200;
      let newX = 0;
      let newY = 0;
      if (width > right && height < bottom) {
        newX = right - 150;
        newY = e.clientY;
      } else if (width > right && height > bottom) {
        newX = right - 160;
        newY = bottom - 220;
      } else if (height > bottom) {
        newX = e.clientX;
        newY = bottom - 220;
      } else {
        newX = x;
        newY = y;
      }
      setCord({ x: newX, y: newY });
    }
  };

  const _loadNextPage = useCallback(
    (...args) => {
      console.log("next page fetching......", args, state.items.length);
      setIsFetching(true);
      if (state.items.length < state.total) {
        setState((prev) => ({ ...prev, hasNextPage: true }));
        pagination.current.start = args[0];
        pagination.current.page = args[1] - args[0];
        const data = {
          CSRFToken,
          start: args[0],
          page: args[1] - args[0],
          type: type,
        };

        shareListQuery(data);
      } else {
        console.log("reached end");
        setState((prev) => ({ ...prev, hasNextPage: false }));
      }
    },
    [state.hasNextPage, state.isNextPageLoading, type]
  );

  useEffect(() => {
    if (isLoading) {
      setState((prev) => ({ ...prev, isNextPageLoading: true }));
    }
  }, [isLoading]);

  useEffect(() => {
    setIsFetching(false);
    setTabSwitched(false);

    const data = {
      CSRFToken,
      start: 0,
      page: pagination.current.page,
      type: type,
    };
    shareListQuery(data);
    const parentElement = elementRef.current;
    const parentHeight = parentElement.getBoundingClientRect().height;
    setHeight(parentHeight);
  }, []);

  useEffect(() => {
    if (delShareStatus.isSuccess) {
      setIsFetching(false);
      const data = {
        CSRFToken,
        start: 0,
        page: pagination.current.page,
        type: type,
      };
      shareListQuery(data);
    }
  }, [
    delShareStatus.isSuccess,
    delShareStatus.data,
    delShareStatus.isError,
    type,
  ]);

  useEffect(() => {
    if (data && isSuccess && (delShareStatus.isSuccess || tabSwitched)) {
      setState(() => ({
        isNextPageLoading: false,
        hasNextPage: true,
        total: data.total,
        items: [...data.items],
      }));
    }
    if (data && isSuccess && !(delShareStatus.isSuccess || tabSwitched)) {
      setState((prev) => ({
        ...prev,
        isNextPageLoading: false,
        total: data.total,
        items: [...prev.items, ...data.items],
      }));
    }
  }, [isSuccess, data, delShareStatus.isSuccess]);

  useEffect(() => {
    if (activeTab.folders) {
      setType("fo");
      setTabSwitched(true);
    } else if (activeTab.files) {
      setType("fi");
      setTabSwitched(true);
    } else if (activeTab.transfer) {
      setType("t");
      setTabSwitched(true);
    }
  }, [activeTab.folders, activeTab.files, activeTab.transfer]);

  useEffect(() => {
    setIsFetching(false);
    const data = {
      CSRFToken,
      start: 0,
      page: pagination.current.page,
      type: type,
    };
    shareListQuery(data);
  }, [type]);

  return (
    <>
      <div
        className="w-full h-full flex flex-col justify-start items-center"
        ref={shareListRef}
      >
        <SharedTabs activeTab={activeTab} setActiveTab={setActiveTab} />

        <SharedTable
          params={{
            ref: elementRef,
            height,
            isLoading,
            isSuccess,
            isError,
            isFetching,
            handleShareDelete,
            handleCopy,
            handleContext,
            rowSelection,
            setRowSelection,
            CSRFToken,
          }}
          hasNextPage={state.hasNextPage}
          isNextPageLoading={state.isNextPageLoading}
          items={state.items}
          loadNextPage={_loadNextPage}
        />
      </div>
      {showContext && (
        <TableContext
          style={{ top: cord.y, left: cord.x }}
          open={showContext}
          onClose={handleContextClose}
        />
      )}
    </>
  );
};
