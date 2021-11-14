import { signOut, getAuth } from "firebase/auth";

function SignOut(props) {
  function signOutFromGoogle() {
    const auth = getAuth();
    signOut(auth)
      .then(() => {
        console.log("signed out.");
      })
      .catch((error) => {
        // An error happened.
      });
  }
  return (
    <button
      onClick={signOutFromGoogle}
      className="bg-gray-300 text-sm w-24 text-gray-500"
    >
      Sign Out
    </button>
  );
}

export default SignOut;
