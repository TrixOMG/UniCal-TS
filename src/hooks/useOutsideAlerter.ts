import { useEffect, useRef, useState } from "react";

export const useOutsideAlerter = (initialValue) => {
  const ref = useRef(null);
  const [show, setShow] = useState(initialValue);

  const handleClickOutside = (event) => {
    if (ref.current && !ref.current.contains(event.target)) setShow(false);
  };

  useEffect(() => {
    document.addEventListener("click", handleClickOutside, true);
    return () => {
      document.removeEventListener("click", handleClickOutside, true);
    };
  }, [ref]);

  return { show, setShow, ref };
};
