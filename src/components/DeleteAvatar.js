import { useRef } from "react";

import useOutSideClick from "./hooks/useOutsideClick";
import CloseIcon from "@mui/icons-material/Close";
import "./ChangeAvatar.css";

export const DeleteAvatar = ({ onClose, query }) => {
  const ref = useRef(null);

  useOutSideClick(ref, onClose);

  return (
    <div className="modal">
      <div className="change-your-name-box" ref={ref}>
        <div className="modal-heading">
          <h2 className="accountpage-heading">Delete account photo</h2>
          <CloseIcon className="button-close" onClick={onClose} />
        </div>
        <div
          className="avatar-preview-editor"
          style={{ justifyContent: "end" }}
        >
          <button className="photo-done" onClick={query}>
            Delete photo
          </button>
          <button
            className="photo-change"
            onClick={onClose}
            style={{ background: "var(--color-brown-lite)", border: "none" }}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};
