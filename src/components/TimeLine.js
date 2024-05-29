import { VariableSizeList as List } from "react-window";
import { useGetPhotosMutation } from "../features/api/apiSlice";
import { useCallback, useEffect, useRef, useState } from "react";

import SpinnerGIF from "./icons/SpinnerGIF";
import "./Timeline.css";
import { useDispatch, useSelector } from "react-redux";
import {
  setItemSize,
  setItems,
  setRenderSize,
  setTimeline,
} from "../features/timeline/timeLineSlice";
import { Minus } from "./icons/MinusIcon";
import { Plus } from "./icons/PlusIcon";
import { Image } from "./Image";
import { Skeleton } from "@mui/material";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { buildCellValueForFile, generateLink } from "../util";
import PhotoPreview from "./PhotoPreview";
import { Modal } from "./Modal/Modal.jsx";

const RANGE = [82, 103, 168, 211, 425];

const TimeLineFilter = () => {
  const dispatch = useDispatch();
  const [idx, setIdx] = useState(0);
  const [active, setActive] = useState({
    days: true,
    years: false,
    months: false,
    photos: true,
    videos: false,
    allItems: false,
  });

  const increment = () => {
    setIdx((prev) => {
      if (prev + 1 < RANGE.length) {
        return prev + 1;
      } else {
        return prev;
      }
    });
  };
  const decrement = () => {
    setIdx((prev) => {
      if (prev - 1 >= 0) {
        return prev - 1;
      } else {
        return prev;
      }
    });
  };

  const handleYears = () => {
    dispatch(setTimeline("years"));
    setActive((prev) => ({ ...prev, days: false, months: false, years: true }));
  };
  const handleMonths = () => {
    dispatch(setTimeline("months"));
    setActive((prev) => ({ ...prev, days: false, months: true, years: false }));
  };
  const handleDays = () => {
    dispatch(setTimeline("days"));
    setActive((prev) => ({ ...prev, days: true, months: false, years: false }));
  };

  const handlePhotos = () => {
    dispatch(setItems("photos"));
    setActive((prev) => ({
      ...prev,
      photos: true,
      videos: false,
      allItems: false,
    }));
  };
  const handleVideos = () => {
    dispatch(setItems("videos"));
    setActive((prev) => ({
      ...prev,
      photos: false,
      videos: true,
      allItems: false,
    }));
  };
  const handleAllItems = () => {
    dispatch(setItems("allItems"));
    setActive((prev) => ({
      ...prev,
      photos: false,
      videos: false,
      allItems: true,
    }));
  };

  useEffect(() => {
    dispatch(setRenderSize(RANGE[idx]));
    dispatch(setItemSize(RANGE[idx]));
  }, [idx]);

  return (
    <div className="h-full grid grid-cols-6 content-center border divide-x gap-2">
      <div className="col-span-2">
        <div className="flex flex-row">
          <button
            className={`w-20 font-semibold font-sans h-10 hover:bg-[#fbf4ea] ${
              active.allItems ? "active" : ""
            }`}
            onClick={handleAllItems}
          >
            All Items
          </button>
          <button
            className={`w-20 font-semibold font-sans h-10 hover:bg-[#fbf4ea] ${
              active.photos ? "active" : ""
            }`}
            onClick={handlePhotos}
          >
            Photos
          </button>
          <button
            className={`w-20 font-semibold font-sans h-10 hover:bg-[#fbf4ea] ${
              active.videos ? "active" : ""
            }`}
            onClick={handleVideos}
          >
            Videos
          </button>
        </div>
      </div>
      <div className="col-span-2 pl-2 content-center">
        <div className="col-span-2">
          <div className="flex flex-row ">
            <button
              className={`w-20 font-semibold font-sans h-10 hover:bg-[#fbf4ea] ${
                active.years ? "active" : ""
              }`}
              onClick={handleYears}
            >
              Years
            </button>
            <button
              className={`w-20 font-semibold font-sans h-10 hover:bg-[#fbf4ea] ${
                active.months ? "active" : ""
              }`}
              onClick={handleMonths}
            >
              Months
            </button>
            <button
              className={`w-20 font-semibold font-sans h-10 hover:bg-[#fbf4ea] ${
                active.days ? "active" : ""
              }`}
              onClick={handleDays}
            >
              Days
            </button>
          </div>
        </div>
      </div>
      <div className="col-span-2 pl-2 content-center">
        <div className="flex flex-row  gap-1">
          <button
            onClick={decrement}
            className="bg-[#F5EFE5] w-10 h-10 hover:bg-[#ECE1CE]"
          >
            <Minus
              style={{
                width: "25px",
                height: "25px",
                margin: "auto",
              }}
            />
          </button>
          <input type="range" min={82} max={425} value={RANGE[idx]} />
          <button
            onClick={increment}
            className="bg-[#F5EFE5] w-10 h-10 hover:bg-[#ECE1CE]"
          >
            <Plus
              style={{
                width: "23px",
                height: "23px",
                margin: "auto",
              }}
            />
          </button>
        </div>
      </div>
    </div>
  );
};

const applyGroupFilter = (photos, mode) => {
  const photos_grouped = {};
  const monthLookup = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  photos.forEach((photo) => {
    const date = new Date(photo.last_modified).getDate();
    const month = monthLookup[new Date(photo.last_modified).getMonth()];
    const year = new Date(photo.last_modified).getFullYear();
    if (mode === "months") {
      const key = `${month} ${year}`;
      if (!photos_grouped.hasOwnProperty(key)) {
        photos_grouped[key] = [photo];
      } else {
        photos_grouped[key].push(photo);
      }
    } else if (mode === "years") {
      const key = `${year}`;
      if (!photos_grouped.hasOwnProperty(key)) {
        photos_grouped[key] = [photo];
      } else {
        photos_grouped[key].push(photo);
      }
    } else if (mode === "days") {
      const key = `${month} ${date}, ${year}`;
      if (!photos_grouped.hasOwnProperty(key)) {
        photos_grouped[key] = [photo];
      } else {
        photos_grouped[key].push(photo);
      }
    }
  });
  return photos_grouped;
};

