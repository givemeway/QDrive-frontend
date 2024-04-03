import { generateLink } from "../util";
import {
  file_format,
  getFileExtension,
  svgIconStyle,
  isPicture,
} from "./fileFormats/FileFormat";
import { Link, useParams } from "react-router-dom";
import FolderIcon from "./icons/FolderIcon";
import { folder } from "../config";
import FileIcon from "./icons/FileIcon";
import Image from "mui-image";

const Icon = ({ ext }) => {
  return file_format[ext] === undefined ? (
    <FileIcon style={{ ...svgIconStyle }} />
  ) : (
    file_format[ext]
  );
};

const File = ({ path, row, params }) => {
  const ext = getFileExtension(row.name);
  const picture = isPicture(row.name);
  return (
    <div className="flex flex-row justify-start items-center m-0 gap-2">
      <div className="w-10 h-full flex flex-row justify-center items-center">
        {picture && (
          <>
            <Link to={generateLink(path, params, row, 1)}>
              <Image
                src={row?.thumbURL}
                showLoading={<Icon ext={ext} />}
                errorIcon={<Icon ext={ext} />}
              />
            </Link>
          </>
        )}
        {!picture && <Icon ext={ext} />}
      </div>
      <div className="w-auto">
        {picture && (
          <Link to={generateLink(path, params, row, 1)}>{row.name}</Link>
        )}

        {!picture && (
          <a href={row.url} rel="noreferrer" target="_blank">
            <h3 className="text-left capitalize text-[#808080] tracking-wider font-medium">
              {row.name}
            </h3>
          </a>
        )}
      </div>
    </div>
  );
};

const Folder = ({ path, params, row }) => {
  return (
    <div className="flex flex-row justify-start items-center m-0 gap-2">
      <div className="w-10 h-full">
        <FolderIcon style={svgIconStyle} />
      </div>
      <div className="w-auto">
        <Link to={generateLink(path, params, row)}>
          <h3
            className="text-left capitalize text-[#808080] tracking-wider font-medium"
            id={`${row.id.split(";")[1]}`}
          >
            {row.name}
          </h3>
        </Link>
      </div>
    </div>
  );
};

const RenderCell = ({ row, params }) => {
  const urlParams = useParams();
  const path = urlParams["*"];
  return (
    <>
      {row.item === folder ? (
        <Folder path={path} params={params} row={row} />
      ) : (
        <File path={path} row={row} params={params} />
      )}
    </>
  );
};

export default RenderCell;
