import { useState, useRef, useEffect } from "react";
import { Image } from "./Image";
import useOutSideClick from "./hooks/useOutsideClick";
import CloseIcon from "@mui/icons-material/Close";
import "./ChangeAvatar.css";
import { useProfilePicture } from "./hooks/useProfilePicture";
import { Skeleton } from "@mui/material";
import SpinnerGIF from "./icons/SpinnerGIF";
import { useDispatch } from "react-redux";
import { setAvatarURL, setHasAvatar } from "../features/avatar/avatarSlice";

const PreviewAvatar = ({ src, handleChange, handleDone }) => {
  return (
    <div className="avatar-preview-container">
      <Image
        src={src}
        className={"avatar-image"}
        ShowLoading={() => (
          <Skeleton animation="wave" className="avatar-image" />
        )}
        ErrorIcon={() => <>Error</>}
      />
      <div className="avatar-preview-editor">
        <button className="photo-change" onClick={handleChange}>
          Change photo
        </button>
        <button className="photo-done" onClick={handleDone}>
          Done
        </button>
      </div>
    </div>
  );
};

export const ChangeAvatar = ({ onClose }) => {
  const ref = useRef(null);
  const [addPhoto, setAddPhoto] = useState(true);
  const [isValidPicture, setIsValidPicture] = useState(true);
  const dispatch = useDispatch();
  const form = useRef(new FormData());
  const [uploadQuery, uploadStatus] = useProfilePicture();
  const { isError, isLoading, isSuccess, data, status, error } = uploadStatus;

  useOutSideClick(ref, onClose);

  const handleChange = (e) => {
    if (e.target.files[0].type.split("/")[0] === "image") {
      setAddPhoto(false);
      setIsValidPicture(true);
      form.current.append("file", e.target.files[0]);
      uploadQuery(form.current);
    } else {
      setIsValidPicture(false);
    }
  };
  const handleChangePhoto = () => {
    setAddPhoto(true);
  };

  useEffect(() => {
    if (isSuccess && data) {
      dispatch(setAvatarURL(data?.original));
      dispatch(setHasAvatar(true));
    }
  }, [data, isSuccess]);

  return (
    <div className="modal">
      <div className="change-your-name-box" ref={ref} style={{ gap: 0 }}>
        <div className="avatar-close">
          <CloseIcon className="button-close" onClick={onClose} />
        </div>
        {(addPhoto || isLoading) && (
          <h2 className="avatar-heading">Add an account photo</h2>
        )}
        {!addPhoto && !isLoading && isSuccess && data?.original && (
          <h2 className="avatar-heading">Looking good!</h2>
        )}
        {(addPhoto || isLoading) && (
          <div
            className={`avatar-upload ${
              !isValidPicture ? "invalid-image" : ""
            }`}
          >
            <div className={`inner-container `}>
              {!isLoading && isValidPicture && (
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
              {!isValidPicture && (
                <>
                  <input
                    type={"file"}
                    name="avatar"
                    className="upload-input-box"
                    onChange={handleChange}
                  />
                  <div className="inner-container-text">
                    <h2>Error: This file type isn't supported.</h2>
                    <h2>For best results, select a PNG or JPG file</h2>
                    <button
                      className="button-underLine"
                      style={{ pointerEvents: "none", marginLeft: ".5rem" }}
                    >
                      Upload another file
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        )}
        {!addPhoto && !isLoading && isSuccess && data?.original && (
          <PreviewAvatar
            src={data?.original ? data?.original : ""}
            handleChange={handleChangePhoto}
            handleDone={onClose}
          />
        )}
      </div>
    </div>
  );
};
