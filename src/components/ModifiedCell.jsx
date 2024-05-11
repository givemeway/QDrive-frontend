import { useDispatch, useSelector } from "react-redux";
import { GreyButton } from "./Buttons/GreyButton";
import { setOperation } from "../features/operation/operationSlice";
import { SHARE, file, folder, DOWNLOAD } from "../config";
import { DownloadIcon } from "./icons/DownloadIcon";
import { extract_items_from_ids } from "../util";
import { CopyLinkIcon } from "./icons/CopyLinkIcon";

export const getShareItemDetails = (id, itemType) => {
  let type;
  let body = {};
  const item = id.split(";");
  if (itemType === folder) {
    type = "fo";

    const fo_el = {
      id: item[1],
      path: item[2],
      folder: item[3],
      uuid: item[4],
      device: item[5],
    };
    body.directories = [fo_el];
    body.files = [];
  } else if (itemType === file) {
    type = "fi";
    const fi_el = {
      id: item[1],
      path: item[2],
      file: item[3],
      origin: item[4],
      dir: item[5],
      device: item[6],
      versions: parseInt(item[7]),
    };
    body.files = [fi_el];
    body.directories = [];
  }
  return { type, body };
};

const RenderCell = ({ row }) => {
  const rowHover = useSelector((state) => state.rowHover);
  const dispatch = useDispatch();
  const handleShare = () => {
    const { type, body } = getShareItemDetails(row.id, row.item);
    dispatch(
      setOperation({
        type: SHARE,
        status: "initialized",
        open: false,
        data: { body, type },
      })
    );
  };
  return (
    <>
      {rowHover.rowId !== row.id && (
        <h3 className="text-left capitalize text-[#808080] tracking-wider font-medium">
          {row.last_modified}
        </h3>
      )}
      {rowHover.rowId === row.id && (
        <div className="col-span-2 ">
          <GreyButton
            text={"Copy Link"}
            style={{ width: " 100px", height: "40px" }}
            onClick={handleShare}
          />
        </div>
      )}
    </>
  );
};

export const DownloadCell = ({ row }) => {
  const rowHover = useSelector((state) => state.rowHover);
  const operation = useSelector((state) => state.operation);
  const dispatch = useDispatch();
  const handleDownload = () => {
    const { folders } = extract_items_from_ids({ [row.id]: true });
    if (row.item === file) window.open(row.url, "_parent");
    if (row.item === folder) {
      dispatch(
        setOperation({
          ...operation,
          type: DOWNLOAD,
          status: "initialized",
          data: { files: [], directories: folders },
        })
      );
    }
  };
  const handleShare = () => {
    const { type, body } = getShareItemDetails(row.id, row.item);
    dispatch(
      setOperation({
        type: SHARE,
        status: "initialized",
        open: false,
        data: { body, type },
      })
    );
  };
  return (
    <>
      {rowHover.rowId !== row.id && (
        <h3 className="text-left capitalize text-[#808080] tracking-wider font-medium">
          {row.last_modified}
        </h3>
      )}
      {rowHover.rowId === row.id && (
        <div className="grow">
          <div className="flex flex-row justify-start items-center gap-2">
            <GreyButton
              text={
                <div className="flex flex-row justify-start items-center p-2">
                  <CopyLinkIcon
                    style={{ width: 25, height: 25, color: "#1A1918" }}
                  />
                  {/* <span className="text-left  text-[#1A1918] font-semibold font-sans">
                    Copy Link
                  </span> */}
                </div>
              }
              style={{ height: "40px" }}
              onClick={handleShare}
            />
            <GreyButton
              text={
                <div className="flex flex-row justify-start items-center p-2">
                  <DownloadIcon
                    style={{ width: 25, height: 25, color: "#1A1918" }}
                  />
                  {/* <span className="text-left  text-[#1A1918] font-semibold font-sans">
                    Download
                  </span> */}
                </div>
              }
              style={{ height: "40px" }}
              onClick={handleDownload}
            />
          </div>
        </div>
      )}
    </>
  );
};

export default RenderCell;
