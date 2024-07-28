import { useEffect, useState, useRef } from "react";
import useOutSideClick from "./hooks/useOutsideClick";
import CloseIcon from "@mui/icons-material/Close";

export const ChangePassword = ({ onClose, query }) => {
  const ref = useRef(null);
  const [validatePassword, setValidatePassword] = useState(true);
  const [password, setPassword] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  useOutSideClick(ref, onClose);

  const handleChange = (e) => {
    setPassword((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleNameSubmit = () => {
    onClose();
    query({
      old_password: password.oldPassword,
      new_password: password.newPassword,
    });
  };

  useEffect(() => {
    if (
      password.oldPassword !== "" &&
      password.newPassword !== "" &&
      password.confirmPassword !== "" &&
      password.newPassword === password.confirmPassword &&
      password.oldPassword !== password.newPassword
    ) {
      setValidatePassword(false);
    } else {
      setValidatePassword(true);
    }
  }, [password.oldPassword, password.newPassword, password.confirmPassword]);

  return (
    <div className="modal">
      <div className="change-your-name-box" ref={ref}>
        <div className="modal-heading">
          <h2 className="accountpage-heading">Change password</h2>
          <CloseIcon className="button-close" onClick={onClose} />
        </div>
        <input
          placeholder="Old Password"
          type={"password"}
          value={password.oldPassword}
          onChange={handleChange}
          name="oldPassword"
          className="inputbox"
        />
        <input
          placeholder="New Password"
          type={"password"}
          value={password.newPassword}
          onChange={handleChange}
          name="newPassword"
          className="inputbox"
        />
        <input
          placeholder="Confirm Password"
          type={"password"}
          value={password.confirmPassword}
          onChange={handleChange}
          name="confirmPassword"
          className="inputbox"
        />
        <div className="button-container">
          <button className="button-cancel" onClick={onClose}>
            Cancel
          </button>
          <button
            className={`button-save ${validatePassword ? "disabled" : ""}`}
            onClick={handleNameSubmit}
            disabled={validatePassword}
          >
            Change password
          </button>
        </div>
      </div>
    </div>
  );
};
