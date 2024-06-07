import React, { useCallback, useEffect, useRef, useState } from "react";
import { timeOpts } from "../config";
import { FixedSizeList as List } from "react-window";
import SpinnerGIF from "./icons/SpinnerGIF";
import InfiniteLoader from "react-window-infinite-loader";
import { useDispatch, useSelector } from "react-redux";
import { pageSize } from "../config.js";
import FolderIcon from "./icons/FolderIcon.js";
import FileIcon from "./icons/FileIcon.js";
import CollapsibleBreadCrumbs from "./breadCrumbs/CollapsibleBreadCrumbs.js";
import BulkTrashModal from "./Modal/BulkTrashModal";
import BulkTrashDeleteModal from "./Modal/BulkTrashDeleteModal";
import { Button, Typography } from "@mui/material";
import DeleteForeverIcon from "@mui/icons-material/DeleteForeverSharp";

import { setRowSelected } from "../features/browseItems/browseItemsSlice.js";

import {
  setShowAllCheckBoxes,
  setDims,
} from "../features/table/checkboxSlice.js";
import {
  setBatchTrashOpen,
  setSelectedTrashBatch,
  setSelectedTrashItems,
  setTrashBulkBatchDeleteOpen,
  setTrashBulkBatchRestoreOpen,
} from "../features/trash/selectedTrashBatch.jsx";
import TrashModal from "./Modal/TrashModal.js";

const restoreButtonStyle = {
  textTransform: "none",
  width: 200,
  ":hover": {
    background: "#004DC7",
  },
  background: "#0061FE",
  borderRadius: 0,
  boxShadow: "none",
  fontWeight: 600,
};

const deleteButtonStyle = {
  textTransform: "none",
  background: "transparent",
  position: "relative",
  margin: 0,
  padding: 0,
  "&::after": {
    content: '""',
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: "1px",
    background: "rgb(187,181,174)",
  },
  "&:hover::after": {
    background: "black",
  },
  ":hover": {
    background: "transparent",
  },
  width: 200,
  color: "black",
  fontWeight: 600,
};

const NameCell = ({ row }) => {
  if (row.item === "folder")
    return (
      <div className="flex flex-col justify-start items-center">
        <div className="flex justify-start items-center w-full">
          <FolderIcon style={{ width: 25, height: 25 }} />

          <span className="text-left">{row.name}</span>
        </div>
        <div className="w-full pl-[4px]">
          <CollapsibleBreadCrumbs path={row.path} id={row.id} />
        </div>
      </div>
    );
  return (
    <div className="flex flex-col justify-start items-center">
      <div className="flex justify-start items-center">
        <FileIcon style={{ width: 25, height: 25 }} />
        {row.name}
      </div>
      <div className="w-full pl-[4px]">
        <CollapsibleBreadCrumbs path={row.path} id={row.id} />
      </div>
    </div>
  );
};

