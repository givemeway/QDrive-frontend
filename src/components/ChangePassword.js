import { useState, useRef } from "react";
import useOutSideClick from "./hooks/useOutsideClick";
import CloseIcon from "@mui/icons-material/Close";
import { PasswordFieldWithMask } from "./PasswordFieldWithMask";
import { PasswordsValidation } from "./PasswordReset";

export const ChangePassword = ({ onClose, query }) => {
  const ref = useRef(null);

  const [password, setPassword] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [isPassValid, setIsPassValid] = useState(false);
  const [isFormSubmitted, setIsFormSubmitted] = useState(false);
  const [isPassMatch, setIsPassMatch] = useState(false);
  const [updatePass, setUpdatePass] = useState("");

  useOutSideClick(ref, onClose);

  const handleChange = (e) => {
    setPassword((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const submitPass = () => {
    setIsFormSubmitted(true);
    if (isPassValid && isPassMatch) {
      onClose();
      query({
        old_password: password.oldPassword,
        new_password: updatePass,
      });
    }
  };

  return (
    <div className="modal">
      <div className="change-your-name-box" ref={ref}>
        <div className="modal-heading">
          <h2 className="accountpage-heading">Change password</h2>
          <CloseIcon className="button-close" onClick={onClose} />
        </div>

        <PasswordFieldWithMask
          placeholder="Old Password"
          value={password.oldPassword}
          onChange={handleChange}
          name={"oldPassword"}
          style={{ borderRadius: "0.75rem" }}
        />

        <PasswordsValidation
          password={updatePass}
          setPassword={setUpdatePass}
          isFormSubmitted={isFormSubmitted}
          setIsFormSubmitted={setIsFormSubmitted}
          setIsPassValid={setIsPassValid}
          setIsPassMatch={setIsPassMatch}
          style={{ borderRadius: "0.75rem" }}
        />
        <div className="button-container">
          <button className="button-cancel" onClick={onClose}>
            Cancel
          </button>
          <button className={`button-save`} onClick={submitPass}>
            Change password
          </button>
        </div>
      </div>
    </div>
  );
};
