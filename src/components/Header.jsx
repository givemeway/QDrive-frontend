import { CustomBlueButton } from "./Buttons/BlueButton";
import { GreyButton } from "./Buttons/GreyButton";

export const Header = () => {
  return (
    <div className="w-full h-[60px] flex flex-row justify-start items-center  border-b border-[#EBE9E6">
      <div className="flex justify-center items-center h-full pl-2">
        <h2 className="font-bold">QDrive</h2>
      </div>
      <div className="grow"></div>
      <div className="flex gap-2 h-full items-center pl-2 pr-2">
        <CustomBlueButton text={"Login"} style={{ width: 75, height: "60%" }} />
        <GreyButton text={"Signup"} style={{ width: 75, height: "60%" }} />
      </div>
    </div>
  );
};
