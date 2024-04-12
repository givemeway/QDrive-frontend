import React, { useState } from "react";
import { ContextIcon } from "./icons/ContextIcon";
import ContextModal from "./Modal/ContextMenuModal.jsx";
import { ContextButton } from "./Buttons/ContextButton";
import { timeOpts } from "../config";
import { FixedSizeList as List } from "react-window";
import SpinnerGIF from "./icons/SpinnerGIF";
import FolderIcon from "./icons/FolderIcon";
import { Icon } from "./NameCell";
import { getFileExtension, svgIconStyle } from "./fileFormats/FileFormat";

const NameCell = ({ item, name }) => {
  if (item === "fi") {
    const ext = getFileExtension(name);
    return (
      <div className="w-[50px] h-[50px] flex justify-center items-center">
        <Icon ext={ext} />
      </div>
    );
  } else {
    return (
      <div className="w-[50px] h-[50px] flex justify-center items-center">
        <FolderIcon style={svgIconStyle} />
      </div>
    );
  }
};

const SharedTable = ({ params }) => {
  const {
    height,
    isSuccess,
    rows,
    isLoading,
    isError,
    ref,
    delShare,
    CSRFToken,
  } = params;

  const Row = React.memo(({ index, data, style }) => {
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
    const handleShareDelete = (e) => {
      const id = e.target.closest(".shared-table-row").id;
      delShare({ id, CSRFToken });
    };
    return (
      <div
        className="grid grid-cols-4 content-center hover:bg-[#E8E8E8] shared-table-row"
        id={`${data[index]["_id"]}`}
        style={{
          ...style,
          borderBottom: "1px solid #DBDBDB",
        }}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <div className="h-full col-span-2 flex flex-row justify-start items-center text-left">
          <NameCell name={data[index]["name"]} item={data[index]["item"]} />
          <span className="grow text-[#736C64] font-sans text-md">
            {data[index]["name"]}
          </span>
        </div>
        <div className="h-full col-span-1 text-left  content-center">
          <span className="grow text-[#736C64] font-sans text-md">
            {new Date(data[index]["created_at"]).toLocaleString(
              "en-in",
              timeOpts
            )}
          </span>
        </div>
        <div className="h-full col-span-1 text-left content-center">
          <span className="grow text-[#736C64] font-sans text-md">
            {new Date(data[index]["expires_at"]).toLocaleString(
              "en-in",
              timeOpts
            )}
          </span>
        </div>
        {isHovered && (
          <div
            className={`z-[100] absolute  h-full right-3 flex justify-center items-center `}
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
                <ContextButton>Edit</ContextButton>
              </ContextModal>
            )}
          </div>
        )}
      </div>
    );
  });
  return (
    <div
      className="w-full grow flex flex-col  justify-center items-center"
      ref={ref}
    >
      {isSuccess && rows?.length === 0 && (
        <div className="w-full flex justify-center items-center grow">
          <span className="font-sans font-semibold text-[#DBDBDB]">
            No Items Shared
          </span>
        </div>
      )}
      {isSuccess && rows?.length > 0 && height && (
        <div className="w-full h-[50px] grid grid-cols-4 content-center border-b border-[#DBDBDB]">
          <h4 className="col-span-2 text-left pl-2 font-bold">Name</h4>
          <h4 className="col-span-1 text-left pl-2 font-bold">Created On</h4>
          <h4 className="col-span-1 text-left pl-2 font-bold">Expires On</h4>
        </div>
      )}

      {isSuccess && rows?.length > 0 && height && (
        <List
          height={height - 50}
          width={"100%"}
          itemCount={rows.length}
          itemSize={50}
          itemData={rows}
        >
          {Row}
        </List>
      )}
      {isLoading && <SpinnerGIF style={{ height: 50, width: 50 }} />}
      {isError && <>Something Went wrong</>}
    </div>
  );
};

export default SharedTable;
