import { CustomBlueButton } from "./Buttons/BlueButton";
import { GreyButton } from "./Buttons/GreyButton";
import { CopyLinkIcon } from "./icons/CopyLinkIcon";
import { DownloadIcon } from "./icons/DownloadIcon";

const DownloadBox = () => {
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
  return (
    <div className="w-full h-[100px] flex flex-row justify-start items-center  gap-2 mt-5">
      <DownloadBox />
      <ShareBox />
      <div className="grow"></div>
    </div>
  );
};
