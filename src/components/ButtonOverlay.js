import { Plus, Checkbox } from "../static/icons";
import { useState } from "react";

function ButtonOverlay(props) {
  function handleClick() {
    props.setShowSidebar(!props.showSidebar);
  }

  return (
    <div
      id="todo-buttons"
      className="fixed z-40 bottom-0 left-0 right-0 h-14 bg-blue-500 flex justify-center"
    >
      <div className="flex items-center justify-between w-48 relative bottom-1">
        <div
          onClick={handleClick}
          className="relative -bottom-1 fill-current border-4 border-white
        cursor-pointer text-white h-10 w-10 rounded-full flex justify-center items-center"
        >
          <span class="material-icons select-none">format_list_bulleted</span>
        </div>
        <div
          className={`absolute z-50 bg-gray-500 top-3 fill-current border-4 border-white
        cursor-pointer h-10 w-10 rounded-full justify-center items-center opacity-0 ${
          props.showSidebar ? "flex" : "hidden"
        }`}
        ></div>
        <div onClick={() => props.setShowTodoInput(true)}>
          <Plus className="bg-blue-500 fill-current text-blue-500 cursor-pointer h-16 rounded-full" />
        </div>
        <div onClick={props.checkTasks}>
          <Checkbox className="relative -bottom-1 fill-current cursor-pointer text-white h-12 w-14 rounded-full -mx-2" />
        </div>
      </div>
    </div>
  );
}

export default ButtonOverlay;
