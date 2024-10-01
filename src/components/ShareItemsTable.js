import React, { useCallback, useEffect, useRef, useState } from "react";
import { ContextIcon } from "./icons/ContextIcon";
import { timeOpts } from "../config";
import { FixedSizeList as List } from "react-window";
import SpinnerGIF from "./icons/SpinnerGIF";
import InfiniteLoader from "react-window-infinite-loader";
import { useDispatch, useSelector } from "react-redux";
import { pageSize } from "../config.js";
import RenderNameCell from "./NameCell.jsx";
import TableContext from "./context/ShareContext.js";
import ItemDetails from "./ItemDetails.jsx";
import {
  setLayout,
  setUrlPath,
  setNav,
} from "../features/browseItems/browseItemsSlice.js";
import { setDims } from "../features/table/checkboxSlice.js";
import {
  setFilesSelected,
  setFoldersSelected,
} from "../features/selectedRows/selectedRowsSlice.js";
import { extract_items_from_ids } from "../util.js";

const Row = React.memo(({ index, data, style }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [cords, setCords] = useState({ top: 0, left: 0 });
  const [showContext, setShowContext] = useState(false);
  const { layout, urlPath, nav } = useSelector((state) => state.browseItems);
  const { dims } = useSelector((state) => state.checkbox);
  const buttonRef = useRef();
  const dispatch = useDispatch();

  const handleClick = (e) => {
    e.stopPropagation();
    const id = e.currentTarget.closest("[id]").getAttribute("id");
    const { files, folders } = extract_items_from_ids({ [id]: true });
    dispatch(setFoldersSelected(folders));
    dispatch(setFilesSelected(files));

    setShowContext((prev) => !prev);
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

  if (data[index]) {
    const { id, name, thumbURL, path, item, url } = data[index];
    return (
      <div
        className={`grid grid-cols-2 md:grid-cols-5 
                    content-center shared-table-row hover:bg-[#E8E8E8]`}
        id={`${data[index]["id"]}`}
        style={{
          ...style,
          borderBottom: "1px solid #DBDBDB",
        }}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <div
          className={`h-full col-span-2 flex flex-row justify-start items-center text-left`}
        >
          <RenderNameCell
            rowID={id}
            rowPath={path}
            rowName={name}
            item={item}
            layout={layout}
            thumbURL={thumbURL}
            path={urlPath}
            url={url}
            nav={nav}
          />
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
                  // height: 100,
                }}
                open={showContext}
                onClose={() => setShowContext(false)}
                buttonRef={buttonRef}
              ></TableContext>
            )}
          </div>
        )}
      </div>
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
  const { height, isSuccess, isLoading, isError, isFetching, nav } = params;
  const ref = useRef(null);
  const resizeObserver = useRef(null);
  const isItemLoaded = (index) => !hasNextPage || index < items.length;
  const itemCount = hasNextPage ? items?.length + 1 : items?.length;
  const loadMoreItems = isNextPageLoading ? () => {} : loadNextPage;
  const fileDetails = useSelector((state) => state.fileDetails);
  const { reLoad } = useSelector((state) => state.browseItems);

  const dispatch = useDispatch();
  console.log("share table rendered");
  const getBoundingClientRect = useCallback(() => {
    const { bottom, right, left, top } = ref.current.getBoundingClientRect();
    dispatch(setDims({ bottom, right, left, top }));
    dispatch(setLayout(layout));
    dispatch(setNav(nav));
    dispatch(setUrlPath(urlPath));
  }, [ref.current, layout, urlPath, nav]);

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
              No Items Shared
            </span>
          </div>
        )}

        {(isFetching || isSuccess || reLoad) && items?.length > 0 && height && (
          <div className="w-full flex flex-col md:flex-row h-full">
            <div className={`h-full flex flex-col w-full`}>
              <div className="w-full h-[50px] grid grid-cols-2 md:grid-cols-5 content-center border-b border-[#DBDBDB]">
                <div className="col-span-2 flex justify-start items-center">
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
    </>
  );
};

export default React.memo(SharedTable);
