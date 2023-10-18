/*global axios */
import { useEffect, useState } from "react";
import { deleteItemsURL } from "../../config";

export default function useDeleteItems(fileIds, directories, CSRFToken) {
  const [deleting, setDeleting] = useState(false);
  const [deleted, setDeleted] = useState(false);
  const [failed, setFailed] = useState(0);
  const [itemsDeleted, setItemsDeleted] = useState(0);

  const initDelete = () => {
    setDeleting(true);
  };

  useEffect(() => {
    if (
      deleting &&
      CSRFToken.length > 0 &&
      (fileIds.length > 0 || directories.length > 0)
    ) {
      const headers = {
        "X-CSRF-Token": CSRFToken,
        "Content-Type": "application/x-www-form-urlencoded",
      };
      const body = {
        fileIds: JSON.stringify([...fileIds]),
        directories: JSON.stringify([...directories]),
      };
      setDeleted(false);
      (async () => {
        const res = await axios.post(deleteItemsURL, body, {
          headers: headers,
        });
        setItemsDeleted(fileIds.length + directories.length);
        setFailed(res.data.files.length + res.data.folders.length);
        setDeleted(true);
        setDeleting(false);
      })();
    }
  }, [deleting]);

  return [initDelete, deleting, deleted, failed, itemsDeleted];
}
