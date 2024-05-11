import { useRef } from "react";
import useOutSideClick from "../hooks/useOutsideClick";

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
      {open && (
        <div
          className="absolute flex flex-col
                 bg-white border border-solid
                 border-context-border shadow-md
                  box-border z-[1000] 
                  w-[150px]"
          style={{ ...style }}
          ref={contextRef}
        >
          {children}
        </div>
      )}
    </>
  );
};

export default ContextMenuContainer;
