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
  setFullName,
  setInitial,
  setLastName,
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
  const { fullName, email, initials } = useSelector((state) => state.avatar);
  const [session, sessionStatus] = useVerifySessionMutation();
  let { isSuccess, data } = sessionStatus;
  const dispatch = useDispatch();

  const handleClick = (e) => {
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
  }, [CSRFToken, session]);

  useEffect(() => {
    if (isSuccess && data) {
      const { first, last, email } = data;
      const firstNameInitial = first.split("")[0].toUpperCase();
      const lastNameInitial = last.split("")[0].toUpperCase();
      const initial = firstNameInitial + lastNameInitial;
      dispatch(setFirstName(first));
      dispatch(setLastName(last));
      dispatch(setFullName(first + " " + last));
      dispatch(setInitial(initial));
      dispatch(setEmail(email));
    }
  }, [isSuccess, data, dispatch]);

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
        <Avatar initial={initials} />
      </button>

      <ContextMenuContainer
        open={open}
        onClose={() => setOpen(false)}
        style={{ left: cord.x, top: cord.y, width: 300 }}
        buttonRef={buttonRef}
      >
        <span>
          <div className="flex flex-row justify-start items-center pl-3 pr-3 pt-1 h-[80px]">
            <Avatar initial={initials} />
            <div className="flex flex-col justify-center items-start grow h-[25px] pl-3">
              <span className="w-full text-left text-[#1A1918] text-lg font-semibold float-left font-sans capitalize">
                {fullName}
              </span>
              <span className="w-full text-left text-xs text[#736C7D] h-[15px]">
                {email}
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
