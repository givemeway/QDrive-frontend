/*global axios */
import { useState, useEffect } from "react";
import { searchURL } from "../../config";

export default function useFetchSearchItems(subpath, csrftoken) {
  const [isSearching, setIsSearching] = useState(false);
  const [startSearch, setStartSearch] = useState(false);
  const [searchParam, setSearchParam] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [searchLoaded, setSearchLoaded] = useState(false);

  const initSearch = () => {
    setStartSearch(true);
  };

  const search = async (value) => {
    try {
      const res = await axios.get(searchURL + `?search=${value}`);
      setSearchResult(res.data);
      setSearchLoaded(true);
      setIsSearching(false);
    } catch (err) {
      console.log(err);
      setSearchResult([]);
      setSearchLoaded(true);
      setIsSearching(false);
    }
  };

  useEffect(() => {
    const path = subpath.split("/");
    if (path[0] === "search" && csrftoken.length > 0 && startSearch) {
      const param = path.slice(1)[0];
      console.log(param);
      setIsSearching(true);
      setSearchParam(param);
      search(param);
    }
  }, [csrftoken, subpath, startSearch]);

  return [searchResult, initSearch, searchLoaded, isSearching, searchParam];
}
