import { useDispatch, useSelector } from "react-redux";
import { useGetFileVersionMutation } from "../features/api/apiSlice";
import { useEffect, useState } from "react";
import { Box, IconButton, Typography, Badge, Divider } from "@mui/material";
import DownloadForOfflineIcon from "@mui/icons-material/DownloadForOffline";
import TextSnippetIcon from "@mui/icons-material/TextSnippet";
import { styled } from "@mui/material/styles";
import { downloadURL, server, timeOpts } from "../config";
import { formatBytes } from "../util";
import CloseIcon from "./icons/CloseIcon";
import { setFileDetails } from "../features/itemdetails/fileDetails.Slice";
import SpinnerGIF from "./icons/SpinnerGIF";
import { get_file_icon } from "./fileFormats/FileFormat";
import "./ItemDetails.css";
import { borderRight } from "@mui/system";

const styleVersions = {
  display: "flex",
  flexDirection: "row",
  justifyContent: "flex-start",
  alignItems: "center",
  width: "100%",
  border: "1px solid #E0E0E0",
  borderLeft: "none",
  borderRight: "none",
  gap: 2,
};

const StyledBadge = styled(Badge)(({ theme }) => ({
  "& .MuiBadge-badge": {
    right: -3,
    top: 13,
    border: `2px solid ${theme.palette.background.paper}`,
    padding: "0 4px",
  },
}));

function CustomizedBadges({ version }) {
  return (
    <IconButton aria-label="file">
      <StyledBadge badgeContent={version} color="primary">
        <TextSnippetIcon fontSize="medium" />
      </StyledBadge>
    </IconButton>
  );
}

const generateDownloadURL = (file, version) => {
  let url = `${server}${downloadURL}?file=${encodeURIComponent(
    file.filename
  )}&uuid=${encodeURIComponent(file.uuid)}&db=${version}&dir=${
    file.directory
  }&device=${file.device}`;
  const search = new URL(url);
  search.searchParams.set("db", version);
  return search.toString();
};

const ItemDetails = () => {
  const fileDetails = useSelector((state) => state.fileDetails);
  const { CSRFToken } = useSelector((state) => state.csrfToken);
  const dispatch = useDispatch();

  const [getVersion, getVersionStatus] = useGetFileVersionMutation();
  const { isLoading, isSuccess, isError, data, error } = getVersionStatus;
  const [allVersions, setAllVersions] = useState([]);
  useEffect(() => {
    if (fileDetails.file?.origin?.length > 0) {
      getVersion({ CSRFToken, origin: fileDetails.file.origin });
    }
  }, [fileDetails.file?.origin]);

  useEffect(() => {
    if (data) {
      let { files } = data;
      const versions = [
        ...files.map((file) => ({
          ...file,
          id: file.uuid,
          modified: new Date(file.last_modified).toLocaleString(
            "en-IN",
            timeOpts
          ),
          size: formatBytes(file.size),
          url: generateDownloadURL(file, "versions"),
        })),
        { ...fileDetails.file, modified: fileDetails.file.last_modified },
      ];
      const sorted = versions.sort(
        (file1, file2) => file1.versions - file2.versions
      );
      setAllVersions(sorted);
    }
  }, [data]);

  const onClose = () => {
    dispatch(setFileDetails({ open: false, file: {} }));
  };

  return (
    <div className="itemdetails">
      <div className="grid grid-cols-2 px-3 w-full h-[50px] items-center border-b">
        <h2 className="col-span-1 text-left font-semibold text-md text-[#808080]">
          {fileDetails.file?.name ? fileDetails.file?.name : "File"} Info
        </h2>
        <div className="col-span-1">
          <CloseIcon
            onClose={onClose}
            style={{ float: "right", flexGrow: 1, color: "#808080" }}
          />
        </div>
      </div>

      <div className="w-full h-[100px] flex flex-row justify-center items-center pl-2">
        {get_file_icon(
          fileDetails.file?.name,
          fileDetails.file?.url,
          fileDetails.file?.thumbURL
        )}
      </div>
      <div className="flex flex-row justify-center items-center h-[50px] w-full border-t">
        <h3 className="text-left font-medium text-[#808080] text-md w-full px-3  items-center">
          Previous Versions
        </h3>
      </div>

      <Divider orientation="horizontal" />
      {isLoading && (
        <div className="flex flex-row justify-center items-center w-full h-full">
          <div className="flex flex-col justify-center">
            <SpinnerGIF
              style={{ width: "50px", height: "50px", float: "center" }}
            />
          </div>
        </div>
      )}
      {isSuccess && (
        <div className="flex flex-col justify-start items-center overflow-auto w-full grow">
          {allVersions.map((file) => {
            return (
              <Box sx={styleVersions} key={file.id}>
                <CustomizedBadges
                  version={file.versions}
                  sx={{ width: 30, fontSize: 12 }}
                />
                <Typography
                  sx={{ width: 180, fontSize: 12, textAlign: "left" }}
                >
                  Modified: {file.modified}
                </Typography>
                <Typography
                  sx={{ width: 100, fontSize: 12, textAlign: "left" }}
                >
                  Size: {file.size}
                </Typography>
                <a href={file.url} rel="noreferrer" target="_parent">
                  <DownloadForOfflineIcon
                    color={"primary"}
                    sx={{ width: 30, cursor: "pointer" }}
                  />
                </a>
              </Box>
            );
          })}
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

export default ItemDetails;
