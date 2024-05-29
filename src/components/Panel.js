import React, { useEffect, useRef, useState } from "react";
import FolderExplorer from "./FolderExplorer";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import { useNavigate, useParams } from "react-router-dom";
import { useSetRecoilState } from "recoil";
import { tabSelectedAtom } from "../Recoil/Store/atoms";
import { AllFilesIcon } from "./icons/AllFilesIcon";
import PictureIcon from "./icons/PictureIcon";
import { SharedIcon } from "./icons/SharedIcon";
import { DeletedIcon } from "./icons/DeletedIcon";
import { ChevronDown } from "./icons/ChevronDown";
import useOutSideClick from "./hooks/useOutsideClick";

const style = {
  display: "flex",
  flexDirection: "column",
  justifyContent: "space-between",
  width: "100%",
  height: 250,
  bgcolor: "background.paper",
  border: "none",
  boxSizing: "border-box",
};

const TabButton = ({ active, children, onClick }) => {
  return (
    <button
      className={`flex justify-start items-center w-full h-[50px] 
          font-normal font-sans text-lg pl-2 gap-2
          ${
            active
              ? "bg-[#EBE9E6] hover:bg-[#DFDCD8] text-[#1A1918]"
              : "bg-[#F7F5F2] hover:bg-[#EBE9E6] text-[#736C64] hover:text-[#1A1918]"
          } `}
      onClick={onClick}
    >
      {children}
    </button>
  );
};

const Panel = () => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const params = useParams();
  const subpath = params["*"];
  const setTabSelected = useSetRecoilState(tabSelectedAtom);
  const panelRef = useRef(null);
  const [active, setActive] = useState({
    allFiles: true,
    photos: false,
    shared: false,
    deleted: false,
  });

  console.log("side panel rendered");
  const handleClick = () => {
    setOpen((prev) => !prev);
  };
  const handleAllFiles = () => {
    navigate("/dashboard/home");
    setActive({ allFiles: true, photos: false, shared: false, deleted: false });
    setTabSelected(1);
  };

  const handleDeleted = () => {
    navigate("/dashboard/deleted");
    setActive({ allFiles: false, photos: false, shared: false, deleted: true });

    setTabSelected(4);
  };

  const handleShare = () => {
    navigate("/dashboard/share");
    setActive({ allFiles: false, photos: false, shared: true, deleted: false });

    setTabSelected(3);
  };

  const handlePhotos = () => {
    navigate("/dashboard/photos");
    setActive({ allFiles: false, photos: true, shared: false, deleted: false });

    setTabSelected(2);
  };

  useEffect(() => {
    const path = subpath.split("/");
    if (path[0] === "home") {
      setActive({
        allFiles: true,
        photos: false,
        shared: false,
        deleted: false,
      });
      setTabSelected(1);
    } else if (path[0] === "deleted") {
      setActive({
        allFiles: false,
        photos: false,
        shared: false,
        deleted: true,
      });

      setTabSelected(4);
    } else if (path[0] === "photos") {
      setActive({
        allFiles: false,
        photos: true,
        shared: false,
        deleted: false,
      });

      setTabSelected(2);
    } else if (path[0] === "share") {
      setActive({
        allFiles: false,
        photos: false,
        shared: true,
        deleted: false,
      });
      setTabSelected(3);
    }
  }, [subpath]);

  return (
    <div
      className="flex flex-col items-start gap-0 w-[190px] md:w-[240px] 
          h-full bg-[#F7F5F2] border-r border-[#D4D2D0] 
          box-border "
      ref={panelRef}
    >
      <h3
        className="cursor-pointer mt-5 mb-8 ml-2 text-5xl font-semibold"
        onClick={() => navigate("/")}
      >
        QDrive
      </h3>
      <TabButton active={active.allFiles} onClick={handleAllFiles}>
        <AllFilesIcon style={{ width: 20, height: 20, fill: "none" }} />
        All Files
      </TabButton>

      <TabButton active={active.photos} onClick={handlePhotos}>
        <PictureIcon style={{ width: 20, height: 20 }} />
        Photos
      </TabButton>

      <TabButton active={active.shared} onClick={handleShare}>
        <SharedIcon style={{ width: 20, height: 20 }} />
        Shared
      </TabButton>

      <TabButton active={active.deleted} onClick={handleDeleted}>
        <DeletedIcon style={{ width: 20, height: 20 }} />
        Deleted Files
      </TabButton>
      <div className="border-b border-[#D4D2D0] w-full"></div>
      <TabButton>
        {!open && (
          <ChevronRightIcon
            style={{ width: 20, height: 20 }}
            onClick={handleClick}
          />
        )}
        {open && (
          <ChevronDown
            style={{ width: 20, height: 20 }}
            onClick={handleClick}
          />
        )}
        Folders
      </TabButton>

      {open && (
        <div
          sx={style}
          className="flex flex-col justify-between w-full h-[250px] border-0 box-border"
        >
          <FolderExplorer />
        </div>
      )}
    </div>
  );
};

export default React.memo(Panel);
