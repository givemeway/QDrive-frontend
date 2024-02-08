import { useEffect } from "react";

const useOutSideClick = (ref, callback) => {
  const handleClick = (e) => {
    if (ref.current && !ref.current.contains(e.target)) {
      console.log("close call back added");
      callback();
    }
  };

  useEffect(() => {
    console.log("<-->event click added-->");
    document.addEventListener("mousedown", handleClick);
    return () => {
      document.removeEventListener("mousedown", handleClick);
    };
  });
};

export default useOutSideClick;
