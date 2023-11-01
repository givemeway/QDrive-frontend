import WordIcon from "../icons/WordIcon";
import TextIcon from "../icons/TextIcon";
import ArchiveIcon from "../icons/ArchiveIcon";
import HtmlIcon from "../icons/HtmlIcon";
import CodeIcon from "../icons/CodeIcon";
import PdfIcon from "../icons/PdfIcon";
import ExcelIcon from "../icons/ExcelIcon";
import FileIcon from "../icons/FileIcon";

const svgIconStyle = {
  backgroundColor: "#F7F5F2",
  boxShadow: 1,
  borderRadius: "2px",
  width: 25,
  height: 25,
};
const file_format = {
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
};

function get_file_icon(filename) {
  const ext = filename.split(".").slice(-1)[0];
  if (file_format.hasOwnProperty(ext)) return file_format[ext];
  else return <FileIcon style={svgIconStyle} />;
}

export { get_file_icon, svgIconStyle };
