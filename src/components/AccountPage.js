import { useState } from "react";
import Tabs from "./SharedTab";
import { useSelector } from "react-redux";
import { Avatar } from "./AvatarMenu";
import CloseIcon from "@mui/icons-material/Close";
import "./AccountPage.css";

const ChangeName = ({ firstName, lastName, onClose }) => {
  return (
    <div className="modal">
      <div className="change-your-name-box">
        <div className="modal-heading">
          <h2 className="accountpage-heading">Change your name</h2>
          <CloseIcon className="button-close" onClick={onClose} />
        </div>
        <input
          placeholder="First Name"
          value={firstName}
          className="inputbox"
        ></input>
        <input
          placeholder="Last Name"
          value={lastName}
          className="inputbox"
        ></input>
        <div className="button-container">
          <button className="button-cancel" onClick={onClose}>
            Cancel
          </button>
          <button className="button-save">Save</button>
        </div>
      </div>
    </div>
  );
};

const AccountPage = () => {
  const [tabs, setActiveTabs] = useState({
    General: true,
    Security: false,
    Privacy: false,
  });
  console.log("account page rendered");
  const { fullName, email, initial, firstName, lastName } = useSelector(
    (state) => state.avatar
  );

  const handleName = () => {
    setEdit({ type: "NAME", isEdit: true });
  };
  const handleAvatar = () => {
    setEdit({ type: "EMAIL", isEdit: true });
  };
  const handleEmail = () => {
    setEdit({ type: "AVATAR", isEdit: true });
  };

  const [edit, setEdit] = useState({ type: undefined, isEdit: false });

  return (
    <div className="accountpage-container">
      <h2 className="accountpage-heading">Personal Account</h2>
      <Tabs tabs={tabs} setActiveTab={setActiveTabs} />
      <div className="accountpage-profile-container">
        <h2 className="accountpage-profile-heading ">Basics</h2>
        <div className="accountpage-profile-row">
          <span className="accountpage-profile-row-label">Photo</span>
          <div className="accountpage-profile-edit-container">
            <Avatar initial={initial} />
            <button className="button-underLine" onClick={handleAvatar}>
              Edit
            </button>
          </div>
        </div>
        <div className="accountpage-profile-row">
          <span className="accountpage-profile-row-label">Name</span>
          <div className="accountpage-profile-edit-container">
            <span className="accountpage-profile-row-fullname">{fullName}</span>
            <button className="button-underLine " onClick={handleName}>
              Edit
            </button>
          </div>
        </div>
        <div className="accountpage-profile-row">
          <span className="accountpage-profile-row-label">Email</span>
          <div className="accountpage-profile-edit-container">
            <span className="accountpage-profile-row-label">{email}</span>
            <button className="button-underLine" onClick={handleEmail}>
              Edit
            </button>
          </div>
        </div>
      </div>
      {edit?.type === "NAME" && edit.isEdit && (
        <ChangeName
          onClose={() => setEdit({ type: undefined, isEdit: false })}
          firstName={firstName}
          lastName={lastName}
        />
      )}
    </div>
  );
};

export default AccountPage;
