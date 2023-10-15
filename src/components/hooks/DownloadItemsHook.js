import { useState, useEffect } from "react";

import { csrftokenURL, get_download_zip } from "../../config.js";
import useFetchCSRFToken from "../FetchCSRFToken.js";

function useDownload(fileIds, directories) {
  const [isDownload, setIsDownload] = useState(false);
  const CSRFToken = useFetchCSRFToken(csrftokenURL);

  const initDownload = () => {
    setIsDownload(true);
  };

  useEffect(() => {
    if (
      isDownload &&
      CSRFToken.length > 0 &&
      (fileIds.length > 0 || directories.length > 0)
    ) {
      const headers = {
        "X-CSRF-Token": CSRFToken,
        "Content-Type": "application/json",
      };
      const body = {
        files: fileIds,
        directories: directories,
      };
      const options = {
        method: "POST",
        credentials: "include",
        headers: headers,
        body: JSON.stringify(body),
      };

      fetch(get_download_zip, options)
        .then((res) => res.json())
        .then((data) => {
          const { key } = data;
          window.open(
            `https://localhost:3001/app/downloadItems?key=${key}&dl=1`,
            "_parent"
          );
          setIsDownload(false);
        })
        .catch((err) => console.error(err));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isDownload, CSRFToken, fileIds, directories]);

  return [initDownload, isDownload];
}

export default useDownload;