const Row = React.memo(({ index, data, style }) => {
  const { rowSelection } = useSelector((state) => state.browseItems);
  const { showAllCheckBoxes } = useSelector((state) => state.checkbox);
  const [isHover, setIsHover] = useState(false);
  const dispatch = useDispatch();

  const updateRow = (prev, row, rows) => {
    const selectedRows = Object.entries(prev).filter(([k, v]) => v);
    if (selectedRows.length > 0) {
      const uncheckedClickedRows = Object.entries(prev).map(([k, v]) => {
        if (k === row.id) return [k, false];
        else return [k, v];
      });
      dispatch(setRowSelected(Object.fromEntries(uncheckedClickedRows)));
      dispatch(setShowAllCheckBoxes(true));
      dispatch(setBatchTrashOpen(false));
      const selectedRowsObj = Object.fromEntries(uncheckedClickedRows);
      const selectedBulkItemsArr = rows.filter(
        (item) => selectedRowsObj[item.id]
      );
      dispatch(setSelectedTrashItems([...selectedBulkItemsArr]));
    } else if (selectedRows.length === 0) {
      dispatch(setBatchTrashOpen(true));
      dispatch(setSelectedTrashBatch({ ...row }));
      dispatch(setShowAllCheckBoxes(false));
    }
  };

  const handleRowClick = (e) => {
    e.stopPropagation();
    updateRow(rowSelection, data[index], data);
  };

  const handleCheck = (e) => {
    if (e.target.checked) {
      dispatch(setShowAllCheckBoxes(true));
      const selectedRowObj = { ...rowSelection, [data[index].id]: true };
      dispatch(setRowSelected(selectedRowObj));
      const selectedBulkItemsArr = data.filter(
        (item) => selectedRowObj[item.id]
      );
      dispatch(setSelectedTrashItems([...selectedBulkItemsArr]));
    } else {
      const selection = { ...rowSelection, [data[index].id]: false };
      const exists = Object.entries(selection).find(([_, v]) => v === true);
      if (exists === undefined) dispatch(setShowAllCheckBoxes(false));
      else {
        dispatch(setShowAllCheckBoxes(true));
        const selectedBulkItemsArr = data.filter((item) => selection[item.id]);
        dispatch(setSelectedTrashItems([...selectedBulkItemsArr]));
      }
      dispatch(setRowSelected(selection));
    }
  };

  if (data[index]) {
    return (
      <>
        <div
          className={`grid grid-cols-2 md:grid-cols-3 
                    content-center shared-table-row
                    ${
                      rowSelection[data[index].id]
                        ? "bg-[#DEEBFF]"
                        : "hover:bg-[#E8E8E8]"
                    } 
                `}
          id={`${data[index]["id"]}`}
          style={{
            ...style,
            borderBottom: "1px solid #DBDBDB",
            cursor: "pointer",
          }}
          onClick={handleRowClick}
          onMouseEnter={() => setIsHover(true)}
          onMouseLeave={() => setIsHover(false)}
        >
          <div
            className={`h-full col-span-2 flex flex-row justify-start items-center text-left ${
              showAllCheckBoxes || isHover ? "" : "pl-[50px]"
            }`}
          >
            {(showAllCheckBoxes || isHover) && (
              <div
                className={`w-[50px] h-full flex justify-center items-center`}
              >
                <input
                  type="checkbox"
                  className={`h-[20px] w-[20px] cursor-pointer `}
                  onChange={handleCheck}
                  checked={rowSelection[data[index].id] ? true : false}
                  onClick={(e) => e.stopPropagation()}
                />
              </div>
            )}

            <NameCell row={data[index]} />
          </div>

          <div className="h-full col-span-1 text-left content-center hidden md:block">
            <span className="grow text-[#736C64] font-sans text-md">
              {new Date(data[index]["deleted"]).toLocaleString(
                "en-in",
                timeOpts
              )}
            </span>
          </div>
        </div>
      </>
    );
  }
});

