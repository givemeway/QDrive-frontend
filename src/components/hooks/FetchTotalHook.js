/*global axios */

import { useState, useEffect } from "react";

export default function useFetchTotal() {
  const [start, setStart] = useState(false);
  const [total, setTotal] = useState(0);
  const [url, setUrl] = useState("");
  const fetchTotal = (url) => {
    setStart(true);
    setUrl(url);
  };

  useEffect(() => {
    if (start) {
      (async () => {
        try {
          const res = await axios.get(url);
          setTotal(res.data.fileCount + res.data.folderCount);
        } catch (err) {
          console.log(err);
        }
      })();
      setStart(false);
    }
  }, [start, url]);

  return [total, fetchTotal];
}
