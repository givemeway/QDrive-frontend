import { useEffect } from "react";

const useOutSideClick = (ref1, callback, ref2) => {
  const handleClick = (e) => {
    if (!ref2?.current && ref1?.current && !ref1.current.contains(e.target)) {
      callback();
    }
    if (
      ref2?.current &&
      ref1?.current &&
      !ref1.current.contains(e.target) &&
      !ref2.current.contains(e.target)
    ) {
      callback();
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClick);
    return () => {
      document.removeEventListener("mousedown", handleClick);
    };
  });
};

export default useOutSideClick;
