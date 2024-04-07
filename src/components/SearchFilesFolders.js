import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { CustomBlueButton } from "./Buttons/BlueButton";
import { HamburgerIcon } from "./icons/HamburgerIcon";
import AvatarMenu from "./AvatarMenu";

export default function Search({ searchValue }) {
  const navigate = useNavigate();
  const [query, setQuery] = useState(searchValue);
  const handleChange = (e) => {
    setQuery(e.target.value);
  };
  useEffect(() => {
    setQuery(searchValue);
  }, [searchValue]);
  return (
    <div className="flex flex-row justify-start items-center w-full h-full">
      <div className="block md:hidden">
        <HamburgerIcon style={{ width: 50, height: "100%" }} />
      </div>
      <div className="flex justify-start items-center h-full w-1/2">
        <input
          placeholder=" Search"
          value={query}
          onChange={handleChange}
          className="outline-none border border-[#DBDBDB] focus:border-0 focus:shadow-md  grow h-full"
        />

        <CustomBlueButton
          text={"Search"}
          style={{ width: "100px", height: "100%" }}
          onClick={() => navigate(`/dashboard/search/${query}`)}
        />
      </div>
      <div className="flex grow items-center h-full justify-end">
        <AvatarMenu />
      </div>
    </div>
  );
}
