import { useNavigate } from "react-router-dom";
import { CustomBlueButton } from "./Buttons/BlueButton";
import { GreyButton } from "./Buttons/GreyButton";
import { useEffect, useState } from "react";
const thumbnail_server_url =
  "https://thumbnail-dist-server.onrender.com/api/v1/wakeupserver";
const image_server_url =
  "https://imageprocessing-xd2d.onrender.com/api/v1/wakeupserver";

const DropBoxIcon = () => {
  return (
    <svg
      width="30"
      height="25"
      viewBox="0 0 30 25"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M7.70076 0.320312L0.478516 4.91332L7.70076 9.50633L14.9242 4.91332L22.1465 9.50633L29.3687 4.91332L22.1465 0.320312L14.9242 4.91332L7.70076 0.320312Z"
        fill="#1F74FE"
      ></path>
      <path
        d="M7.70076 18.6925L0.478516 14.0994L7.70076 9.50633L14.9242 14.0994L7.70076 18.6925Z"
        fill="#1F74FE"
      ></path>
      <path
        d="M14.9242 14.0994L22.1465 9.50633L29.3687 14.0994L22.1465 18.6925L14.9242 14.0994Z"
        fill="#1F74FE"
      ></path>
      <path
        d="M14.9242 24.8164L7.70077 20.2234L14.9242 15.6304L22.1465 20.2234L14.9242 24.8164Z"
        fill="#1F74FE"
      ></path>
    </svg>
  );
};

const AlertGif = () => {
  return (
    <svg height={25} width={25}>
      <circle fill="#ff0000" stroke="none" cx="12" cy="12" r="12">
        <animate
          attributeName="opacity"
          dur="1s"
          values="0;1;0"
          repeatCount="indefinite"
          begin="0.1"
        />
      </circle>
    </svg>
  );
};

export const Header = () => {
  const [wakeupThumbnailServer, setwakeupThumbnailServer] = useState(false);
  const [wakeupImageServer, setwakeupImageServer] = useState(false);
  useEffect(() => {
    fetch(thumbnail_server_url)
      .then((res) => res.json())
      .then((result) => {
        console.log(result);
        setwakeupThumbnailServer(true);
      })
      .catch((err) => console.log(err));
    fetch(image_server_url)
      .then((res) => res.json())
      .then((result) => {
        console.log(result);
        setwakeupImageServer(true);
      })
      .catch((err) => console.log(err));
  }, []);
  const navigate = useNavigate();
  return (
    <div className="w-full h-[60px] flex flex-row justify-start items-center  border-b border-[#EBE9E6">
      <div className="flex justify-center items-center h-full">
        <div
          className="w-[50px] h-full flex justify-center items-center cursor-pointer"
          onClick={() => navigate("/")}
        >
          <DropBoxIcon />
        </div>
        <h2
          className="font-bold cursor-pointer text-xl font-sans hidden md:block sm:block"
          onClick={() => navigate("/")}
        >
          QDrive
        </h2>
      </div>
      <div className="grow"></div>
      {!wakeupImageServer && !wakeupThumbnailServer && (
        <div className="h-full flex justify-center items-center gap-1">
          <span className="text-xs font-sans text-[#808080] font-semibold">
            waking up server
          </span>
          <AlertGif />
        </div>
      )}
      <div className="flex gap-2 h-full items-center pl-2 pr-2">
        <CustomBlueButton
          text={"Login"}
          style={{ width: 75, height: "60%" }}
          onClick={() => navigate("/login")}
        />
        <GreyButton
          text={"Signup"}
          style={{ width: 75, height: "60%" }}
          onClick={() => navigate("/signup")}
        />
      </div>
    </div>
  );
};
