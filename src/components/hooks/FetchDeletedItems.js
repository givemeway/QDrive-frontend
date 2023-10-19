/*global axios */

import { useState, useEffect } from "react";
import { deletedItemsURL } from "../../config";

export default function useFetchDeletedItems() {
  const [items, setItems] = useState([]);
  const [start, setStart] = useState(false);
  const initFetchDeleted = () => {
    setStart(true);
  };
  const fetchDeleted = async () => {
    const res = await axios.get(deletedItemsURL);
    setItems(res.data);
  };
  useEffect(() => {
    if (start) {
      fetchDeleted();
      setStart(false);
    }
  }, [start]);
  return [items, initFetchDeleted];
}
