import { useDispatch, useSelector } from "react-redux";
import { CustomBlueButton } from "./Buttons/BlueButton";
import { GreyButton } from "./Buttons/GreyButton";
import { CopyLinkIcon } from "./icons/CopyLinkIcon";
import { DownloadIcon } from "./icons/DownloadIcon";
import { setOperation } from "../features/operation/operationSlice";
import { DOWNLOAD } from "../config.js";
import { extract_items_from_ids } from "../util.js";

export const DownloadBox = ({ onClick }) => {
  return (
    <>
      <CustomBlueButton
        style={{ width: 124, height: "100%", padding: 12 }}
        text={
          <div className="flex flex-col gap-2 w-full h-full">
            <DownloadIcon style={{ width: 25, height: 25 }} />
            <span className="text-left">Download</span>
          </div>
        }
        onClick={onClick}
      ></CustomBlueButton>
    </>
  );
};

const ShareBox = () => {
  return (
    <>
      <GreyButton
        style={{ width: 124, height: "100%", padding: 12 }}
        text={
          <div className="flex flex-col gap-2 w-full h-full">
            <CopyLinkIcon style={{ width: 25, height: 25 }} />
            <span className="text-left">Share</span>
          </div>
        }
      ></GreyButton>
    </>
  );
};

export const DownloadHeader = () => {
  const selected = useSelector((state) => state.selected);
  const operation = useSelector((state) => state.operation);
  const dispatch = useDispatch();
  const handleDownload = () => {
    const { files, folders } = extract_items_from_ids([
      ...selected.fileIds,
      ...selected.directories,
    ]);
    dispatch(
      setOperation({
        ...operation,
        type: DOWNLOAD,
        status: "initialized",
        data: { files: files, directories: folders },
      })
    );
  };
  return (
    <div className="w-full h-[100px] flex flex-row justify-start items-center  gap-2 mt-5">
      <DownloadBox onClick={handleDownload} />
      <ShareBox />
      <div className="grow"></div>
    </div>
  );
};
