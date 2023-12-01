/* global axios */

import { useState } from "react";
import { csrftokenURL, signupURL } from "../../config";
import useFetchCSRFToken from "./FetchCSRFToken";
import { useEffect } from "react";

export default function useSignup(form) {
  const CSRFToken = useFetchCSRFToken(csrftokenURL);
  const [init, setInit] = useState(false);

  const signup = () => {
    setInit(true);
  };
  const initSignup = (form, CSRFToken) => {
    return new Promise(async (resolve, reject) => {
      try {
        const headers = {
          "X-CSRF-Token": CSRFToken,
          "Content-Type": "application/x-www-form-urlencoded",
        };
        const body = {
          form: JSON.stringify(form),
        };
        const res = await axios.post(signupURL, body, { headers: headers });
        resolve(res);
      } catch (err) {
        console.error(err);
        reject(err);
      }
    });
  };
  useEffect(() => {
    if (init && CSRFToken?.length > 0) {
      initSignup(form, CSRFToken)
        .then((res) => console.log(res.data))
        .catch((err) => console.log(err));
    }
  }, [init]);

  return [signup];
}
