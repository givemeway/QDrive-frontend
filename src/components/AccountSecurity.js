import { Switch } from "@mui/material";

export const AccountSecurity = ({ handlePassword, handleChange, checked }) => {
  return (
    <div className="accountpage-profile-container">
      <div className="accountpage-profile-row">
        <div className="accountpage-security-row-label-container">
          <span
            className="accountpage-profile-row-label"
            style={{ width: "100%" }}
          >
            Password
          </span>
          <p className="accountpage-security-row-p">
            Set a unique password to protect your personal Dropbox account.
          </p>
        </div>
        <div className="accountpage-profile-edit-container">
          <button className="button-underLine" onClick={handlePassword}>
            Change Password
          </button>
        </div>
      </div>
      <div className="accountpage-profile-row">
        <span className="accountpage-profile-row-label">
          Two-step verification
        </span>
        <div className="accountpage-profile-edit-container">
          <Switch onChange={handleChange} checked={checked} />
        </div>
      </div>
    </div>
  );
};
