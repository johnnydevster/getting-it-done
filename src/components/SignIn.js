import { SignInWithFirebase, SignInWithFirebaseMobile } from "../firebase";
import { MobileView, BrowserView } from "react-device-detect";

function SignIn(props) {
  return (
    <div>
      <div
        id="login-container"
        className="w-72 rounded p-5 mx-auto bg-gray-100"
      >
        <BrowserView>
          <button
            onClick={SignInWithFirebase}
            className="bg-blue-600 block mx-auto"
          >
            Sign in with Google Browser
          </button>
        </BrowserView>
        <MobileView>
          <button
            onClick={SignInWithFirebaseMobile}
            className="bg-blue-600 block mx-auto"
          >
            Sign in with Google Mobile
          </button>
        </MobileView>
      </div>
    </div>
  );
}

export default SignIn;
