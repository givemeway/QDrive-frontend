/* global axios */
import { useEffect, useState } from "react";
import useFetchCSRFToken from "./FetchCSRFToken";
import { csrftokenURL, createFolderURL } from "../../config";

export default function useCreateFolder(subpath) {
  const [response, setResponse] = useState({ success: null, msg: null });
  const [init, setInit] = useState(false);
  const [folder, setFolder] = useState(null);
  const CSRFToken = useFetchCSRFToken(csrftokenURL);

  const createFolder = (folder) => {
    setInit(true);
    setFolder(folder);
  };

  useEffect(() => {
    if (init && CSRFToken.length > 0) {
      const url = `${createFolderURL}?subpath=${subpath}&folder=${folder}`;
      const headers = {
        "X-CSRF-Token": CSRFToken,
      };
      (async () => {
        try {
          const res = await axios.post(url, {}, { headers: headers });
          console.log(res);
          setResponse(() => ({ success: res.data.success, msg: res.data.msg }));
        } catch (err) {
          console.log(err);
          if (err?.response.status === 500) {
            setResponse(() => ({
              success: false,
              msg: err?.response?.statusText,
            }));
          } else {
            setResponse(() => ({
              success: false,
              msg: err?.response?.data?.msg,
            }));
          }
        }
      })();
    }
  }, [init, CSRFToken, subpath, folder]);

  return [createFolder, response];
}
