import { useState, useEffect, useRef } from "react";
import useOutSideClick from "./hooks/useOutsideClick";
import CloseIcon from "@mui/icons-material/Close";
import { PasswordFieldWithMask } from "./PasswordFieldWithMask";
import WarningIcon from "@mui/icons-material/WarningRounded";
import "./CancelAccount.css";
import { useCancelUserMutation } from "../features/api/apiSlice";
import SpinnerGIF from "./icons/SpinnerGIF";
import { useDispatch } from "react-redux";
import { setOperation } from "../features/operation/operationSlice";
import { LOGOUT } from "../config";

export const CancelAccount = ({ onClose, query }) => {
  const ref = useRef(null);

  const [password, setPassword] = useState("");
  const dispatch = useDispatch();

  const [cancelUserQuery, cancelUserStatus] = useCancelUserMutation();

  const { isSuccess, isError, data, isLoading, error } = cancelUserStatus;

  useOutSideClick(ref, onClose);

  const handleChange = (e) => {
    setPassword(e.target.value);
  };

  const handleCancel = () => {
    if (password.length > 0) {
      cancelUserQuery({
        password,
      });
    }
  };

  useEffect(() => {
    if (isSuccess && data) {
      dispatch(
        setOperation({ type: LOGOUT, status: "initialized", open: false })
      );
    }
  }, [isLoading, isError, error, data, isSuccess]);

  return (
    <div className="modal">
      <div className="change-your-name-box" ref={ref}>
        <div className="modal-heading">
          <h2 className="accountpage-heading">
            Are you sure you want to cancel your account?
          </h2>
          <CloseIcon className="button-close" onClick={onClose} />
        </div>

        <PasswordFieldWithMask
          placeholder="Enter Account Password"
          value={password}
          onChange={handleChange}
          name={"oldPassword"}
        />
        {isError && error?.status === 404 && (
          <span className="text-left text-red-500 w-full">
            Incorrect password
          </span>
        )}
        <div className="caution-container">
          <div className="caution-icon-container">
            <WarningIcon color={"red"} sx={{ height: 50, width: 50 }} />
          </div>
          <div className="caution-note-container">
            <span className="caution-title">Caution</span>
            <p className="caution-p">
              On cancelling your QDrive account, all of your files and folders
              are permanently deleted from our servers.
            </p>
          </div>
        </div>
        <div className="button-container">
          <button className="button-cancel-account" onClick={handleCancel}>
            {!isLoading && <span>Cancel</span>}
            {isLoading && <SpinnerGIF style={{ height: 30, width: 30 }} />}
          </button>
          <button className={`button-save`} onClick={onClose}>
            Keep account
          </button>
        </div>
      </div>
    </div>
  );
};
