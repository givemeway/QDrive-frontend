import { useNavigate, useParams, useLocation } from "react-router-dom";
import "./PhotoPreview.css";
import CloseIcon from "./icons/CloseIcon";
import Left from "./icons/LeftArrow.js";
import Right from "./icons/RightArrow.js";
import DropDownContainer from "./Modal/ContextMenuModal.jsx";
import { ContextButton } from "./Buttons/ContextButton.jsx";
import { useEffect, useState } from "react";
import { useGetPhotoPreviewURLMutation } from "../features/api/apiSlice.js";
import { Skeleton } from "@mui/material";
import { getFileExtension, nameWithoutExt } from "./fileFormats/FileFormat.js";
import { useDispatch, useSelector } from "react-redux";
import { setPosition } from "../features/photopreview/previewSlice.js";
import { Image } from "./Image.js";
import { DownloadIcon } from "./icons/DownloadIcon.js";
import { CopyLinkIcon } from "./icons/CopyLinkIcon.js";
import "./PhotoPreview.css";
import { SHARE, file } from "../config.js";
import { getShareItemDetails } from "./ModifiedCell.jsx";
import { setOperation } from "../features/operation/operationSlice.jsx";
import { ErrorIcon } from "./icons/ErrorIcon.js";

const generateLink = (arr, idx) => {
  const path = arr.slice(0, idx + 1).join("/");
  if (path === "/") {
    return "/dashboard/home";
  } else {
    return "/dashboard/home" + path;
  }
};

const createSrcSet = (data) => {
  let srcSet = "";
  Object.entries(data).forEach(([k, v]) => {
    srcSet += `${v} ${k},`;
  });
  return srcSet;
};

const DropDown = ({ path }) => {
  const [open, setOpen] = useState(false);
  const [cord, setCord] = useState({ x: 0, y: 0 });
  const navigate = useNavigate();
  const handleClick = (path, idx) => {
    const navLink = generateLink(path.split("/"), idx);
    navigate(navLink);
  };

  return (
    <>
      <ContextButton
        onClick={(e) => {
          setOpen(true);
          setCord({
            x: e.target.offsetLeft,
            y: e.target.offsetTop + e.target.offsetHeight,
          });
        }}
        style={{
          width: "auto",
          fontWeight: 400,
          color: "#938e88",
        }}
      >
        {path.split("/").slice(-1)[0]}
      </ContextButton>

      <DropDownContainer
        open={open}
        onClose={() => setOpen(false)}
        style={{ top: cord.y, left: cord.x }}
      >
        {path.split("/").map((folder, idx) => {
          return (
            <ContextButton key={idx} onClick={() => handleClick(path, idx)}>
              {folder === "" ? "QDrive" : folder}
            </ContextButton>
          );
        })}
      </DropDownContainer>
    </>
  );
};

const PhotoPath = () => {
  const photo = useSelector((state) => state.photoNav);

  return (
    <div className="flex flex-row justify-start items-center gap-1">
      <DropDown path={photo.path} />
      <span className="text-[#938e88]">/</span>
      <span>
        <div className="flex flex-row justify-start items-center gap-2">
          <span className="text-black font-bold">{photo.name}</span>
          <span className="text-[#938e88]">{photo.ext}</span>
        </div>
      </span>
    </div>
  );
};

const PhotoNavigation = () => {
  const dispatch = useDispatch();
  const photo = useSelector((state) => state.photoNav);
  const handleLeft = () => {
    if (photo.pos - 1 >= 1) {
      dispatch(setPosition({ ...photo, pos: photo.pos - 1 }));
    }
  };
  const handleRight = () => {
    if (photo.pos + 1 <= photo.total) {
      dispatch(setPosition({ ...photo, pos: photo.pos + 1 }));
    }
  };
  return (
    <div className="flex flex-row justify-start items-center gap-1 border-r border-l pl-5 pr-5">
      <button onClick={handleLeft} className=" hover:bg-[#f5efe5]">
        <Left fill={"#080341"} height={25} width={25} />
      </button>
      <span className="tracking-tighter text-[#938e88]">
        {photo.pos} of {photo.total}
      </span>

      <button onClick={handleRight} className=" hover:bg-[#f5efe5]">
        <Right fill={"#080341"} height={25} width={25} />
      </button>
    </div>
  );
};

