import { useRef, useState, useEffect } from "react";
import { useOutsideAlerter } from "../Hooks";
import { Plus } from "../static/icons";
import { db, addCategory } from "../firebase";
import {
  collection,
  doc,
  query,
  onSnapshot,
  orderBy,
} from "firebase/firestore";

function TodoSidebar(props) {
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState("");

  const wrapperRef = useRef(null);
  const inputRef = useRef(null);
  useOutsideAlerter(wrapperRef, props.showSidebar, props.setShowSidebar, false);
  useOutsideAlerter(inputRef, true, setNewCategory, "");

  function handleKeyPress(e) {
    if (e.key === "Enter" && newCategory) {
      addCategory(props.user.uid, newCategory);
      setNewCategory("");
      props.setSelectedCategory(newCategory);
    }
  }

  function handleCategorySwitch(category) {
    props.setSelectedCategory(category);
  }

  useEffect(() => {
    const q = query(
      collection(db, "users", props.user.uid, "categories"),
      orderBy("timestamp")
    );
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const categories = [];
      querySnapshot.forEach((doc) => {
        categories.push(doc.id);
      });
      setCategories(categories);
    });
    return () => {
      unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (!props.selectedCategory) {
      props.setSelectedCategory(categories[0]);
    }
  }, [categories]);

  return (
    <div
      ref={wrapperRef}
      id="category-sidebar"
      className={`${
        props.showSidebar ? "translate-x-0" : "-translate-x-full"
      } transition-all duration-300 ease-in-out transform fixed w-1/2 md:w-1/3 lg:w-1/4 z-30 top-14 bottom-12 bg-blue-200 overflow-y-auto`}
    >
      {categories.map((category) => {
        return (
          <div
            key={category}
            onClick={() => handleCategorySwitch(category)}
            className={`p-3 cursor-pointer hover:bg-blue-300 ${
              props.selectedCategory === category
                ? "bg-blue-400"
                : "bg-blue-500"
            }`}
          >
            {category}
          </div>
        );
      })}
      <div className="flex items-center p-2 text-blue-500 hover:text-blue-400 hover:bg-blue-100 cursor-pointer">
        <Plus className="h-5 fill-current" />
        <input
          ref={inputRef}
          className="ml-1 w-full pholder bg-transparent"
          placeholder="New category"
          type="text"
          value={newCategory}
          onChange={(e) => setNewCategory(e.target.value)}
          onKeyPress={(e) => handleKeyPress(e)}
        />
      </div>
    </div>
  );
}

export default TodoSidebar;
