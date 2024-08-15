import { useState, useRef } from "react";
import useOutSideClick from "./hooks/useOutsideClick";
import CloseIcon from "@mui/icons-material/Close";
import "./ChangeAvatar.css";
import { useProfilePicture } from "./hooks/useProfilePicture";
import SpinnerGIF from "./icons/SpinnerGIF";

export const ChangeAvatar = ({ onClose }) => {
  const ref = useRef(null);
  const form = useRef(new FormData());
  const [uploadQuery, uploadStatus] = useProfilePicture();
  const { isError, isLoading, isSuccess, data, status, error } = uploadStatus;

  useOutSideClick(ref, onClose);

  const handleChange = (e) => {
    form.current.append("file", e.target.files[0]);
    uploadQuery(form.current);
  };
  console.log(uploadStatus);

  return (
    <div className="modal">
      <div className="change-your-name-box" ref={ref} style={{ gap: 0 }}>
        <div className="avatar-close">
          <CloseIcon className="button-close" onClick={onClose} />
        </div>
        <h2 className="avatar-heading">Add an account photo</h2>
        <div className="avatar-upload">
          <div className="inner-container">
            {!isLoading && !isSuccess && (
              <>
                <input
                  type={"file"}
                  name="avatar"
                  className="upload-input-box"
                  onChange={handleChange}
                />
                <div className="inner-container-text">
                  <spa>Drag and drop or</spa>
                  <button
                    className="button-underLine"
                    style={{ pointerEvents: "none", marginLeft: ".5rem" }}
                  >
                    upload from computer
                  </button>
                </div>
              </>
            )}
            {isLoading && <SpinnerGIF style={{ width: 50, height: 50 }} />}
            {isSuccess && <>Avatar Uploaded!</>}
          </div>
        </div>
      </div>
    </div>
  );
};
