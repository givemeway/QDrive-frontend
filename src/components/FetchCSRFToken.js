import { useState, useEffect } from "react";

function useFetchCSRFToken(csrftokenURL) {
  const [CSRFToken, setCSRFToken] = useState("");

  async function fetchCSRFToken(csrfurl) {
    const response = await fetch(csrfurl);
    const { CSRFToken } = await response.json();
    return CSRFToken;
  }
  useEffect(() => {
    fetchCSRFToken(csrftokenURL)
      .then((csrftoken) => {
        setCSRFToken(csrftoken);
      })
      .catch((err) => console.log(err));
  }, [csrftokenURL]);
  return CSRFToken;
}

export default useFetchCSRFToken;
