import { useState, useEffect } from "react";

import { csrftokenURL, get_download_zip } from "../../config.js";

async function fetchCSRFToken(csrfurl) {
  const response = await fetch(csrfurl);
  const { CSRFToken } = await response.json();
  return CSRFToken;
}

const useDownload = (fileIds, directories) => {
  const [CSRFToken, setCSRFToken] = useState("");
  const [startDownload, setStartDownload] = useState(false);

  console.log("custom hook download items");

  useEffect(() => {
    fetchCSRFToken(csrftokenURL)
      .then((csrftoken) => {
        setCSRFToken(csrftoken);
      })
      .catch((err) => console.log(err));
  }, []);

  useEffect(() => {
    if (
      startDownload &&
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
          setStartDownload(false);
        })
        .catch((err) => console.error(err));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [startDownload, CSRFToken]);

  return setStartDownload;
};

export default useDownload;