export default function PhotoPreview({ onClose, pth, photos, initialName }) {
  const dispatch = useDispatch();
  const photo = useSelector((state) => state.photoNav);
  const navigate = useNavigate();
  const params = useParams();
  const subpath = params["*"];
  const location = useLocation();

  const [photoPreviewQuery, photoPreviewStatus] =
    useGetPhotoPreviewURLMutation();
  const { isLoading, isError, data, isSuccess } = photoPreviewStatus;
  useEffect(() => {
    photoPreviewQuery({ path: pth, filename: initialName });
    const idx = photos.findIndex((photo) => photo.name === initialName) + 1;
    dispatch(
      setPosition({
        pos: idx,
        total: photos.length,
        name: nameWithoutExt(initialName),
        ext: getFileExtension(initialName),
        path: photos[idx - 1].path,
      })
    );
  }, []);

  useEffect(() => {
    const filename = photos[photo.pos - 1]?.name;
    navigate(`/dashboard/${subpath}?preview=${filename}`);
  }, [photo.pos]);

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const filename = urlParams.get("preview");
    if (filename !== null)
      photoPreviewQuery({
        path: photo.path,
        filename,
      });
  }, [location.search]);

  useEffect(() => {
    if (isSuccess && data) {
      const photoName = photos[photo.pos - 1]?.name;
      const name = nameWithoutExt(photoName);
      const ext = getFileExtension(photoName);
      dispatch(
        setPosition({
          ...photo,
          name,
          ext,
          src: data["640w"],
          srcSet: createSrcSet(data),
        })
      );
    }
  }, [isLoading, isSuccess, data]);

  const handleDownload = () => {
    const url = photos[photo.pos - 1]?.url;
    window.open(url, "_parent");
  };

  const handleShareLink = () => {
    const { type, body } = getShareItemDetails(photos[photo.pos - 1].id, file);
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
      <div className="w-full h-full flex flex-col bg-[#F7F5F2]">
        <div className="flex flex-row justify-start items-center w-full h-20">
          <header
            className="w-full h-full flex flex-row justify-start items-center
                                 bg-white p-4 border-[#DBDBDB] border-b "
          >
            <div className="hover:bg-[#f5efe5]">
              <CloseIcon onClose={onClose} />
            </div>
            <div className="grow">
              <PhotoPath />
            </div>
            <div className="flex flex-row gap-2 items-center ">
              <PhotoNavigation />

              <button className="hover:bg-[#f5efe5]" onClick={handleDownload}>
                <DownloadIcon
                  style={{
                    width: 25,
                    height: 25,
                  }}
                />
              </button>

              <button
                className="hover:bg-[#f5efe5] flex flex-row justify-start items-center"
                onClick={handleShareLink}
              >
                <CopyLinkIcon style={{ width: 25, height: 25 }} />
              </button>
            </div>
          </header>
        </div>
        <div className="flex justify-center items-center grow ">
          {isSuccess && (
            <Image
              alt={photos[photo.pos - 1]?.name}
              src={photo.src}
              srcSet={photo.srcSet}
              sizes="(max-width: 640px) 100vw, (max-width: 900px) 60vw, 50vw"
              ShowLoading={() => (
                <Skeleton width={600} height={480} animation="wave" />
              )}
              ErrorIcon={() => <ErrorIcon style={{ width: 25, height: 25 }} />}
            />
          )}
          {isLoading && <Skeleton width={600} height={480} animation="wave" />}
          {isError && <div> Something Went Wrong</div>}
        </div>
      </div>
    </>
  );
}
