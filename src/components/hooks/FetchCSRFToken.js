import { useState, useEffect } from "react";

function useFetchCSRFToken(csrftokenURL) {
  const [CSRFToken, setCSRFToken] = useState("");

  function fetchCSRFToken(csrfurl) {
    return new Promise(async (resolve, reject) => {
      try {
        const response = await fetch(csrfurl);
        const { CSRFToken } = await response.json();
        resolve(CSRFToken);
      } catch (err) {
        console.error(err);
        reject(err);
      }
    });
  }
  useEffect(() => {
    fetchCSRFToken(csrftokenURL)
      .then((csrftoken) => {
        setCSRFToken(csrftoken);
      })
      .catch((err) => {
        setCSRFToken("");
        console.log(err);
      });
  }, [csrftokenURL]);
  return CSRFToken;
}

export default useFetchCSRFToken;
