import { Switch } from "@mui/material";
import "./AccountSsecurity.css";
import { useSelector } from "react-redux";

const TwoFAInfo = ({ handle2FAEdit }) => {
  const { isTOTP, isEmail } = useSelector((state) => state.avatar);

  return (
    <div className="twofa-info-box">
      <div className="twofa-info-row twofa-info-row-border-bottom ">
        <div className="twofa-info-row-context-container">
          <span className="twofa-info-label">Preferred Method</span>
          <p className="twofa-info-p">Choose how to get your security codes.</p>
        </div>
        <div className="twofa-info-action-container">
          {isTOTP && (
            <span className="twofa-info-label">Authenticator app</span>
          )}
          {isEmail && <span className="twofa-info-label">Email</span>}
          <button className="button-underLine " onClick={handle2FAEdit}>
            Edit
          </button>
        </div>
      </div>
      <div className="twofa-info-row twofa-info-row-border-bottom ">
        <div className="twofa-info-row-context-container">
          <span className="twofa-info-label">Backup Method</span>
          <p className="twofa-info-p">
            Add a backup phone number for security codes.
          </p>
        </div>
        <div className="twofa-info-action-container">
          <button className="button-underLine">Add</button>
        </div>
      </div>
      <div className="twofa-info-row  ">
        <div className="twofa-info-row-context-container">
          <span className="twofa-info-label">Trusted Devices</span>
          <p className="twofa-info-p">
            Revoke trusted status from your devices that skip two-step
            verification.
          </p>
        </div>
        <div className="twofa-info-action-container">
          <button className="button-underLine"> Revoke All</button>
        </div>
      </div>
    </div>
  );
  {
  }
};

export const AccountPrivacy = ({ handleCancel }) => {
  return (
    <div className="accountpage-profile-container">
      <div className="accountpage-profile-row">
        <div className="accountpage-security-row-label-container">
          <span
            className="accountpage-profile-row-label"
            style={{ width: "100%" }}
          >
            Cancel Account
          </span>
          <p className="accountpage-security-row-p">
            Close the account to erase all your data from the servers.
          </p>
        </div>
        <div className="accountpage-profile-edit-container">
          <button className="button-underLine" onClick={handleCancel}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};
