import { useEffect, useState, useRef } from "react";
import ContextMenuContainer from "./Modal/ContextMenuModal";
import { ContextButton } from "./Buttons/ContextButton";
import { useDispatch, useSelector } from "react-redux";
import { useVerifySessionMutation } from "../features/api/apiSlice";

import { setOperation } from "../features/operation/operationSlice";
import { LOGOUT } from "../config";
import { useNavigate } from "react-router-dom";
import {
  setEmail,
  setFirstName,
  setFirstNameInitial,
  setFullName,
  setInitial,
  setLastName,
  setLastNameInitial,
} from "../features/avatar/avatarSlice";

export const Avatar = ({ initial }) => {
  return (
    <div className="rounded-full bg-[#FFAFA5] w-[40px] h-[40px] flex justify-center items-center">
      <span className="text-[#982062] font-semibold">{initial}</span>
    </div>
  );
};

export default function AvatarMenu() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const buttonRef = useRef();
  const [cord, setCord] = useState({ top: 0, left: 0 });
  const { CSRFToken } = useSelector((state) => state.csrfToken);
  const [session, sessionStatus] = useVerifySessionMutation();
  let { isLoading, isSuccess, isError, data } = sessionStatus;
  data = data ? data : { first: "", last: "" };
  // const [initial, setInitial] = useState("");
  const { initial } = useSelector((state) => state.avatar);
  const dispatch = useDispatch();

  const handleClick = (e) => {
    console.log("avatar clicked");
    e.preventDefault();
    e.stopPropagation();
    setOpen((prev) => !prev);
    setCord({
      y: e.currentTarget.offsetHeight + e.currentTarget.offsetTop,
      x: e.currentTarget.offsetLeft - 255,
    });
  };

  useEffect(() => {
    if (CSRFToken) {
      session({ CSRFToken });
    }
  }, [CSRFToken]);

  useEffect(() => {
    console.log(open);
  }, [open]);

  useEffect(() => {
    console.log(data);
    if (isSuccess && data.first !== "" && data.last !== "") {
      const firstNameInitial = data?.first.split("")[0].toUpperCase();
      const lastNameInitial = data?.last.split("")[0].toUpperCase();
      const initial = firstNameInitial + lastNameInitial;
      dispatch(setFirstName(data?.first));
      dispatch(setLastName(data?.last));
      dispatch(setFullName(data?.first + " " + data?.last));
      dispatch(setInitial(initial));
      dispatch(setEmail(data?.email));
    }
  }, [isLoading, isSuccess, isError, data]);

  const handleLogout = () => {
    dispatch(
      setOperation({ type: LOGOUT, status: "initialized", open: false })
    );
  };

  return (
    <>
      <button
        onClick={handleClick}
        className={`w-[45px] h-[45px] hover:bg-[#F5EFE5] flex justify-center items-center ${
          open ? "bg-[#F5EFE5]" : ""
        }`}
        ref={buttonRef}
      >
        <Avatar initial={initial} />
      </button>

      <ContextMenuContainer
        open={open}
        onClose={() => setOpen(false)}
        style={{ left: cord.x, top: cord.y, width: 300 }}
        buttonRef={buttonRef}
      >
        <span>
          <div className="flex flex-row justify-start items-center pl-3 pr-3 pt-1 h-[80px]">
            <Avatar initial={initial} />
            <div className="flex flex-col justify-center items-start grow h-[25px] pl-3">
              <span className="w-full text-left text-[#1A1918] text-lg font-semibold float-left font-sans capitalize">
                {data?.first} {data?.last}
              </span>
              <span className="w-full text-left text-xs text[#736C7D] h-[15px]">
                {data?.email}
              </span>
            </div>
          </div>
          <div className="w-full border-b border-[#DBDBDB]"></div>
          <div className="flex flex-col w-full">
            <ContextButton
              style={{ height: "30px" }}
              onClick={() => {
                setOpen(false);
                navigate("/dashboard/account");
              }}
            >
              Account
            </ContextButton>
            <ContextButton
              style={{ height: "30px" }}
              onClick={() => {
                setOpen(false);
                navigate("/dashboard/account/profile");
              }}
            >
              Profile
            </ContextButton>
            <ContextButton
              style={{ height: "30px" }}
              onClick={() => {
                setOpen(false);
                navigate("/dashboard/account/settings");
              }}
            >
              Settings
            </ContextButton>
            <ContextButton style={{ height: "30px" }} onClick={handleLogout}>
              Log Out
            </ContextButton>
          </div>
        </span>
      </ContextMenuContainer>
    </>
  );
}
