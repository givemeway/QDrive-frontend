import { useNavigate } from "react-router-dom";
import { HamburgerIcon } from "./icons/HamburgerIcon";
import { useState, useEffect } from "react";
import { SearchIcon } from "./icons/SearchIcon";
import AvatarMenu from "./AvatarMenu";
import { useDispatch } from "react-redux";
import { setPanel } from "../features/navigation/navigationPanelSlice";
import { CloseIconSmall as CloseIcon } from "./icons/CloseIconSmall";
import "./SearchFilesFolders.css";

export default function Search({ searchValue }) {
  const navigate = useNavigate();
  const [query, setQuery] = useState(searchValue);
  const [isSearchFocus, setIsSearchFocus] = useState(false);
  const [context, setContext] = useState(false);
  const dispatch = useDispatch();
  const handleContext = (e) => {
    e.stopPropagation();
    setContext((prev) => !prev);
  };

  const handleSearchFocus = () => {
    setIsSearchFocus(true);
    navigate(`/dashboard/search`);
  };

  const handleSearchClose = () => {
    setIsSearchFocus(false);
    setQuery("");
    navigate(`/dashboard/home`);
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
    <div className="header-container" onClick={(e) => e.stopPropagation()}>
      <div
        className="search-hamburgericon-container"
        onClick={(e) => e.stopPropagation()}
      >
        <HamburgerIcon
          style={{ width: 30, height: 30, cursor: "pointer" }}
          onClick={handleContext}
        />
      </div>

      <div className="search-container">
        <SearchIcon
          className="search-icon"
          onClick={() => navigate(`/dashboard/search/${query}`)}
        />
        {isSearchFocus && (
          <CloseIcon
            className="search-close-icon"
            onClick={handleSearchClose}
          />
        )}
        <input
          placeholder=" Search"
          value={query}
          onChange={handleChange}
          className="search-input"
          onFocus={handleSearchFocus}
        />
      </div>
      <div className="avatar-container">
        <AvatarMenu />
      </div>
    </div>
  );
}
