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
        style={{ ...style }}
        className={`menu-container ${open ? "openMenu" : ""}`}
        ref={contextRef}
      >
        {children}
      </div>
    </>
  );
};

export default ContextMenuContainer;
