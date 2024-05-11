import React, { useEffect, useState } from "react";
import { ContextIcon } from "./icons/ContextIcon";
import ContextModal from "./Modal/ContextMenuModal.jsx";
import { ContextButton } from "./Buttons/ContextButton";
import { timeOpts } from "../config";
import { FixedSizeList as List } from "react-window";
import SpinnerGIF from "./icons/SpinnerGIF";
import FolderIcon from "./icons/FolderIcon";
import { Icon } from "./NameCell";
import { getFileExtension, svgIconStyle } from "./fileFormats/FileFormat";
import InfiniteLoader from "react-window-infinite-loader";

const NameCell = ({ item, name, display }) => {
  if (item === "fi") {
    const ext = getFileExtension(name);
    return (
      <div className="w-[50px] h-[50px] flex justify-center items-center">
        <Icon ext={ext} />
      </div>
    );
  } else if (item === "fo") {
    return (
      <div className="w-[50px] h-[50px] flex justify-center items-center">
        <FolderIcon style={svgIconStyle} />
      </div>
    );
  } else if (item === "t" && display === "fo") {
    return (
      <div className="w-[50px] h-[50px] flex justify-center items-center">
        <FolderIcon style={svgIconStyle} />
      </div>
    );
  } else if (item === "t" && display === "fi") {
    const ext = getFileExtension(name);
    return (
      <div className="w-[50px] h-[50px] flex justify-center items-center">
        <Icon ext={ext} />
      </div>
    );
  }
};

const SharedTable = ({
  params,
  hasNextPage,
  isNextPageLoading,
  items,
  loadNextPage,
}) => {
  const {
    height,
    isSuccess,
    isLoading,
    isError,
    ref,
    handleShareDelete,
    handleCopy,
    isFetching,
    rowSelection,
    setRowSelection,
  } = params;

  const [showAllCheckBoxes, setShowAllCheckBoxes] = useState();
  const isItemLoaded = (index) => !hasNextPage || index < items.length;
  const itemCount = hasNextPage ? items?.length + 1 : items?.length;
  const loadMoreItems = isNextPageLoading ? () => {} : loadNextPage;

  useEffect(() => {
    if (items) {
      const arr = items?.map((_, idx) => [idx, false]);
      const obj = Object.fromEntries(arr);
      setRowSelection(obj);
    }
  }, [items]);

  const Row = React.memo(({ index, style }) => {
    const [isHovered, setIsHovered] = useState(false);
    const [cords, setCords] = useState({ top: 0, left: 0 });
    const [showContext, setShowContext] = useState(false);
    const handleClick = (e) => {
      const left = e.currentTarget.offsetLeft - 75;
      const top = e.currentTarget.offsetHeight + e.currentTarget.offsetTop;
      setCords({ top, left });
      setShowContext(true);
    };

    const handleMouseLeave = () => {
      setIsHovered(false);
      setShowContext(false);
    };
    const handleMouseEnter = () => {
      setIsHovered(true);
    };

    const handleCheck = (e) => {
      e.preventDefault();
      e.stopPropagation();
      if (e.target.checked) {
        setShowAllCheckBoxes(true);
        setRowSelection((prev) => ({ ...prev, [index]: true }));
      } else {
        setRowSelection((prev) => {
          const selection = { ...prev, [index]: false };
          const exists = Object.entries(selection).find(([_, v]) => v === true);
          if (exists === undefined) setShowAllCheckBoxes(false);
          else setShowAllCheckBoxes(true);
          return selection;
        });
      }
    };
    if (items[index]) {
      return (
        <div
          className={`grid grid-cols-4 content-center shared-table-row
          ${rowSelection[index] ? "bg-[#DEEBFF]" : "hover:bg-[#E8E8E8]"} `}
          id={`${items[index]["_id"]}`}
          style={{
            ...style,
            borderBottom: "1px solid #DBDBDB",
          }}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <div
            className={`h-full col-span-2 flex flex-row justify-start items-center text-left ${
              showAllCheckBoxes || isHovered ? "" : "pl-[50px]"
            }`}
          >
            {(showAllCheckBoxes || isHovered) && (
              <div className="w-[50px] h-full flex justify-center items-center">
                <input
                  type="checkbox"
                  className="h-[20px] w-[20px] cursor-pointer"
                  onChange={handleCheck}
                  checked={rowSelection[index] ? true : false}
                />
              </div>
            )}
            <NameCell
              name={items[index]["name"]}
              item={items[index]["item"]}
              display={items[index]["display"]}
            />
            <span className="grow text-[#736C64] font-sans text-md">
              {items[index]["name"]}
            </span>
          </div>
          <div className="h-full col-span-1 text-left  content-center">
            <span className="grow text-[#736C64] font-sans text-md">
              {new Date(items[index]["created_at"]).toLocaleString(
                "en-in",
                timeOpts
              )}
            </span>
          </div>
          <div className="h-full col-span-1 text-left content-center">
            <span className="grow text-[#736C64] font-sans text-md">
              {new Date(items[index]["expires_at"]).toLocaleString(
                "en-in",
                timeOpts
              )}
            </span>
          </div>
          {isHovered && (
            <div
              className={`z-[100] absolute h-full right-3 flex justify-center items-center`}
            >
              <button
                className={` hover:bg-[#F5EFE5] ${
                  showContext ? "bg-[#F5EFE5]" : ""
                }`}
                onClick={handleClick}
              >
                <ContextIcon style={{ width: 24, height: 24 }} />
              </button>
              {showContext && (
                <ContextModal
                  style={{
                    width: 100,
                    top: cords.top,
                    left: cords.left,
                  }}
                  open={showContext}
                  onClose={() => setShowContext(false)}
                >
                  <ContextButton onClick={handleShareDelete}>
                    Delete
                  </ContextButton>
                  <ContextButton onClick={handleCopy}>Copy</ContextButton>
                </ContextModal>
              )}
            </div>
          )}
        </div>
      );
    }
  });

  return (
    <div
      className="w-full grow flex flex-col  justify-center items-center"
      ref={ref}
    >
      {(isFetching || isSuccess) && items?.length === 0 && (
        <div className="w-full flex justify-center items-center grow">
          <span className="font-sans font-semibold text-[#DBDBDB]">
            No Items Shared
          </span>
        </div>
      )}
      {(isFetching || isSuccess) && items?.length > 0 && height && (
        <div className="w-full h-[50px] grid grid-cols-4 content-center border-b border-[#DBDBDB] pl-[50px]">
          <h4 className="col-span-2 text-left pl-2 font-bold">Name</h4>
          <h4 className="col-span-1 text-left pl-2 font-bold">Created On</h4>
          <h4 className="col-span-1 text-left pl-2 font-bold">Expires On</h4>
        </div>
      )}

      {(isFetching || isSuccess) && items?.length > 0 && height && (
        <InfiniteLoader
          isItemLoaded={isItemLoaded}
          itemCount={10000}
          loadMoreItems={loadMoreItems}
          threshold={1}
          minimumBatchSize={50}
        >
          {({ onItemsRendered, ref }) => (
            <List
              height={height - 50}
              width={"100%"}
              itemCount={itemCount}
              itemSize={50}
              // itemData={items}
              onItemsRendered={onItemsRendered}
              ref={ref}
            >
              {Row}
            </List>
          )}
        </InfiniteLoader>
      )}
      {!isFetching && isLoading && (
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
  );
};

export default SharedTable;
