import "./AccountSsecurity.css";

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
