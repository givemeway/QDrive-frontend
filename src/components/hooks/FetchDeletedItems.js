/*global axios */

import { useState, useEffect } from "react";
import { deletedItemsURL } from "../../config";

export default function useFetchDeletedItems() {
  const [deletedItems, setItems] = useState([]);
  const [deletedLoaded, setDeletedLoaded] = useState(false);
  const [start, setStart] = useState(false);
  const [page, setPage] = useState({ begin: 0, size: 25 });
  const initFetchDeleted = (begin, size) => {
    setStart(true);
    setPage({ begin, size });
    setDeletedLoaded(false);
  };
  useEffect(() => {
    if (start) {
      (async () => {
        const res = await axios.get(
          deletedItemsURL + `?begin=${page.begin}&page=${page.size}`
        );
        setItems(res.data);
      })();
      setStart(false);
      setDeletedLoaded(true);
    }
  }, [start, page.size, page.begin]);
  return [deletedItems, initFetchDeleted, deletedLoaded];
}
