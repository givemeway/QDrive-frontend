/*global axios */

import { useEffect, useState } from "react";
import { csrftokenURL, getTrashBatchURL } from "../../config";
import useFetchCSRFToken from "./FetchCSRFToken";

const singleFile = "singleFile";
const bulk = "bulk";

export default function useFetchTrashBatch(selectedTrashItem) {
  const [files, setFiles] = useState([]);
  const [loaded, setLoaded] = useState(false);
  const CSRFToken = useFetchCSRFToken(csrftokenURL);
  const { name, path, begin, items, end, item, id } = selectedTrashItem;

  const fetchBatchItems = (CSRFToken, path, name, begin, end) => {
    (async () => {
      let url = "";
      if (item === singleFile) {
        url = `${getTrashBatchURL}?id=${id}&item=${singleFile}`;
      } else {
        url = `${getTrashBatchURL}?path=${path}&folder=${name}&begin=${begin}&end=${end}&item=${bulk}`;
      }

      const headers = {
        "X-CSRF-Token": CSRFToken,
        "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
      };
      try {
        const res = await axios.post(url, {}, { headers: headers });
        setFiles((prev) => [...prev, ...res.data]);
      } catch (err) {
        console.error(err);
      }
    })();
  };

  useEffect(() => {
    setLoaded(false);
    if (CSRFToken.length > 0) {
      if (items === undefined) {
        fetchBatchItems(CSRFToken, path, name, begin, end);
        setLoaded(true);
      } else {
        for (const item of items) {
          const { name, path, limit } = item;
          fetchBatchItems(CSRFToken, path, name, limit.begin, limit.end);
        }
        setLoaded(true);
      }
    }
  }, [CSRFToken]);

  return [files, loaded];
}
