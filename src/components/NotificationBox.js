import { motion } from "framer-motion";
import { useOutsideAlerter } from "../Hooks";
import { useRef } from "react";
import { XIcon } from "../static/icons";

function NotificationBox(props) {
  const notificationRef = useRef(null);
  useOutsideAlerter(
    notificationRef,
    props.notification.show === true,
    props.notification.setShow,
    false
  );
  return (
    <motion.div
      ref={notificationRef}
      key="notification"
      animate={{ opacity: 1, y: "-50%", x: "-50%" }}
      initial={{ y: "-30%", x: "-50%" }}
      exit={{ opacity: 0 }}
      className={`shadow-lg notification flex flex-col w-full max-w-lg absolute top-1/2 left-1/2 rounded transform -translate-y-2/3 -translate-x-1/2 ${props.notification.classes}`}
    >
      <div onClick={() => props.notification.setShow(false)}>
        <XIcon
          className={`fill-current text-white h-4 absolute top-1 right-1 cursor-pointer ${props.notification.xcolor}`}
        />
      </div>
      <div className="my-3 mx-2 p-2 text-sm">
        {props.notification.text.map((paragraph, i) => {
          return (
            <p key={i} className="mt-2">
              {paragraph}
            </p>
          );
        })}
      </div>
      <div className="flex justify-center mb-5">
        {props.notification.buttons.map((button, i) => {
          return (
            <button
              key={i}
              onClick={() => button.callback()}
              className={`${button.class} mx-1`}
            >
              {button.text}
            </button>
          );
        })}
      </div>
    </motion.div>
  );
}

export default NotificationBox;
