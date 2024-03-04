import { generateLink } from "../util";
import { get_file_icon, svgIconStyle } from "./fileFormats/FileFormat";
import { Link } from "react-router-dom";
import FolderIcon from "./icons/FolderIcon";
import { folder } from "../config";

const RenderCell = ({ row, params }) => {
  return (
    <>
      {row.item === folder ? (
        <div className="grid grid-cols-12 items-center gap-0">
          <div className="col-span-1 ">
            <FolderIcon style={svgIconStyle} />
          </div>
          <div className="col-span-11">
            <Link
              to={generateLink(
                params.path,
                row.path,
                params.layout,
                params.nav,
                row.id.split(";")[4]
              )}
            >
              <h3 className="text-left capitalize text-[#808080] tracking-wider font-medium">
                {row.name}
              </h3>
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-12 items-center">
          <div className="col-span-1 ">
            {get_file_icon(row.name, row.url, row?.thumbURL)}
          </div>
          <div className="col-span-11">
            <a href={row.url} rel="noreferrer" target="_blank">
              <h3 className="text-left capitalize text-[#808080] tracking-wider font-medium ">
                {row.name}
              </h3>
            </a>
          </div>
        </div>
      )}
    </>
  );
};

export default RenderCell;
