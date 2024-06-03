import { useNavigate } from "react-router-dom";
import { HamburgerIcon } from "./icons/HamburgerIcon";
import { useState, useEffect } from "react";
import { CustomBlueButton } from "./Buttons/BlueButton";
import AvatarMenu from "./AvatarMenu";
import { useDispatch } from "react-redux";
import { setPanel } from "../features/navigation/navigationPanelSlice";

export default function Search({ searchValue }) {
  const navigate = useNavigate();
  const [query, setQuery] = useState(searchValue);
  const [context, setContext] = useState(false);
  const dispatch = useDispatch();
  const handleContext = (e) => {
    e.stopPropagation();
    setContext((prev) => !prev);
  };

  const handleChange = (e) => {
    setQuery(e.target.value);
  };
  useEffect(() => {
    setQuery(searchValue);
  }, [searchValue]);

  useEffect(() => {
    dispatch(setPanel(context));
  }, [context]);

  return (
    <div
      className="flex flex-row justify-start items-center w-full h-full"
      onClick={(e) => e.stopPropagation()}
    >
      <div
        className="flex flex-col justify-start items-start md:hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <HamburgerIcon
          style={{ width: 30, height: 30, cursor: "pointer" }}
          onClick={handleContext}
        />
      </div>

      <div className="flex justify-start items-center h-full grow">
        <input
          placeholder=" Search"
          value={query}
          onChange={handleChange}
          className="outline-none border border-[#DBDBDB] focus:border-0 focus:shadow-md  grow h-full"
        />

        <CustomBlueButton
          text={"Search"}
          style={{ width: "70px", height: "100%" }}
          onClick={() => navigate(`/dashboard/search/${query}`)}
        />
      </div>
      <div className="flex grow items-center h-full justify-end">
        <AvatarMenu />
      </div>
    </div>
  );
}
