import React, { useCallback, useEffect, useRef, useState } from "react";
import { ContextIcon } from "./icons/ContextIcon";
import ContextModal from "./Modal/ContextMenuModal.jsx";
import { ContextButton } from "./Buttons/ContextButton";
import { timeOpts } from "../config";
import { FixedSizeList as List } from "react-window";
import SpinnerGIF from "./icons/SpinnerGIF";
import InfiniteLoader from "react-window-infinite-loader";
import { useRecoilState } from "recoil";
import { itemsSelectedAtom } from "../Recoil/Store/atoms";
import { useDispatch, useSelector } from "react-redux";
import { COPY, MOVE, pageSize, SHARE, DELETE } from "../config.js";
import CellEdit from "./TableCellEdit.jsx";

import { setOperation } from "../features/operation/operationSlice.jsx";

import RenderNameCell from "./NameCell.jsx";

import TableContext from "./context/TableContext.js";
import Modal from "./Modal";
import { closeOperation } from "../features/operation/operationSlice.jsx";
import { DeleteModal } from "./Modal/DeleteModal.js";
import ShareModal from "./Modal/ShareModal.jsx";
import ItemDetails from "./ItemDetails.jsx";
import { setFileDetails } from "../features/itemdetails/fileDetails.Slice.jsx";
import {
  setSelectedToEdit,
  setRowSelected,
  setLayout,
  setUrlPath,
  setCellEdit,
} from "../features/browseItems/browseItemsSlice.js";
import { extract_items_from_ids } from "../util.js";
import {
  setCord,
  setShowAllCheckBoxes,
  setShowContextMenu,
  setDims,
} from "../features/table/checkboxSlice.js";

const deselectAllSelectClickedRow = (rows, id) => {
  const selectedRows = Object.entries(rows).filter(([_, v]) => v);
  const contextRow = selectedRows.filter(([k, _]) => k === id);
  if (selectedRows.length > 1 && contextRow.length > 0) {
    return { ...rows };
  } else {
    const unselectedArr = Object.entries(rows).filter((item) => item.id !== id);
    const unselectedObj = Object.fromEntries(
      unselectedArr.map((item) => [item.id, false])
    );

    return { ...unselectedObj, [id]: true };
  }
};

