import { useEffect } from "react";

const useOutSideClick = (ref1, callback, ref2) => {
  const handleClick = (e) => {
    console.log(ref1?.current?.contains(e.target));
    if (!ref2?.current && ref1?.current && !ref1.current.contains(e.target)) {
      console.log("cb1");
      callback();
    }
    if (
      ref2?.current &&
      ref1?.current &&
      !ref1.current.contains(e.target) &&
      !ref2.current.contains(e.target)
    ) {
      console.log("cb2");
      callback();
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClick);
    return () => {
      console.log("click event removed");
      document.removeEventListener("mousedown", handleClick);
    };
  });
};

export default useOutSideClick;
