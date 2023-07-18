import { useEffect, useRef, useState } from "react";

export const useOutsideAlerter = (initialValue: boolean) => {
  const ref = useRef<HTMLElement | null>(null);
  const [show, setShow] = useState<boolean>(initialValue);

  const handleClickOutside = (event:any) => {
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
