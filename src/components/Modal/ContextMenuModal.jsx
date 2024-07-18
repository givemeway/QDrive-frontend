import { useEffect, useRef } from "react";
import useOutSideClick from "../hooks/useOutsideClick";
import "./ContextMenuModal.css";

const ContextMenuContainer = ({
  children,
  style,
  open,
  onClose,
  buttonRef,
}) => {
  const contextRef = useRef();
  const handleClose = () => {
    onClose();
  };
  useOutSideClick(contextRef, handleClose, buttonRef);
  return (
    <>
      <div
        style={{ position: "absolute", ...style }}
        className={`menu-container ${open ? "open" : ""}`}
        ref={contextRef}
      >
        {children}
      </div>
    </>
  );
};

export default ContextMenuContainer;
