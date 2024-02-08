import { useDispatch, useSelector } from "react-redux";
import { GreyButton } from "./Buttons/GreyButton";
import { setOperation } from "../features/operation/operationSlice";
import { SHARE, file, folder } from "../config";

const getShareItemDetails = (row) => {
  let type;
  let body = {};
  const item = row.id.split(";");
  if (row.item === folder) {
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
  } else if (row.item === file) {
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
    const { type, body } = getShareItemDetails(row);
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

export default RenderCell;
