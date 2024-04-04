import { useEffect, useState } from "react";
import ContextMenuContainer from "./Modal/ContextMenuModal";
import { ContextButton } from "./Buttons/ContextButton";

export default function AvatarMenu() {
  const [open, setOpen] = useState(false);
  const [cord, setCord] = useState({ top: 0, left: 0 });

  const [menuOptions, setMenuOptions] = useState([
    "Account",
    "Settings",
    "Profile",
    "Logout",
  ]);

  const handleClick = (e) => {
    setOpen(true);
    setCord({
      y: e.currentTarget.offsetHeight + e.currentTarget.offsetTop,
      x: e.currentTarget.offsetLeft - 120,
    });
  };

  return (
    <>
      <button
        onClick={handleClick}
        className="w-[30px] h-[30px] hover:bg-[#F5EFE5] flex justify-center items-center"
      >
        <div className="rounded-full bg-[#FFAFA5] w-[25px] h-[25px] ">
          <span className="text-[#982062] font-normal">SR</span>
        </div>
      </button>

      <ContextMenuContainer
        open={open}
        onClose={() => setOpen(false)}
        style={{ left: cord.x, top: cord.y }}
      >
        {menuOptions.map((opt) => (
          <ContextButton>{opt}</ContextButton>
        ))}
      </ContextMenuContainer>
    </>
  );
}
