import { Delete } from "../static/icons";
import { deleteTask } from "../firebase";
import { motion } from "framer-motion";
import { useState } from "react";

function shallowEqual(object1, object2) {
  const keys1 = Object.keys(object1);
  const keys2 = Object.keys(object2);
  if (keys1.length !== keys2.length) {
    return false;
  }
  for (let key of keys1) {
    if (object1[key] !== object2[key]) {
      return false;
    }
  }
  return true;
}

function TodoItem(props) {
  const [checked, setChecked] = useState(false);
  const [checkedTask, setCheckedTask] = useState({
    email: props.user.email,
    category: props.selectedCategory,
    task: props.task,
  });

  function handleDelete() {
    deleteTask(props.user.email, props.selectedCategory, props.task);
    props.setCheckedTasks([
      ...props.checkedTasks.filter((object) => {
        return !shallowEqual(object, checkedTask);
      }),
    ]);
  }
  function handleChange() {
    if (!checked) {
      setChecked(true);
      props.setCheckedTasks([
        ...props.checkedTasks.filter((object) => {
          return !shallowEqual(object, checkedTask);
        }),
        checkedTask,
      ]);
    } else {
      setChecked(false);
      props.setCheckedTasks([
        ...props.checkedTasks.filter((object) => {
          return !shallowEqual(object, checkedTask);
        }),
      ]);
    }
  }

  return (
    <motion.div
      layout
      className="bg-gray-50 left-0 rounded px-3 py-4 w-full mb-1 flex items-center justify-between z-10"
    >
      <label className="container">
        <input type="checkbox" checked={checked} onChange={handleChange} />
        {props.task}
        <span className="checkmark rounded"></span>
      </label>
      <button
        className="transition-all material-icons -my-4 p-0 text-gray-400 opacity-80 hover:text-red-400 text-3xl cursor-pointer"
        onClick={() => handleDelete()}
      >
        delete_forever
        {/*<Delete className="w-7 text-white fill-current bg-red-400 rounded" />*/}
      </button>
    </motion.div>
  );
}

export default TodoItem;
