import { useEffect } from "react";

function useOutsideAlerter(ref, condition, callback, callbackparam) {
  /* First argument is a ref to a DOM element, if clicked outside this element it will run the callback function and set it to false.*/
  useEffect(() => {
    /**
     * Alert if clicked on outside of element
     */
    function handleClickOutside(event) {
      if (
        ref.current &&
        !ref.current.contains(event.target) &&
        condition === true
      ) {
        callback(callbackparam);
      }
    }

    // Bind the event listener
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      // Unbind the event listener on clean up
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [ref, condition]);
}

export { useOutsideAlerter };
