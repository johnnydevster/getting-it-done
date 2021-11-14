import TodoItem from "./TodoItem";
import faker from "faker";
import useCollapse from "react-collapsed";
import { useState, useEffect } from "react";
import { toggleShowCompleted } from "../firebase";

const nameGenerator = () => faker.name.findName();

const initialArray = [...Array(3)].map(nameGenerator);

function TodoDisplay(props) {
  const [isExpanded, setExpanded] = useState(false);
  const { getCollapseProps, getToggleProps } = useCollapse({
    isExpanded,
  });

  function handleToggle() {
    toggleShowCompleted(props.user.uid, props.selectedCategory, !isExpanded);
  }

  useEffect(() => {
    if (props.tasks) {
      if (
        props.selectedCategory &&
        props.tasks[props.selectedCategory]?.showcompleted
      ) {
        setExpanded(true);
      } else {
        setExpanded(false);
      }
    }
  });

  return (
    <div
      id="maintodo-area"
      className="text-gray-700 p-3 relative w-full sm:w-2/3 lg:w-1/2 xl:w-1/3 mx-auto"
    >
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-gray-400 text-sm">
          Category:{" "}
          <span className="text-gray-500 font-semibold">
            {props.selectedCategory}
          </span>
        </h2>
        <button
          onClick={() => props.setShowDeleteWarning(true)}
          className="transition-all bg-gray-300 text-gray-500 hover:bg-red-400 hover:text-white text-xs p-2"
        >
          Delete category
        </button>
      </div>
      {props.selectedCategory &&
        props.tasks[props.selectedCategory]?.tasks &&
        props.tasks[props.selectedCategory]?.tasks.map((task, i) => {
          if (!task.completed) {
            return (
              <TodoItem
                key={task.task}
                checkedTasks={props.checkedTasks}
                setCheckedTasks={props.setCheckedTasks}
                task={task.task}
                user={props.user}
                selectedCategory={props.selectedCategory}
              />
            );
          }
        })}
      {props.selectedCategory &&
        props.tasks[props.selectedCategory]?.tasks &&
        props.tasks[props.selectedCategory]?.tasks.filter(
          (task) => task.completed
        ).length > 0 && (
          <div className="mt-2 w-full">
            <div className="flex items-center">
              <i
                className={`select-none transition-all duration-400 ease-in-out material-icons text-gray-400 text-lg cursor-pointer ${
                  isExpanded ? "hover:text-red-400" : "hover:text-green-400"
                }`}
                onClick={handleToggle}
              >
                {isExpanded ? "remove_circle" : "add_circle"}
              </i>
              <h2 className="text-gray-400 text-sm ml-2 flex-shrink-0">
                Completed tasks
              </h2>
              <div className="w-full border-t-2 mx-2"></div>
            </div>
            <div className="mx-2 w-full" {...getCollapseProps()}>
              {props.selectedCategory &&
                props.tasks[props.selectedCategory]?.tasks &&
                props.tasks[props.selectedCategory]?.tasks.map((task, i) => {
                  if (task.completed) {
                    return (
                      <div
                        key={`${task.task}-${task.timestamp}`}
                        className="line-through italic text-xs mt-1 text-gray-400"
                      >
                        {task.task}
                      </div>
                    );
                  }
                })}
              <button
                onClick={() => props.setClearHistoryWarning(true)}
                className="transition-all bg-gray-300 text-gray-500 hover:bg-red-400 hover:text-white text-xs p-2 mt-3 mb-14"
              >
                Clear history
              </button>
            </div>
          </div>
        )}
    </div>
  );
}

export default TodoDisplay;
