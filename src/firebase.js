import {
  getAuth,
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
  GoogleAuthProvider,
  onAuthStateChanged,
} from "firebase/auth";
import { initializeApp } from "firebase/app";
import {
  getFirestore,
  collection,
  query,
  limit,
  onSnapshot,
  addDoc,
  doc,
  getDoc,
  getDocs,
  setDoc,
  deleteDoc,
  updateDoc,
  arrayUnion,
  arrayRemove,
} from "firebase/firestore";

const provider = new GoogleAuthProvider();

const firebaseConfig = {
  apiKey: "AIzaSyC2o7fNekFyVe16X1uR3SMPUFYb-KJSZoI",
  authDomain: "fir-test-9cd48.firebaseapp.com",
  projectId: "fir-test-9cd48",
  storageBucket: "fir-test-9cd48.appspot.com",
  messagingSenderId: "1064485491876",
  appId: "1:1064485491876:web:09263fb1ed3f53f0170231",
  measurementId: "G-TBKVB1HG4R",
};

// Initialize Firebase
initializeApp(firebaseConfig);
const db = getFirestore();

const SignInWithFirebase = () => {
  const auth = getAuth();
  signInWithPopup(auth, provider)
    .then((result) => {
      // This gives you a Google Access Token. You can use it to access the Google API.
      const credential = GoogleAuthProvider.credentialFromResult(result);
      const token = credential.accessToken;
      // The signed-in user info.
      const user = result.user;
    })
    .catch((error) => {
      // Handle Errors here.
      const errorCode = error.code;
      const errorMessage = error.message;
      // The email of the user's account used.
      const email = error.email;
      // The AuthCredential type that was used.
      const credential = GoogleAuthProvider.credentialFromError(error);
      console.log(`${errorCode} ${errorMessage}`);
      // ...
    });
};

const SignInWithFirebaseMobile = () => {
  const auth = getAuth();
  signInWithRedirect(auth, provider);

  getRedirectResult(auth)
    .then((result) => {
      // This gives you a Google Access Token. You can use it to access Google APIs.
      const credential = GoogleAuthProvider.credentialFromResult(result);
      const token = credential.accessToken;

      // The signed-in user info.
      const user = result.user;
    })
    .catch((error) => {
      // Handle Errors here.
      const errorCode = error.code;
      const errorMessage = error.message;
      // The email of the user's account used.
      const email = error.email;
      // The AuthCredential type that was used.
      const credential = GoogleAuthProvider.credentialFromError(error);
      console.log(`${errorCode} ${errorMessage}`);
      // ...
    });
};

/*
async function getSignedInUser() {
  const auth = getAuth();
  let uid;
  onAuthStateChanged(auth, (user) => {
    if (user) {
      // User is signed in, see docs for a list of available properties
      // https://firebase.google.com/docs/reference/js/firebase.User
    } else {
      // User is signed out
      // ...
    }
  });
}
*/

async function checkIfUserExists(user) {
  const docRef = doc(db, "users", user.uid);
  const docSnap = await getDoc(docRef);

  if (!docSnap.exists()) {
    // User doesn't exist, create user
    await setDoc(
      docRef,
      {
        uid: user.uid,
        name: user.displayName,
        email: user.email,
        photo: user.photoURL,
        joined: new Date(Date.now()).toUTCString(),
      },
      { merge: true }
    );
    addCategory(user.uid, "To do");
  } else {
    // User exists, make sure a category exists
    if (!checkIfCategoryExists(user.uid)) {
      addCategory(user.uid, "To do");
    }
  }
}

async function checkIfCategoryExists(user) {
  const querySnapshot = await getDocs(
    collection(db, "users", user, "categories"),
    limit(1)
  );
  if (querySnapshot.docs.length > 0) {
    return true;
  } else {
    return false;
  }
}

async function addCategory(user, category) {
  await setDoc(doc(db, "users", user, "categories", category), {
    timestamp: Date.now(),
    showcompleted: true,
  });
}

async function deleteCategory(user, category) {
  const querySnapshot = await getDocs(
    collection(db, "users", user, "categories", category, "tasks")
  );
  querySnapshot.forEach((document) => {
    // doc.data() is never undefined for query doc snapshots
    deleteDoc(
      doc(db, "users", user, "categories", category, "tasks", document.id)
    );
  });
  await deleteDoc(doc(db, "users", user, "categories", category));
}

async function addToDoTask(user, category, task) {
  const categoryRef = doc(db, "users", user, "categories", category);

  // Atomically add a new region to the "regions" array field.
  await updateDoc(categoryRef, {
    tasks: arrayUnion({ task, completed: false, timestamp: Date.now() }),
  });
}

function getTasks(user, callback) {
  onSnapshot(
    query(collection(db, "users", user, "categories")),
    (querySnapshot) => {
      let tasks = {};
      querySnapshot.forEach((doc) => {
        // doc.data() is never undefined for query doc snapshots
        tasks[`${doc.id}`] = doc.data().tasks;
      });
      callback(tasks);
    }
  );
}

async function updateChecked(user, category, taskArray) {
  const taskRef = doc(db, "users", user, "categories", category);
  const querySnapshot = await getDoc(taskRef);
  // Remove the 'capital' field from the document
  // Atomically remove a region from the "regions" array field.
  const filtered = querySnapshot.data().tasks.map((taskobject) => {
    let tasks = taskArray.map((checkedTask) => checkedTask.task);
    if (tasks.indexOf(taskobject.task) > -1) {
      updateDoc(taskRef, {
        tasks: arrayRemove(taskobject),
      });
      updateDoc(taskRef, {
        tasks: arrayUnion({
          task: taskobject.task,
          completed: true,
          timestamp: Date.now(),
        }),
      });
    }
  });
}

async function toggleShowCompleted(user, category, toggle) {
  const categoryRef = doc(db, "users", user, "categories", category);

  // Set the "capital" field of the city 'DC'
  await updateDoc(categoryRef, {
    showcompleted: toggle,
  });
}

async function clearCompleted(user, category) {
  const categoryRef = doc(db, "users", user, "categories", category);
  const querySnapshot = await getDoc(categoryRef);
  querySnapshot.data().tasks.map((task) => {
    if (task.completed) {
      updateDoc(categoryRef, {
        tasks: arrayRemove(task),
      });
    }
  });
  // Atomically add a new region to the "regions" array field.
  /*
  await updateDoc(categoryRef, {
    tasks: arrayUnion({ task, completed: false, timestamp: Date.now() }),
  });
  */
}

async function deleteTask(user, category, task) {
  const taskRef = doc(db, "users", user, "categories", category);
  const querySnapshot = await getDoc(taskRef);
  // Remove the 'capital' field from the document
  // Atomically remove a region from the "regions" array field.
  const filtered = querySnapshot.data().tasks.filter((object) => {
    return object.task === task;
  });
  await updateDoc(taskRef, {
    tasks: arrayRemove(filtered[0]),
  });
}

export {
  addToDoTask,
  SignInWithFirebase,
  SignInWithFirebaseMobile,
  checkIfUserExists,
  checkIfCategoryExists,
  addCategory,
  deleteCategory,
  //getSignedInUser,
  getTasks,
  deleteTask,
  db,
  updateChecked,
  clearCompleted,
  toggleShowCompleted,
};
