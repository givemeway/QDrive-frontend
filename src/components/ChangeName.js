import { useEffect, useState, useRef } from "react";
import { useSelector } from "react-redux";
import useOutSideClick from "./hooks/useOutsideClick";
import CloseIcon from "@mui/icons-material/Close";

export const ChangeName = ({ onClose, query }) => {
  const { firstName, lastName } = useSelector((state) => state.avatar);
  const ref = useRef(null);
  const [validateName, setValidateName] = useState(true);
  const [name, setName] = useState({ firstName, lastName });

  useOutSideClick(ref, onClose);

  const handleChange = (e) => {
    setName((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleNameSubmit = () => {
    query({ firstname: name.firstName, lastname: name.lastName });
    onClose();
  };

  useEffect(() => {
    if (
      name.firstName !== "" &&
      name.lastName !== "" &&
      (name.firstName.toLowerCase() !== firstName.toLowerCase() ||
        name.lastName.toLowerCase() !== lastName.toLowerCase())
    ) {
      setValidateName(false);
    } else {
      setValidateName(true);
    }
  }, [name.firstName, name.lastName, firstName, lastName]);

  return (
    <div className="modal">
      <div className="change-your-name-box" ref={ref}>
        <div className="modal-heading">
          <h2 className="accountpage-heading">Change your name</h2>
          <CloseIcon className="button-close" onClick={onClose} />
        </div>
        <input
          placeholder="First Name"
          value={name.firstName}
          onChange={handleChange}
          name="firstName"
          className="inputbox"
        ></input>
        <input
          placeholder="Last Name"
          value={name.lastName}
          onChange={handleChange}
          name="lastName"
          className="inputbox"
        ></input>
        <div className="button-container">
          <button className="button-cancel" onClick={onClose}>
            Cancel
          </button>
          <button
            className={`button-save ${validateName ? "disabled" : ""}`}
            onClick={handleNameSubmit}
            disabled={validateName}
          >
            Change name
          </button>
        </div>
      </div>
    </div>
  );
};
