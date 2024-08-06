import { useState } from "react";
import { EyeIcon } from "./icons/Eye.js";
import { EyeCrossIcon } from "./icons/EyeCross.js";
import "./PasswordFieldWithMask.css";

export const PasswordFieldWithMask = ({
  onChange,
  onBlur,
  onFocus,
  value,
  style,
  name,
}) => {
  const [showPass, setShowPass] = useState(false);
  const showPassword = () => {
    setShowPass((prev) => !prev);
  };

  return (
    <div className="flex-relative">
      <input
        type={`${!showPass ? "password" : "text"}`}
        onChange={onChange}
        value={value}
        className="password-input"
        onFocus={onFocus}
        onBlur={onBlur}
        name={name ? name : "password"}
        {...style}
      />
      {!showPass && (
        <EyeIcon
          style={{
            style: {
              position: "absolute",
              right: "10px",
              cursor: "pointer",
            },
          }}
          onClick={showPassword}
        />
      )}
      {showPass && (
        <EyeCrossIcon
          style={{
            style: { position: "absolute", right: "10px", cursor: "pointer" },
          }}
          onClick={showPassword}
        />
      )}
    </div>
  );
};
