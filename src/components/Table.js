import React, { useCallback, useEffect, useRef, useState } from "react";
import { ContextIcon } from "./icons/ContextIcon";
import { timeOpts } from "../config";
import { FixedSizeList as List } from "react-window";
import SpinnerGIF from "./icons/SpinnerGIF";
import InfiniteLoader from "react-window-infinite-loader";
import { useRecoilState } from "recoil";
import { itemsSelectedAtom } from "../Recoil/Store/atoms";
import { useDispatch, useSelector } from "react-redux";
import { COPY, MOVE, pageSize, SHARE, DELETE, DOWNLOAD } from "../config.js";
import { UpArrowIcon } from "./icons/UpArrow.js";
import { DownArrowIcon } from "./icons/DownArrow.js";
import "./Table.css";
import CellEdit from "./TableCellEdit.jsx";

import { setOperation } from "../features/operation/operationSlice.jsx";
import { CopyLinkIcon } from "./icons/CopyLinkIcon.js";
import { get_url } from "../util.js";
import { DownloadIcon } from "./icons/DownloadIcon";

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
import FolderDetails from "./folderDetails.jsx";
import { setFolderDetails } from "../features/itemdetails/folderDetailsSlice.js";

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
    const rowArr = Object.entries(rowSelection);
    const selectedArr = rowArr.map(([k, v]) => {
      if (k !== data[index].id) return [k, false];
      else return [k, true];
    });
    const rows = Object.fromEntries(selectedArr);
    dispatch(setRowSelected({ ...rows }));
    dispatch(setShowAllCheckBoxes(true));
    const topOffset = e.currentTarget.offsetHeight + e.currentTarget.offsetTop;
    const leftOffset = e.currentTarget.offsetLeft;
    const height = e.clientY + 250;
    const { bottom } = dims;
    const newX = leftOffset - 125;
    let newY = topOffset;
    if (height > bottom) {
      newY = topOffset - 275;
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
          className={`table-row-container ${
            rowSelection[data[index].id] ? "checkbox-selected" : ""
          }`}
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
            className={`h-full  flex flex-row justify-start items-center text-left ${
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
          <div className="h-full text-left  content-center hidden md:block truncate hide-column">
            <span className="grow text-[#736C64] font-sans text-md">
              {data[index]["size"]}
            </span>
          </div>
          <div className="h-full  text-left content-center hidden md:block truncate hide-column">
            <span className="grow text-[#736C64] font-sans text-md">
              {data[index]["versions"]}
            </span>
          </div>
          <div className="h-full text-left content-center hidden md:block truncate">
            <span className=" text-[#736C64] font-sans text-md ">
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

              <TableContext
                style={{
                  width: 150,
                  top: cords.top,
                  left: cords.left,
                  minHeight: 200,
                  transformOrigin: "top right",
                }}
                open={showContext}
                onClose={() => setShowContext(false)}
                buttonRef={buttonRef}
              ></TableContext>
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
  setSort,
}) => {
  const { height, sort, isSuccess, newDir, isLoading, isError, isFetching } =
    params;
  const ref = useRef(null);
  const [keyDown, setKeyDown] = useState(false);
  const resizeObserver = useRef(null);
  const [selected, setItemsSelection] = useRecoilState(itemsSelectedAtom);
  const { fileIds, directories } = selected;
  const [selectedCount, setSelected] = useState(0);
  const [selectAll, setSelectAll] = useState(false);
  const checkboxRef = useRef(null);
  const isItemLoaded = (index) => !hasNextPage || index < items.length;
  const itemCount = hasNextPage ? items?.length + 1 : items?.length;
  const loadMoreItems = isNextPageLoading ? () => {} : loadNextPage;
  const edit = useSelector((state) => state.rename);
  const operation = useSelector((state) => state.operation);
  const fileDetails = useSelector((state) => state.fileDetails);
  const folderDetails = useSelector((state) => state.folderDetails);
  const { selectedToEdit, rowSelection, reLoad } = useSelector(
    (state) => state.browseItems
  );
  const contextButtonRef = useRef(null);
  const { cord, showContext } = useSelector((state) => state.checkbox);
  const [cords, setCords] = useState({ top: 0, left: 0 });
  const [showContextHeader, setShowContext] = useState(false);

  const [selectionType, setSelectionType] = useState({
    file: undefined,
    folder: undefined,
    multiple: undefined,
  });

  useEffect(() => {
    if (fileIds.length === 1 && directories.length === 0) {
      setSelectionType({ file: true, folder: false, multiple: false });
    } else if (fileIds.length === 0 && directories.length === 1) {
      setSelectionType({ file: false, folder: true, multiple: false });
    } else {
      setSelectionType({ file: false, folder: false, multiple: true });
    }
  }, [fileIds, directories]);

  const handleClick = (e) => {
    setShowContext((prev) => !prev);
    const top = e.currentTarget.offsetTop + e.currentTarget.offsetHeight;
    const left = e.currentTarget.offsetLeft;
    setCords({ top, left });
  };

  const dispatch = useDispatch();

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

  const handleDownload = () => {
    if (selectionType.file) {
      const { file, device, dir, id } = fileIds[0];
      const fileData = { filename: file, directory: dir, device, uuid: id };
      const url = get_url(fileData);
      window.open(url, "_parent");
    } else if (selectionType.folder || selectionType.multiple) {
      dispatch(
        setOperation({
          ...operation,
          type: DOWNLOAD,
          status: "initialized",
          data: { files: fileIds, directories: directories },
        })
      );
    }
  };

  const handleShare = () => {
    dispatch(setOperation({ ...operation, type: SHARE, open: true }));
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
    dispatch(setFolderDetails({ open: false }));
    const { files, folders } = extract_items_from_ids(rowSelection);

    setItemsSelection(() => ({
      fileIds: [...files],
      directories: [...folders],
    }));

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
  }, [rowSelection, checkboxRef.current, selectedCount]);

  useEffect(() => {
    const rowSelectedArr = Object.entries(rowSelection).filter(([k, v]) => v);
    if (
      (selected.fileIds.length === 1 || selected.directories.length === 1) &&
      rowSelectedArr.length === 1
    ) {
      dispatch(setSelectedToEdit(rowSelectedArr[0][0]));
    } else {
      dispatch(setSelectedToEdit(undefined));
      dispatch(setFileDetails({ open: false, file: {} }));
    }
  }, [rowSelection, selected.fileIds, selected.directories]);

  useEffect(() => {
    const { files, folders } = extract_items_from_ids(rowSelection);
    if (fileDetails.open && folders.length > 0) {
      dispatch(setFileDetails({ open: false, file: {} }));
    }
  }, [rowSelection, selectedCount]);

  useEffect(() => {
    if (edit.editStart && selectedToEdit) {
      dispatch(setCellEdit(selectedToEdit));
    }
    if (fileDetails.open && selected.fileIds.length === 1 && selectedToEdit) {
      const selectedRow = items.find((row) => row.id === selectedToEdit);
      dispatch(setFileDetails({ open: true, file: selectedRow }));
    }
  }, [edit, selectedToEdit, selected.fileIds, fileDetails.open, items]);

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
        className="w-full h-full flex justify-center items-center flex-col"
        ref={ref}
      >
        {(isFetching || isSuccess || reLoad) && items?.length === 0 && (
          <div className="w-full flex justify-center items-center grow">
            <span className="font-sans font-semibold text-[#DBDBDB]">
              No Items uploaded
            </span>
          </div>
        )}

        {(isFetching || isSuccess || reLoad) && items?.length > 0 && height && (
          <div className="w-full flex flex-col md:flex-row h-full">
            <div
              className={`h-full flex flex-col ${
                fileDetails.open ? "w-[100%] md:w-[80%]" : "w-[100%]"
              } `}
            >
              <div className="w-full h-[50px] flex justify-end items-center">
                {(fileIds.length > 0 || directories.length > 0) && (
                  <div className="flex flex-row  h-[50px] grow gap-1 justify-start items-center">
                    <button
                      className="w-[140px] h-[30px] flex flex-row justify-center   
                              items-center  text-sm tracking-wider
                              font-semibold
                              rounded
                              hover:bg-[#ECE1CE]
                              bg-[#F5EFE5]
                              hover:overflow-hidden"
                      onClick={handleShare}
                    >
                      <CopyLinkIcon style={{ width: 25, height: 25 }} />
                      Share Selected
                    </button>
                    <button
                      className="w-[110px] h-[30px] justify-center   
                        items-center  text-sm tracking-wider
                        font-semibold
                        gap-1 
                        rounded
                        hover:bg-[#ECE1CE]
                        bg-[#F5EFE5]
                        hover:overflow-hidden
                        hidden sm:flex sm:flex-row
                        "
                      onClick={handleDownload}
                    >
                      <DownloadIcon style={{ width: 25, height: 25 }} />
                      Download
                    </button>
                    <button
                      className={` hover:bg-[#ECE1CE] ${
                        showContextHeader ? "bg-[#F5EFE5]" : ""
                      } h-[30px] w-[30px] flex justify-center items-center bg-[#F5EFE5] rounded`}
                      onClick={handleClick}
                      ref={contextButtonRef}
                    >
                      <ContextIcon style={{ width: 24, height: 24 }} />
                    </button>
                    <TableContext
                      open={showContextHeader}
                      onClose={() => setShowContext(false)}
                      style={{
                        width: 150,
                        top: cords.top,
                        left: cords.left,
                        minHeight: 200,
                        transformOrigin: "top left",
                      }}
                      buttonRef={contextButtonRef}
                    ></TableContext>
                  </div>
                )}

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

              <div className="table-row-container w-full h-[50px] content-center border-b border-[#DBDBDB]">
                <div className=" flex justify-start items-center">
                  <h4 className="text-left font-bold pl-14">Name</h4>
                  {sort === "ASC" && (
                    <UpArrowIcon
                      className={`uparrow-icon ${keyDown ? "clicked" : ""}`}
                      onMouseUp={() => {
                        console.log("key released.");
                        setKeyDown(false);
                        setSort("DSC");
                      }}
                      onMouseDown={() => setKeyDown(true)}
                    />
                  )}
                  {sort === "DSC" && (
                    <DownArrowIcon
                      className={`uparrow-icon ${keyDown ? "clicked" : ""}`}
                      onMouseUp={() => {
                        setKeyDown(false);
                        setSort("ASC");
                      }}
                      onMouseDown={() => setKeyDown(true)}
                    />
                  )}
                </div>
                <h4 className=" text-left  font-bold hidden md:block hide-column">
                  Size
                </h4>
                <h4 className=" text-left  font-bold hidden md:block hide-column">
                  Versions
                </h4>
                <h4 className=" text-left  font-bold hidden md:block">
                  Modified
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
                    itemSize={50}
                    onItemsRendered={onItemsRendered}
                    ref={ref}
                  >
                    {Row}
                  </List>
                )}
              </InfiniteLoader>
            </div>
            {fileDetails.open && <ItemDetails />}
            {folderDetails?.open && <FolderDetails />}
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

      <TableContext
        style={{
          width: 150,
          top: cord.top,
          left: cord.left,
          minHeight: 200,
          overflow: "auto",
          transformOrigin: "top left",
        }}
        open={showContext}
        onClose={() => dispatch(setShowContextMenu(false))}
      />

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
