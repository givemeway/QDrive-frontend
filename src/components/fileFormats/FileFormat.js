import WordIcon from "../icons/WordIcon";
import TextIcon from "../icons/TextIcon";
import ArchiveIcon from "../icons/ArchiveIcon";
import HtmlIcon from "../icons/HtmlIcon";
import CodeIcon from "../icons/CodeIcon";
import PdfIcon from "../icons/PdfIcon";
import ExcelIcon from "../icons/ExcelIcon";
import FileIcon from "../icons/FileIcon";
import PictureIcon from "../icons/PictureIcon";
import { Link, useParams } from "react-router-dom";

const svgIconStyle = {
  backgroundColor: "#F7F5F2",
  boxShadow: 1,
  borderRadius: "2px",
  width: 25,
  height: 25,
};
export const file_format = {
  pdf: <PdfIcon style={svgIconStyle} />,
  doc: <WordIcon style={svgIconStyle} />,
  docx: <WordIcon style={svgIconStyle} />,
  xls: <ExcelIcon style={svgIconStyle} />,
  xlsx: <ExcelIcon style={svgIconStyle} />,
  csv: <ExcelIcon style={svgIconStyle} />,
  txt: <TextIcon style={svgIconStyle} />,
  log: <TextIcon style={svgIconStyle} />,
  zip: <ArchiveIcon style={svgIconStyle} />,
  tar: <ArchiveIcon style={svgIconStyle} />,
  "7z": <ArchiveIcon style={svgIconStyle} />,
  rar: <ArchiveIcon style={svgIconStyle} />,
  js: <CodeIcon style={svgIconStyle} />,
  py: <CodeIcon style={svgIconStyle} />,
  cpp: <CodeIcon style={svgIconStyle} />,
  java: <CodeIcon style={svgIconStyle} />,
  html: <HtmlIcon style={svgIconStyle} />,
  c: <CodeIcon style={svgIconStyle} />,
  css: <CodeIcon style={svgIconStyle} />,
  json: <CodeIcon style={svgIconStyle} />,
  png: <PictureIcon style={svgIconStyle} />,
  jpg: <PictureIcon style={svgIconStyle} />,
  jpeg: <PictureIcon style={svgIconStyle} />,
  tiff: <PictureIcon style={svgIconStyle} />,
  gif: <PictureIcon style={svgIconStyle} />,
};

export const FileExtIcon = ({ ext, style }) => {
  const formats = {
    pdf: <PdfIcon style={{ ...style }} />,
    doc: <WordIcon style={{ ...style }} />,
    docx: <WordIcon style={{ ...style }} />,
    xls: <ExcelIcon style={{ ...style }} />,
    xlsx: <ExcelIcon style={{ ...style }} />,
    csv: <ExcelIcon style={{ ...style }} />,
    txt: <TextIcon style={{ ...style }} />,
    log: <TextIcon style={{ ...style }} />,
    zip: <ArchiveIcon style={{ ...style }} />,
    tar: <ArchiveIcon style={{ ...style }} />,
    "7z": <ArchiveIcon style={{ ...style }} />,
    rar: <ArchiveIcon style={{ ...style }} />,
    js: <CodeIcon style={{ ...style }} />,
    py: <CodeIcon style={{ ...style }} />,
    cpp: <CodeIcon style={{ ...style }} />,
    java: <CodeIcon style={{ ...style }} />,
    html: <HtmlIcon style={{ ...style }} />,
    c: <CodeIcon style={{ ...style }} />,
    css: <CodeIcon style={{ ...style }} />,
    json: <CodeIcon style={{ ...style }} />,
    png: <PictureIcon style={{ ...style }} />,
    jpg: <PictureIcon style={{ ...style }} />,
    jpeg: <PictureIcon style={{ ...style }} />,
    tiff: <PictureIcon style={{ ...style }} />,
    gif: <PictureIcon style={{ ...style }} />,
  };
  return formats[ext];
};

function Get_file_icon(filename, url, thumbURL) {
  const params = useParams();
  const path = params["*"];
  const ext = filename?.split(".").slice(-1)[0].toLowerCase();
  if (file_format.hasOwnProperty(ext))
    if (
      ext === "jpg" ||
      ext === "jpeg" ||
      ext === "tiff" ||
      ext === "png" ||
      ext === "gif"
    ) {
      return (
        <>
          <Link to={"/dashboard/" + path + "?preview=" + filename}>
            <img src={thumbURL} alt={`${filename}`} />
          </Link>
        </>
      );
    } else {
      return file_format[ext];
    }
  else return <FileIcon style={{ ...svgIconStyle }} />;
}

export function getFileExtension(filename) {
  return filename?.split(".").slice(-1)[0].toLowerCase();
}
export function nameWithoutExt(filename) {
  return filename.split(".")[0];
}

export default function isPicture(filename) {
  const ext = getFileExtension(filename);
  if (
    ext === "jpg" ||
    ext === "jpeg" ||
    ext === "tiff" ||
    ext === "png" ||
    ext === "gif"
  ) {
    return true;
  } else return false;
}

export { Get_file_icon as get_file_icon, svgIconStyle, isPicture };