export const TimeLine = () => {
  const [photosQuery, photosStatus] = useGetPhotosMutation();
  const [dim, setDim] = useState({ height: undefined, width: undefined });
  const elementRef = useRef(null);
  const filterRef = useRef(null);
  const [gallery, setGallery] = useState([]);
  const { isLoading, isError, data, isSuccess } = photosStatus;
  const [rowHeights, setRowHeights] = useState([]);
  const state = useSelector((state) => state.timeline);
  const resizeObserver = useRef(null);
  const urlParams = useParams();
  const navPath = urlParams["*"];
  const location = useLocation();
  const [isPreview, setIsPreview] = useState(false);
  const [photos, setPhotos] = useState([]);
  const [initialName, setInitialName] = useState("");
  const navigate = useNavigate();

  const getBoundingClientRect = useCallback(() => {
    const parentEl = elementRef.current;
    const filterEl = filterRef.current;

    const filter = filterEl.getBoundingClientRect();
    const { height, width } = parentEl.getBoundingClientRect();
    console.log(height, width);
    setDim({ height: height - filter.height, width });
  }, [elementRef.current, filterRef.current]);

  const onClose = () => {
    setIsPreview(false);
    navigate("/dashboard/photos");
  };

  useEffect(() => {
    photosQuery();
    resizeObserver.current = new ResizeObserver((observe) => {
      getBoundingClientRect();
    });
    return () => {
      if (resizeObserver.current) {
        resizeObserver.current.disconnect();
      }
    };
  }, []);

  useEffect(() => {
    if (elementRef.current) {
      resizeObserver.current.observe(elementRef.current);
      getBoundingClientRect();
    }
  }, [elementRef.current]);

  useEffect(() => {
    if (data && dim.height && dim.width) {
      const photos = data.map((file) => buildCellValueForFile(file));
      setPhotos(photos);
      const grouped = applyGroupFilter(data, state.timeline);
      let gallery = [];
      let rowHeights = [];
      Object.entries(grouped).forEach(([k, v]) => {
        const timelineTag = `${k} ${v.length} items`;
        const item = { value: timelineTag };
        gallery.push(item);
        rowHeights.push(state.tagHeight);
        let row = [];
        let filledWidth = 0;
        v.forEach((file) => {
          const item = { value: file.signedURL, ...file };
          const currentWidth = filledWidth + state.renderSize;
          if (currentWidth < dim.width) {
            row.push(item);
            filledWidth += state.renderSize;
          } else {
            gallery.push({ value: row });
            rowHeights.push(state.itemSize);
            row = [];
            filledWidth = 0;
          }
        });
        if (row.length > 0) {
          gallery.push({ value: row });
          rowHeights.push(state.itemSize);
        }
      });
      setRowHeights(() => [...rowHeights]);
      setGallery(() => [...gallery]);
    }
  }, [
    data,
    dim.width,
    dim.height,
    state.renderSize,
    state.itemSize,
    state.timeline,
    elementRef,
  ]);
  useEffect(() => {
    if (location.search) {
      const params = new URLSearchParams(location.search);
      if (params.get("preview")) {
        setIsPreview(true);
        setInitialName(params.get("preview"));
        console.log(params.get("preview"));
      }
    }
  }, [location.search]);

  const Row = ({ style, data, index }) => {
    return (
      <div
        key={index}
        style={style}
        className="flex flex-row items-center justify-start gap-1"
      >
        {Array.isArray(data[index]?.value) ? (
          data[index].value.map((photo) => {
            return (
              <>
                <Link to={`/dashboard/photos?preview=${photo.filename}`}>
                  <Image
                    src={photo.value}
                    style={{
                      width: state.renderSize,
                      height: state.renderSize,
                      className: "gallery-image",
                    }}
                    ShowLoading={() => (
                      <Skeleton
                        height={state.renderSize}
                        width={state.renderSize}
                        animation="wave"
                      />
                    )}
                    ErrorIcon={() => <>Error</>}
                  />
                </Link>
              </>
            );
          })
        ) : (
          <h2 className="font-semibold">{data[index].value}</h2>
        )}
      </div>
    );
  };

  const getItemSize = useCallback((index) => rowHeights[index], [rowHeights]);
  console.log("gallery re-rendered");
  return (
    <div className="w-full h-full flex flex-col" ref={elementRef}>
      <div className="w-full h-[75px]" ref={filterRef}>
        <TimeLineFilter></TimeLineFilter>
      </div>
      {isSuccess &&
        gallery &&
        dim.height &&
        dim.width &&
        rowHeights.length > 0 && (
          <List
            width={dim.width}
            height={dim.height}
            itemCount={gallery.length}
            itemData={gallery}
            itemSize={(index) => rowHeights[index]}
          >
            {Row}
          </List>
        )}
      {isLoading && (
        <div className="w-full  flex justify-center items-center flex-grow">
          <SpinnerGIF style={{ height: 50, width: 50 }} />
        </div>
      )}

      {isError && (
        <div className="w-full flex flex-grow justify-center items-center">
          <h2 className="font-bold">Something Went wrong</h2>
        </div>
      )}
      {isPreview && (
        <Modal style={{ background: "white", opacity: 1 }}>
          <PhotoPreview
            photos={photos}
            onClose={onClose}
            initialName={initialName}
          />
        </Modal>
      )}
    </div>
  );
};
