import { RefObject, useEffect } from "react";

type EventCallback = (event: MouseEvent) => void;

const useClickOutside = (ref: RefObject<HTMLElement>, callback: EventCallback) => {
    useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (ref.current && !ref.current.contains(event.target as Node)) {
          callback(event)
        }
      };
  
      document.addEventListener('click', handleClickOutside)
  
      return () => {
        document.removeEventListener('click', handleClickOutside)
      };
    }, [ref, callback])
  };
  
  export default useClickOutside