import { useState } from "react";
import Tabs from "./SharedTab";
const AccountPage = () => {
  const [tabs, setActiveTabs] = useState({
    General: true,
    Security: false,
    Privacy: false,
  });
  console.log("account page rendered");
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
        <div className="w-full border-t flex flex-row justify-start items-center h-[75px]">
          Photo
        </div>
        <div className="w-full border-t flex flex-row justify-start items-center h-[75px]">
          Name
        </div>
        <div className="w-full border-t border-b flex flex-row justify-start items-center h-[75px]">
          Personal Email
        </div>
      </div>
    </div>
  );
};

export default AccountPage;
