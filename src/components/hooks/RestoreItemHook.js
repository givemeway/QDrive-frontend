/* global axios */
import { useEffect, useState } from "react";
import { csrftokenURL, restoreTrashItems } from "../../config";
import useFetchCSRFToken from "./FetchCSRFToken";

export default function useRestoreItems(items) {
  const CSRFToken = useFetchCSRFToken(csrftokenURL);
  const [restoreTrash, setRestoreTrash] = useState(false);
  const [restoreStatus, setRestoreStatus] = useState("");

  const init = () => {
    setRestoreTrash(true);
  };

  useEffect(() => {
    if (restoreTrash && CSRFToken?.length > 0) {
      (async () => {
        try {
          const headers = {
            "X-CSRF-Token": CSRFToken,
            "Content-Type": "application/x-www-form-urlencoded",
          };
          const body = { items: JSON.stringify(items) };
          const res = await axios.post(restoreTrashItems, body, {
            headers: headers,
          });
          setRestoreTrash(false);
          setRestoreStatus(res.data);
        } catch (err) {
          console.error(err);
        }
      })();
    }
  }, [restoreTrash, CSRFToken]);

  return [restoreTrash, restoreStatus, init];
}
