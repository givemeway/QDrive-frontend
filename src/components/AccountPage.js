import { useState } from "react";
import Tabs from "./SharedTab";
import { useSelector } from "react-redux";
import { Avatar } from "./AvatarMenu";
import "./AccountPage.css";
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
  return (
    <div className="w-full h-full flex flex-col justify-start">
      <h2 className="w-full font-semibold font-sans text-xl text-left h-[60px] flex items-center">
        Personal Account
      </h2>
      <Tabs tabs={tabs} setActiveTab={setActiveTabs} />
      <div className="w-full flex flex-col">
        <h2 className="w-full h-[50px] flex items-center text-left text-lg font-semibold">
          Basics
        </h2>
        <div className="w-full border-t flex flex-row items-center h-[75px] justify-between pl-2">
          <span className="text-[#1A1918] text-md">Photo</span>
          <div className="flex gap-2 h-full items-center">
            <Avatar initial={initial} />
            <button className="buttonUnderLine font-semibold">Edit</button>
          </div>
        </div>
        <div className="w-full border-t flex flex-row items-center h-[75px] justify-between pl-2">
          <span className="text-[#1A1918] text-md">Name</span>
          <div className="flex gap-2 h-full items-center">
            <span className="text-[#1A1918] capitalize text-md">
              {fullName}
            </span>
            <button className="buttonUnderLine font-semibold">Edit</button>
          </div>
        </div>
        <div className="w-full border-t border-b flex flex-row items-center h-[75px] justify-between pl-2">
          <span className="text-[#1A1918] text-md">Email</span>
          <div className="flex gap-2 h-full items-center">
            <span className="text-[#1A1918] text-md">{email}</span>
            <button className="buttonUnderLine font-semibold">Edit</button>
          </div>
        </div>
      </div>
      <div className="modal flex justify-center items-center">
        <div className="change-your-name-box">
          <div className="inputbox">
            <input
              placeholder="First Name"
              value={firstName}
              className="w-full h-[50px]"
            ></input>
            <input
              placeholder="Last Name"
              value={lastName}
              className="w-full h-[50px]"
            ></input>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountPage;
