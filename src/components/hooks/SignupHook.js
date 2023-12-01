/* global axios */

import { useState } from "react";
import { csrftokenURL, signupURL } from "../../config";
import useFetchCSRFToken from "./FetchCSRFToken";
import { useEffect } from "react";

export default function useSignup() {
  const CSRFToken = useFetchCSRFToken(csrftokenURL);
  const [init, setInit] = useState(false);
  const [form, setForm] = useState({});
  const [response, setResponse] = useState(undefined);

  const signup = (form) => {
    setForm(form);
    setInit(true);
  };
  const initSignup = (form, CSRFToken) => {
    return new Promise(async (resolve, reject) => {
      try {
        const headers = {
          "X-CSRF-Token": CSRFToken,
          "Content-Type": "application/json",
        };
        const body = { ...form };
        const res = await axios.post(signupURL, body, { headers: headers });
        resolve(res);
      } catch (err) {
        reject(err);
      }
    });
  };
  useEffect(() => {
    if (init && CSRFToken?.length > 0) {
      initSignup(form, CSRFToken)
        .then((res) => {
          setResponse(res.data);
        })
        .catch((err) => {
          console.log(err);
          if (err?.response.status === 409) {
            setResponse(() => ({
              success: false,
              status: 409,
              msg: "Username Exists!",
            }));
          } else if (err?.response.status === 500) {
            setResponse(() => ({
              success: false,
              status: 409,
              msg: "Username Exists!",
            }));
          }
        });
    }
  }, [init, form, CSRFToken]);

  return [signup, response];
}
