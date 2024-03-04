import { useEffect, useState } from "react";
import { csrftokenURL, loginURL } from "../../config";
import useFetchCSRFToken from "./FetchCSRFToken";
import useValidateInput from "./useValidateLoginInput";

function useValidateLogin(loginForm) {
  const [status, setStatus] = useState(0);
  const [logging, setLogging] = useState(false);
  const [loginClicked, setLoginClicked] = useState(false);
  const CSRFToken = useFetchCSRFToken(csrftokenURL);
  const [valid, encodedData] = useValidateInput(loginForm);

  const initLogin = () => {
    setLoginClicked((prev) => !prev);
    setLogging(true);
  };

  useEffect(() => {
    if (loginClicked && CSRFToken?.length > 0 && valid) {
      console.log("inside this");
      (async () => {
        const headers = {
          Authorization: `Basic ${encodedData}`,
          "X-CSRF-Token": CSRFToken,
          usernametype: "username",
        };

        const options = {
          method: "POST",
          credentials: "include",
          mode: "cors",
          headers: headers,
        };
        try {
          const res = await fetch(loginURL, options);
          const status = res.status;
          console.log(status);
          setStatus(status);
          setLogging(false);
        } catch (err) {
          console.error(err);
        }
      })();
    } else {
      setLogging(false);
    }
  }, [loginClicked, CSRFToken, valid]);

  return [logging, status, initLogin];
}

export default useValidateLogin;
