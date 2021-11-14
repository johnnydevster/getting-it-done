import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { getAuth } from "firebase/auth";
import SignIn from "./components/SignIn";
import Home from "./Home";
import { useState, useEffect } from "react";
import {
  checkIfCategoryExists,
  checkIfUserExists,
  addCategory,
} from "./firebase";

function App() {
  const [user, setUser] = useState({ loggedIn: false });

  function loginStateChanged(callback) {
    const auth = getAuth();
    return auth.onAuthStateChanged((user) => {
      if (user) {
        callback({
          loggedIn: true,
          name: user.displayName,
          uid: user.uid,
          email: user.email,
          photo: user.photoURL,
        });

        checkIfUserExists(user);
      } else {
        callback({ loggedIn: false });
      }
    });
  }

  useEffect(() => {
    const unsubscribe = loginStateChanged(setUser);
    return () => {
      unsubscribe();
    };
  }, []);

  return (
    <Router>
      <Switch>
        <Route path="/">
          {user.loggedIn ? <Home user={user} /> : <SignIn />}
        </Route>
      </Switch>
    </Router>
  );
}

export default App;
