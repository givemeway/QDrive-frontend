import { useDispatch, useSelector } from "react-redux";
import { useGetFolderDetailsMutation } from "../features/api/apiSlice";

import { Divider } from "@mui/material";

import CloseIcon from "./icons/CloseIcon";
import SpinnerGIF from "./icons/SpinnerGIF";
import InfoIcon from "@mui/icons-material/Info";
import FolderIcon from "./icons/FolderIcon";

import "./ItemDetails.css";
import { setFolderDetails } from "../features/itemdetails/folderDetailsSlice";
import { useEffect } from "react";
import { formatBytes } from "../util";
import { svgIconStyle } from "./fileFormats/FileFormat";

const FolderDetails = () => {
  const { name, directory, device } = useSelector(
    (state) => state.folderDetails
  );
  const dispatch = useDispatch();

  const [getFolderDetails, getFolderStatus] = useGetFolderDetailsMutation();
  const { isLoading, isSuccess, isError, data, error } = getFolderStatus;

  useEffect(() => {
    getFolderDetails({ directory, device });
  }, []);

  useEffect(() => {
    getFolderDetails({ directory, device });
  }, [directory, device]);

  const onClose = () => {
    dispatch(
      setFolderDetails({ open: false, name: "", directory: "", device: "" })
    );
  };

  return (
    <div className="itemdetails">
      <div className="flex flex-row justify-between gap-0 w-full h-[50px] items-center border-b pr-2 pl-2">
        <div className="w-[20%] h-full flex items-center justify-center">
          <FolderIcon style={svgIconStyle} />
        </div>
        <div className="flex items-center justify-start w-[70%] pr-2 h-full ">
          <h2 className="w-full text-left font-semibold text-md text-[#808080] truncate">
            {name}
          </h2>
        </div>
        <div className="w-[10%] h-full flex items-center justify-center">
          <CloseIcon
            onClose={onClose}
            style={{ float: "right", flexGrow: 1, color: "#808080" }}
          />
        </div>
      </div>

      {isLoading && (
        <div className="flex flex-row justify-center items-center w-full grow">
          <div className="flex flex-col justify-center">
            <SpinnerGIF
              style={{ width: "50px", height: "50px", float: "center" }}
            />
          </div>
        </div>
      )}
      {isSuccess && (
        <div className="flex flex-col justify-start items-center overflow-auto w-full grow">
          <div className="flex flex-row justify-start items-center w-full  gap-2 pl-2">
            <span className="font-semibold text-[#808080] text-sm">
              Files:{" "}
            </span>
            <span className="font-semibold text-[#808080] text-sm">
              {data.files}{" "}
            </span>
          </div>
          <div className="flex flex-row justify-start items-center w-full  gap-2 pl-2">
            <span className="font-semibold text-[#808080] text-sm">Size: </span>
            <span className="font-semibold text-[#808080] text-sm">
              {formatBytes(data.size)}{" "}
            </span>
          </div>
        </div>
      )}
      {isError && (
        <h3 className="text-center font-medium text-[#be4848] text-md w-full px-3">
          Something Went Wrong..
        </h3>
      )}

      <Divider orientation="horizontal" />
    </div>
  );
};

export default FolderDetails;
