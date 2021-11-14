import { useOutsideAlerter } from "../Hooks";
import { useRef, useState } from "react";
import { addToDoTask } from "../firebase";
import { motion } from "framer-motion";

function TodoInput(props) {
  const [task, setTask] = useState("");

  const todoInputRef = useRef(null);
  useOutsideAlerter(
    todoInputRef,
    props.showTodoInput === true,
    props.setShowTodoInput,
    false
  );
  function handleTaskAdd(e) {
    if (!(task === "") && (e.key === "Enter" || e.type === "click")) {
      setTask("");
      props.setShowTodoInput(false);
      addToDoTask(props.user.uid, props.selectedCategory, task);
    }
  }

  return (
    <motion.div
      key="modal"
      animate={{ opacity: 1, y: "-50%", x: "-50%" }}
      initial={{ y: "0%", x: "-50%" }}
      exit={{ opacity: 0 }}
      id="inputdiv"
      ref={todoInputRef}
      className={`shadow-lg absolute bg-gray-100 rounded top-1/2 left-1/2 transform p-2 flex flex-col`}
    >
      <input
        className="bg-white bg-opacity-100 p-2 text-gray-600"
        autoFocus
        type="text"
        placeholder="Enter task"
        onChange={(e) => setTask(e.target.value)}
        onKeyPress={(e) => handleTaskAdd(e)}
        value={task}
      />
      <button
        onClick={(e) => handleTaskAdd(e)}
        type="submit"
        className="bg-blue-500 w-full mt-2 mx-auto"
      >
        Add
      </button>
    </motion.div>
  );
}

export default TodoInput;