const Row = React.memo(({ index, data, style }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [cords, setCords] = useState({ top: 0, left: 0 });
  const [showContext, setShowContext] = useState(false);
  const { rowSelection, cellEdit, layout, urlPath } = useSelector(
    (state) => state.browseItems
  );
  const { showAllCheckBoxes, dims } = useSelector((state) => state.checkbox);
  const buttonRef = useRef();
  const dispatch = useDispatch();

  const contextMenu = (e, row) => {
    e.stopPropagation();
    e.preventDefault();
    const selectedRows = deselectAllSelectClickedRow(rowSelection, row.id);
    dispatch(setRowSelected(selectedRows));
    dispatch(setShowContextMenu(true));
    dispatch(setShowAllCheckBoxes(true));
    const { bottom, right } = dims;
    const x = e.clientX;
    const y = e.clientY;
    const width = x + 150;
    const height = y + 200;
    let newX = 0;
    let newY = 0;
    if (width > right && height < bottom) {
      newX = right - 160;
      newY = y;
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
    dispatch(setCord({ left: newX, top: newY }));
  };

  const handleClick = (e) => {
    e.stopPropagation();
    setShowContext((prev) => !prev);
    const topOffset = e.currentTarget.offsetHeight + e.currentTarget.offsetTop;
    const leftOffset = e.currentTarget.offsetLeft;
    const height = e.clientY + 200;
    const { bottom } = dims;
    const newX = leftOffset - 125;
    let newY = topOffset;
    if (height > bottom) {
      newY = topOffset - 225;
      console.log(newY);
    }
    setCords({ top: newY, left: newX });
  };
  const handleMouseLeave = () => {
    setIsHovered(false);
    setShowContext(false);
  };
  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleRowClick = (e) => {
    dispatch(
      setRowSelected(deselectAllSelectClickedRow(rowSelection, data[index].id))
    );
    dispatch(setShowAllCheckBoxes(true));
  };

  const handleCheck = (e) => {
    if (e.target.checked) {
      dispatch(setShowAllCheckBoxes(true));
      dispatch(setRowSelected({ ...rowSelection, [data[index].id]: true }));
    } else {
      const selection = { ...rowSelection, [data[index].id]: false };
      const exists = Object.entries(selection).find(([_, v]) => v === true);
      if (exists === undefined) dispatch(setShowAllCheckBoxes(false));
      else dispatch(setShowAllCheckBoxes(true));

      dispatch(setRowSelected(selection));
    }
  };

  if (data[index]) {
    const { id, name, thumbURL, path, item, url } = data[index];
    return (
      <>
        <div
          className={`grid grid-cols-2 md:grid-cols-5 
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
          }}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          onContextMenu={(e) => contextMenu(e, data[index])}
          onClick={handleRowClick}
        >
          <div
            className={`h-full col-span-2 flex flex-row justify-start items-center text-left ${
              showAllCheckBoxes || isHovered ? "" : "pl-[50px]"
            }`}
          >
            {(showAllCheckBoxes || isHovered) && (
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
            {cellEdit !== data[index].id && (
              <RenderNameCell
                rowID={id}
                rowPath={path}
                rowName={name}
                item={item}
                layout={layout}
                thumbURL={thumbURL}
                path={urlPath}
                url={url}
              />
            )}
            {cellEdit === data[index].id && (
              <CellEdit
                row={data[index]}
                setEditingCell={() => {
                  dispatch(setCellEdit(null));
                }}
              />
            )}
          </div>
          <div className="h-full col-span-1 text-left  content-center hidden md:block">
            <span className="grow text-[#736C64] font-sans text-md">
              {data[index]["size"]}
            </span>
          </div>
          <div className="h-full col-span-1 text-left content-center hidden md:block">
            <span className="grow text-[#736C64] font-sans text-md">
              {data[index]["versions"]}
            </span>
          </div>
          <div className="h-full col-span-1 text-left content-center hidden md:block">
            <span className="grow text-[#736C64] font-sans text-md">
              {new Date(data[index]["last_modified"]).toLocaleString(
                "en-in",
                timeOpts
              )}
            </span>
          </div>
          {isHovered && (
            <div
              className={`z-[100] absolute h-full right-5 flex justify-center items-center`}
            >
              <button
                className={` hover:bg-[#F5EFE5] ${
                  showContext ? "bg-[#F5EFE5]" : ""
                }`}
                onClick={handleClick}
                ref={buttonRef}
              >
                <ContextIcon style={{ width: 24, height: 24 }} />
              </button>
              {showContext && (
                <TableContext
                  style={{
                    width: 150,
                    top: cords.top,
                    left: cords.left,
                    height: 200,
                  }}
                  open={showContext}
                  onClose={() => setShowContext(false)}
                  buttonRef={buttonRef}
                ></TableContext>
              )}
            </div>
          )}
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
  layout,
  urlPath,
}) => {
  const { height, isSuccess, newDir, isLoading, isError, isFetching } = params;
  const ref = useRef(null);
  const resizeObserver = useRef(null);
  const [selected, setItemsSelection] = useRecoilState(itemsSelectedAtom);
  const [selectedCount, setSelected] = useState(0);
  const [selectAll, setSelectAll] = useState(false);
  const checkboxRef = useRef(null);
  const isItemLoaded = (index) => !hasNextPage || index < items.length;
  const itemCount = hasNextPage ? items?.length + 1 : items?.length;
  const loadMoreItems = isNextPageLoading ? () => {} : loadNextPage;
  const edit = useSelector((state) => state.rename);
  const operation = useSelector((state) => state.operation);
  const fileDetails = useSelector((state) => state.fileDetails);
  const { selectedToEdit, rowSelection, reLoad } = useSelector(
    (state) => state.browseItems
  );
  const { cord, showContext } = useSelector((state) => state.checkbox);

  const dispatch = useDispatch();
  console.log("table rendered");

  const getBoundingClientRect = useCallback(() => {
    const { bottom, right, left, top } = ref.current.getBoundingClientRect();
    dispatch(setDims({ bottom, right, left, top }));
    dispatch(setLayout(layout));
    dispatch(setUrlPath(urlPath));
  }, [ref.current, layout, urlPath]);

  const onDeleteSubmit = () => {
    const body = {
      fileIds: selected.fileIds,
      directories: selected.directories,
    };
    dispatch(
      setOperation({
        ...operation,
        type: DELETE,
        status: "initialized",
        data: body,
        open: false,
      })
    );
  };

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectAll(true);
      dispatch(setShowAllCheckBoxes(true));
      const arr = items?.map((item) => [item.id, true]);
      const obj = Object.fromEntries(arr);
      dispatch(setRowSelected(obj));
    } else {
      setSelectAll(false);
      dispatch(setShowAllCheckBoxes(false));
      const arr = items?.map((item) => [item.id, false]);
      const obj = Object.fromEntries(arr);
      dispatch(setRowSelected(obj));
    }
  };

  useEffect(() => {
    if (items && !newDir) {
      const arr = items?.map((item) => [
        item.id,
        rowSelection[item.id] ? rowSelection[item.id] : false,
      ]);
      const obj = Object.fromEntries(arr);
      dispatch(setRowSelected({ ...rowSelection, ...obj }));
    } else if (items && newDir) {
      const arr = items?.map((item) => [item.id, false]);
      const obj = Object.fromEntries(arr);
      dispatch(setRowSelected(obj));
    }
  }, [items, newDir]);

  useEffect(() => {
    const rows = Object.entries(rowSelection);
    const selectedCount = rows.filter(([_, v]) => v);
    setSelected(selectedCount.length);
    dispatch(setRowSelected(rowSelection));

    const { files, folders } = extract_items_from_ids(rowSelection);

    setItemsSelection(() => ({
      fileIds: [...files],
      directories: [...folders],
    }));
    const rowSelectedArr = Object.entries(rowSelection).filter(([k, v]) => v);
    if (rowSelectedArr.length === 1) {
      dispatch(setSelectedToEdit(rowSelectedArr[0][0]));
      if (files.length === 1 && fileDetails.open) {
        const selectedRow = items.find((row) => row.id === selectedToEdit);
        dispatch(setFileDetails({ open: true, file: selectedRow }));
      }
    } else {
      dispatch(setSelectedToEdit(undefined));
      dispatch(setFileDetails({ open: false, file: {} }));
    }

    if (selectedCount.length === 0) {
      setSelectAll(false);
      if (checkboxRef.current) {
        checkboxRef.current.indeterminate = false;
      }
    } else if (selectedCount.length < rows.length) {
      if (checkboxRef.current) {
        checkboxRef.current.indeterminate = true;
      }
    } else if (selectedCount.length === rows.length) {
      setSelectAll(true);
      if (checkboxRef.current) {
        checkboxRef.current.indeterminate = false;
      }
    }
  }, [rowSelection, checkboxRef.current]);

  useEffect(() => {
    if (edit.editStart && selectedToEdit) {
      dispatch(setCellEdit(selectedToEdit));
    }
  }, [edit, selectedToEdit]);

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
        className="w-full grow flex flex-col justify-center items-center"
        ref={ref}
      >
        {(isFetching || isSuccess || reLoad) && items?.length === 0 && (
          <div className="w-full flex justify-center items-center grow">
            <span className="font-sans font-semibold text-[#DBDBDB]">
              No Items Shared
            </span>
          </div>
        )}

        {(isFetching || isSuccess || reLoad) && items?.length > 0 && height && (
          <div className="w-full h-[30px] flex justify-end items-center">
            {selectedCount > 0 && (
              <span className="font-sans font-semibold text-md">
                {selectedCount} Selected
              </span>
            )}
            <div className="w-[50px] h-full flex justify-center items-center">
              <input
                type="checkbox"
                className="h-[20px] w-[20px] cursor-pointer pr-2"
                onChange={handleSelectAll}
                checked={selectAll}
                ref={checkboxRef}
              ></input>
            </div>
          </div>
        )}
        {(isFetching || isSuccess || reLoad) && items?.length > 0 && height && (
          <div className="w-full h-[50px] grid grid-cols-2 md:grid-cols-5 content-center border-b border-[#DBDBDB]">
            <div className="col-span-2 flex justify-start items-center">
              <div className="w-[50px] h-full flex justify-center items-center"></div>
              <h4 className="text-left pl-2 font-bold">Name</h4>
            </div>
            <h4 className="col-span-1 text-left pl-2 font-bold hidden md:block">
              Size
            </h4>
            <h4 className="col-span-1 text-left pl-2 font-bold hidden md:block">
              Versions
            </h4>
            <h4 className="col-span-1 text-left pl-2 font-bold hidden md:block">
              Modified
            </h4>
          </div>
        )}
        {(isFetching || isSuccess || reLoad) && items?.length > 0 && height && (
          <InfiniteLoader
            isItemLoaded={isItemLoaded}
            itemCount={10000000}
            loadMoreItems={loadMoreItems}
            threshold={2}
            minimumBatchSize={pageSize}
          >
            {({ onItemsRendered, ref }) => (
              <List
                height={isFetching ? height - 130 : height - 90}
                width={"100%"}
                itemCount={itemCount}
                itemData={items}
                itemSize={50}
                onItemsRendered={onItemsRendered}
                ref={ref}
              >
                {Row}
              </List>
            )}
          </InfiniteLoader>
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
      {fileDetails.open && <ItemDetails />}
      {showContext && (
        <TableContext
          style={{
            top: cord.top,
            left: cord.left,
            height: 200,
            overflow: "auto",
          }}
          open={showContext}
          onClose={() => dispatch(setShowContextMenu(false))}
        />
      )}
      {operation.type === COPY && (
        <Modal
          mode={COPY}
          open={operation.open}
          onClose={() => dispatch(closeOperation(COPY))}
        />
      )}
      {operation.type === MOVE && (
        <Modal
          mode={MOVE}
          open={operation.open}
          onClose={() => dispatch(closeOperation(MOVE))}
        />
      )}
      {operation.type === SHARE && (
        <ShareModal
          open={operation.open}
          onClose={() => dispatch(closeOperation(SHARE))}
        />
      )}
      {operation.type === DELETE && (
        <DeleteModal
          title={"Delete Items"}
          content={"Are you sure you want to delete Items?"}
          open={operation.open}
          onClose={() => dispatch(closeOperation(DELETE))}
          onSubmit={onDeleteSubmit}
        />
      )}
    </>
  );
};

export default React.memo(SharedTable);
