import React, { useEffect } from "react";
import firebase from "firebase";
import StyledFirebaseAuth from "react-firebaseui/StyledFirebaseAuth";
export default function FirebaseAuth() {
  const [state, setState] = React.useState({
    isSignedIn: false
  });
  // FirebaseUI config.
  var uiConfig = {
    signInFlow: "popup",
    signInOptions: [
      // Leave the lines as is for the providers you want to offer your users.
      firebase.auth.GoogleAuthProvider.PROVIDER_ID,
      firebase.auth.FacebookAuthProvider.PROVIDER_ID
    ],
    callbacks: {
      singInSuccess: () => false
    }
  };

  if (!firebase.apps.length) {
    firebase.initializeApp({
      apiKey: "AIzaSyBo4zPDKBPxkzeExU8Wr__FWI6mTxB-LMU",
      authDomain: "fir-auth-65c5e.firebaseapp.com"
    });
  }
  useEffect(() => {
    firebase.auth().onAuthStateChanged(user => {
      setState({ isSignedIn: !!user });
      console.log("user", user);
    });
  }, []);

  return (
    <div className="App">
      {state.isSignedIn ? (
        <>
          <div>Signed In!</div>
          <button onClick={() => firebase.auth().signOut()}>Sign out!</button>
          <h1>Welcome {firebase.auth().currentUser.displayName}</h1>
          <imgage
            src={firebase.auth().currentUser.photoURL}
            alt="profile-picture"
          />
        </>
      ) : (
        <StyledFirebaseAuth
          uiConfig={uiConfig}
          firebaseAuth={firebase.auth()}
        />
      )}
    </div>
  );
}
