import { Switch } from "@mui/material";
import "./AccountSsecurity.css";
import { useSelector } from "react-redux";

export const AccountSecurity = ({
  handlePassword,
  handleChange,
  _2FA_switch,
  _2FA_status,
}) => {
  const { isTOTP, isEmail } = useSelector((state) => state.avatar);

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
      <div
        className={`accountpage-profile-row ${
          _2FA_switch ? "border-bottom-none" : ""
        }`}
      >
        <span className="accountpage-profile-row-label">
          Two-step verification
        </span>
        <div className="accountpage-profile-edit-container">
          <span>{_2FA_status}</span>
          <Switch onChange={handleChange} checked={_2FA_switch} />
        </div>
      </div>
      {_2FA_switch && (
        <div className="twofa-info-box">
          <div className="accountpage-profile-row padding-right">
            <div className="accountpage-profile-row-label">
              <span>Preferred Method</span>
              <p className="twofa-info-p">
                Choose how to get your security codes.
              </p>
            </div>
            <div className="two-info-action-container">
              {isTOTP && (
                <span className="accountpage-profile-row-label">
                  Authenticator app
                </span>
              )}
              {isEmail && (
                <span className="accountpage-profile-row-label">Email</span>
              )}
              <button className="button-underLine">Edit</button>
            </div>
          </div>
          <div className="accountpage-profile-row padding-right">
            <div className="accountpage-profile-row-label">
              <span>Backup Method</span>
              <p className="twofa-info-p">
                Add a backup phone number for security codes.
              </p>
            </div>
            <div className="two-info-action-container">
              <button className="button-underLine">Add</button>
            </div>
          </div>
          <div className="accountpage-profile-row border-bottom-none padding-right">
            <div className="accountpage-profile-row-label">
              <span>Trusted Devices</span>
              <p className="twofa-info-p">
                Revoke trusted status from your devices that skip two-step
                verification.
              </p>
            </div>
            <div className="two-info-action-container">
              <span></span>
              <button className="button-underLine"> Revoke All</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
