import { useSelector } from "react-redux";
import { Avatar } from "./AvatarMenu";

export const AccountGeneral = ({
  handleAvatarAdd,
  handleName,
  handleEmail,
  handleAvatarDelete,
}) => {
  const { fullName, email, has_avatar } = useSelector((state) => state.avatar);
  return (
    <div className="accountpage-profile-container">
      <h2 className="accountpage-profile-heading ">Basics</h2>
      <div className="accountpage-profile-row">
        <span className="accountpage-profile-row-label">Photo</span>
        <div className="accountpage-profile-edit-container">
          <Avatar />
          <button className="button-underLine" onClick={handleAvatarAdd}>
            Edit
          </button>
          {has_avatar && (
            <button className="button-underLine" onClick={handleAvatarDelete}>
              Delete
            </button>
          )}
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
  );
};
