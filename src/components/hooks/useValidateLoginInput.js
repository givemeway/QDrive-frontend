import { useEffect, useState } from "react";

function useValidateInput(loginform) {
  const [valid, setValid] = useState(false);
  const [encodedData, setEncodedData] = useState("");
  useEffect(() => {
    if (loginform.username.length > 0 && loginform.password.length > 0) {
      const encodedData = btoa(`${loginform.username}:${loginform.password}`);
      setEncodedData(encodedData);
      setValid(true);
    } else {
      setValid(false);
    }
  }, [loginform.username, loginform.password]);

  return [valid, encodedData];
}

export default useValidateInput;
