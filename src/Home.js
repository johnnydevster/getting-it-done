import SignOut from "./components/SignOut";
import TodoDisplay from "./components/TodoDisplay";
import TodoSidebar from "./components/TodoSidebar";
import ButtonOverlay from "./components/ButtonOverlay";
import NotificationBox from "./components/NotificationBox";
import TodoInput from "./components/TodoInput";
import { deleteCategory, clearCompleted, db } from "./firebase";
import { Hamburger } from "./static/icons";
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { updateChecked } from "./firebase";
import { collection, query, onSnapshot, orderBy } from "firebase/firestore";
import logo from "./static/logo.png";

function Home(props) {
  const [showSidebar, setShowSidebar] = useState(false);
  const [showTodoInput, setShowTodoInput] = useState(false);
  const [showDeleteWarning, setShowDeleteWarning] = useState(false);
  const [clearHistoryWarning, setClearHistoryWarning] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [tasks, setTasks] = useState(null);
  const [checkedTasks, setCheckedTasks] = useState([]);

  const deleteWarning = {
    show: showDeleteWarning,
    setShow: setShowDeleteWarning,
    text: [
      `Are you sure you want to delete category ${selectedCategory}?`,
      "This will remove all tasks and cannot be undone!",
    ],
    classes: "bg-red-400",
    xcolor: "text-red-600",
    buttons: [
      {
        text: "Delete",
        class: "transition-all bg-red-600 hover:bg-red-500",
        callback: () => {
          deleteCategory(props.user.uid, selectedCategory);
          setShowDeleteWarning(false);
          setSelectedCategory(null);
        },
      },
      {
        text: "Cancel",
        class: "transition-all bg-red-300 hover:bg-opacity-60",
        callback: () => {
          setShowDeleteWarning(false);
        },
      },
    ],
  };

  const deleteHistoryWarning = {
    show: clearHistoryWarning,
    setShow: setClearHistoryWarning,
    text: [`Are you sure you want to clear history?`],
    classes: "bg-gray-300 text-gray-600",
    xcolor: "text-gray-500",
    buttons: [
      {
        text: "Clear history",
        class: "bg-gray-500 transition-all hover:bg-gray-400",
        callback: () => {
          clearCompleted(props.user.uid, selectedCategory);
          setClearHistoryWarning(false);
        },
      },
      {
        text: "Cancel",
        class: "bg-gray-400 transition-all hover:bg-opacity-60",
        callback: () => {
          setClearHistoryWarning(false);
        },
      },
    ],
  };

  function checkTasks() {
    updateChecked(props.user.uid, selectedCategory, checkedTasks);
  }

  useEffect(() => {
    setCheckedTasks([]);
  }, [selectedCategory]);

  useEffect(() => {
    // Get tasks
    const q = query(
      collection(db, "users", props.user.uid, "categories"),
      orderBy("timestamp")
    );
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      let tasks = {};
      querySnapshot.forEach((doc) => {
        // doc.data() is never undefined for query doc snapshots
        //tasks[`${doc.id}`] = doc.data().tasks;
        tasks[`${doc.id}`] = {
          showcompleted: doc.data().showcompleted,
          tasks: doc.data().tasks,
        };
      });
      setTasks(tasks);
    });
    return () => {
      unsubscribe();
    };
  }, []);

  return (
    <div className="text-white">
      <header className="fixed z-50 w-full p-3 bg-blue-500 flex justify-between items-center">
        <div className="flex items-center">
          <h1 className="logo text-xl mr-1 text-blue-50">getting it</h1>{" "}
          <span class="material-icons text-2xl">verified</span>
          <h2 className="logo ml-1 text-xl text-blue-50">DONE</h2>
        </div>
        <Hamburger className="w-8 bg-blue-700 rounded p-1" />
      </header>
      <section
        id="homecontainer"
        className="absolute top-14 left-0 right-0 bottom-0 flex flex-col"
      >
        <AnimatePresence>
          {(showTodoInput || showDeleteWarning || clearHistoryWarning) && (
            <motion.div
              key="modal"
              animate={{ opacity: 1 }}
              initial={{ opacity: 0 }}
              exit={{ opacity: 0 }}
              className={`absolute inset-0 bg-black bg-opacity-40`}
              id="fadeoutdiv"
            ></motion.div>
          )}
        </AnimatePresence>
        <div
          id="usercontainer"
          className="flex justify-between items-center bg-gray-100 p-2"
        >
          <div className="flex items-center">
            <img
              alt="user"
              src={props.user.photo}
              className="rounded-full w-10"
            />
            <span className="text-gray-400 text-xs mx-2">
              Welcome, {props.user.name}
            </span>
          </div>
          <SignOut />
        </div>
        <TodoSidebar
          showSidebar={showSidebar}
          setShowSidebar={setShowSidebar}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          user={props.user}
        />
        <AnimatePresence>
          {showTodoInput && (
            <TodoInput
              user={props.user}
              selectedCategory={selectedCategory}
              showTodoInput={showTodoInput}
              setShowTodoInput={setShowTodoInput}
            />
          )}
        </AnimatePresence>
        <TodoDisplay
          user={props.user}
          tasks={tasks}
          setShowDeleteWarning={setShowDeleteWarning}
          setClearHistoryWarning={setClearHistoryWarning}
          selectedCategory={selectedCategory}
          checkedTasks={checkedTasks}
          setCheckedTasks={setCheckedTasks}
        />
        <AnimatePresence>
          {showDeleteWarning && (
            <NotificationBox notification={deleteWarning} />
          )}
          {clearHistoryWarning && (
            <NotificationBox notification={deleteHistoryWarning} />
          )}
        </AnimatePresence>
        <ButtonOverlay
          showSidebar={showSidebar}
          setShowSidebar={setShowSidebar}
          setShowTodoInput={setShowTodoInput}
          checkTasks={checkTasks}
        />
      </section>
    </div>
  );
}

export default Home;
