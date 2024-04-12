/* global axios */
import { useEffect, useState } from "react";
import { csrftokenURL, deleteTrashURL } from "../../config";
import useFetchCSRFToken from "./FetchCSRFToken";

export default function useDeleteTrashItems(items) {
  const CSRFToken = useFetchCSRFToken(csrftokenURL);
  const [deleteTrash, setDeleteTrash] = useState(false);
  const [deleteStatus, setDeleteStatus] = useState(null);

  const init = () => {
    setDeleteTrash(true);
  };

  useEffect(() => {
    if (deleteTrash && CSRFToken.length > 0) {
      (async () => {
        const headers = {
          "X-CSRF-Token": CSRFToken,
          "Content-Type": "application/x-www-form-urlencoded",
        };
        try {
          const body = { items: JSON.stringify(items) };
          const res = await axios.post(deleteTrashURL, body, {
            headers: headers,
          });
          setDeleteTrash(false);
          setDeleteStatus(res.data);
        } catch (err) {
          console.log(err);
        }
      })();
    }
  }, [deleteTrash, CSRFToken, items]);

  return [deleteTrash, deleteStatus, init];
}
