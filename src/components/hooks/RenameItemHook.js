/*global axios */
import { useEffect, useState } from "react";
import { csrftokenURL, renameURL } from "../../config";

import useFetchCSRFToken from "../FetchCSRFToken.js";

export default function useRename(fileIds, directories, edit, setEdit) {
  const csrfToken = useFetchCSRFToken(csrftokenURL);
  const [isRenamed, setIsRenamed] = useState(false);
  const [initRename, setInitRename] = useState(false);

  const rename = () => {
    setInitRename(true);
  };

  useEffect(() => {
    if (edit.editing && edit.val && csrfToken.length > 0) {
      const headers = {
        "X-CSRF-Token": csrfToken,
        "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
      };
      let body = {};
      if (fileIds.length > 0) {
        body.type = "fi";
        body.uuid = fileIds[0].origin;
        body.to = edit.val;
      } else {
        body.type = "fo";
        body.uuid = directories[0].uuid;
        let path_array = directories[0].path.split("/").slice(0, -1);
        path_array.push(edit.val);
        body.to = path_array.join("/");
      }

      (async () => {
        try {
          const res = await axios.post(renameURL, body, { headers: headers });
          console.log(res.data);
          setIsRenamed(true);
          setInitRename(false);
          setEdit((prev) => ({
            ...prev,
            edited: true,
            editStart: undefined,
            editStop: undefined,
            editing: false,
          }));
        } catch (err) {
          console.error(err);
        }
      })();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initRename]);

  return [rename, isRenamed];
}