const SharedTable = ({
  params,
  hasNextPage,
  isNextPageLoading,
  items,
  loadNextPage,
}) => {
  const { height, isSuccess, isLoading, isError, isFetching } = params;

  const ref = useRef(null);
  const resizeObserver = useRef(null);
  const [selectedCount, setSelected] = useState(0);
  const [showRestoreButton, setShowRestoreButton] = React.useState(false);

  const isItemLoaded = (index) => !hasNextPage || index < items.length;
  const itemCount = hasNextPage ? items?.length + 1 : items?.length;
  const loadMoreItems = isNextPageLoading ? () => {} : loadNextPage;
  const { rowSelection, reLoad } = useSelector((state) => state.browseItems);
  const {
    isTrashBatchOpen,
    isTrashBulkBatchDeleteOpen,
    isTrashBulkBatchRestoreOpen,
  } = useSelector((state) => state.selectedTrashBatch);
  const dispatch = useDispatch();
  console.log("table rendered");

  const getBoundingClientRect = useCallback(() => {
    const { bottom, right, left, top } = ref.current.getBoundingClientRect();
    dispatch(setDims({ bottom, right, left, top }));
  }, [ref.current]);

  useEffect(() => {
    if (items) {
      const arr = items?.map((item) => [
        item.id,
        rowSelection[item.id] ? rowSelection[item.id] : false,
      ]);
      const obj = Object.fromEntries(arr);
      dispatch(setRowSelected({ ...obj }));
    }
  }, [items]);

  useEffect(() => {
    const rows = Object.entries(rowSelection);
    const selectedCount = rows.filter(([_, v]) => v);
    setSelected(selectedCount.length);
    dispatch(setRowSelected(rowSelection));

    if (selectedCount.length === 0) {
      setShowRestoreButton(false);
    } else if (selectedCount.length < rows.length) {
      setShowRestoreButton(true);
    } else if (selectedCount.length === rows.length) {
      setShowRestoreButton(true);
    }
  }, [rowSelection, selectedCount]);

  useEffect(() => {
    if (ref.current && resizeObserver.current) {
      resizeObserver.current.observe(ref.current);
      getBoundingClientRect();
    }
  }, [ref.current]);

  useEffect(() => {
    resizeObserver.current = new ResizeObserver(() => {
      if (ref.current) {
        getBoundingClientRect();
      }
    });
    return () => {
      if (resizeObserver.current) {
        resizeObserver.current.disconnect();
      }
    };
  }, []);

  return (
    <>
      <div
        className={`w-full h-full flex justify-center items-center flex-row `}
        ref={ref}
      >
        {(isFetching || isSuccess || reLoad) && items?.length === 0 && (
          <div className="w-full flex justify-center items-center grow">
            <span className="font-sans font-semibold text-[#DBDBDB]">
              No Deleted Items
            </span>
          </div>
        )}

        {(isFetching || isSuccess || reLoad) && items?.length > 0 && height && (
          <div
            className={`${
              showRestoreButton ? "w-[70%]" : "w-full"
            } flex flex-col md:flex-row h-full`}
          >
            <div className={`h-full flex flex-col w-[100%]`}>
              <div className="w-full h-[50px] grid grid-cols-2 md:grid-cols-3 content-center border-b border-[#DBDBDB]">
                <div className="col-span-2 flex justify-start items-center">
                  <div className="w-[50px] h-full flex justify-center items-center"></div>
                  <h4 className="text-left pl-2 font-bold">Name</h4>
                </div>
                <h4 className="col-span-1 text-left pl-2 font-bold hidden md:block">
                  Deleted
                </h4>
              </div>
              <InfiniteLoader
                isItemLoaded={isItemLoaded}
                itemCount={10000000}
                loadMoreItems={loadMoreItems}
                threshold={2}
                minimumBatchSize={pageSize}
              >
                {({ onItemsRendered, ref }) => (
                  <List
                    height={isFetching ? height - 150 : height - 100}
                    width={"100%"}
                    itemCount={itemCount}
                    itemData={items}
                    itemSize={75}
                    onItemsRendered={onItemsRendered}
                    ref={ref}
                  >
                    {Row}
                  </List>
                )}
              </InfiniteLoader>
            </div>
          </div>
        )}
        {showRestoreButton && (
          <div className="w-[30%] flex flex-col justify-start items-center h-full p-l-4">
            <Typography align="center">
              {Object.entries(rowSelection).filter(([k, v]) => v).length} item
              selected
            </Typography>
            <Button
              variant="contained"
              sx={restoreButtonStyle}
              disableElevation
              onClick={() => dispatch(setTrashBulkBatchRestoreOpen(true))}
            >
              Restore
            </Button>
            <Button
              variant="text"
              sx={deleteButtonStyle}
              startIcon={<DeleteForeverIcon />}
              onClick={() => dispatch(setTrashBulkBatchDeleteOpen(true))}
            >
              Permanently delete
            </Button>
          </div>
        )}

        {isFetching && <SpinnerGIF style={{ height: 50, width: 50 }} />}
        {!isFetching && isLoading && !reLoad && (
          <SpinnerGIF style={{ height: 50, width: 50 }} />
        )}
        {isError && (
          <div className="w-full flex justify-center items-center grow">
            <h2 className="font-sans font-semibold text-[#ff5050]">
              Something Went wrong
            </h2>
          </div>
        )}
      </div>
      {isTrashBatchOpen && <TrashModal />}
      {isTrashBulkBatchDeleteOpen && <BulkTrashDeleteModal />}
      {isTrashBulkBatchRestoreOpen && <BulkTrashModal />}
    </>
  );
};

export default React.memo(SharedTable);
