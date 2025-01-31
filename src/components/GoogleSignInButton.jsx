import PropTypes from "prop-types";
import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { collection, query, where, getDocs, doc, setDoc } from "firebase/firestore";
import { auth, db } from "../firebase";
import styles from "../styles/GoogleSignInButton.module.css";

const GoogleSignInButton = ({ onSuccess, onError }) => {
  const provider = new GoogleAuthProvider();
  provider.setCustomParameters({ prompt: "select_account" }); 

  const handleGoogleSignIn = async () => {
    try {
      // Pasul 1: Autentificare cu Google
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      // Pasul 2: Verificare utilizator în Firestore
      const userQuery = query(collection(db, "Users"), where("email", "==", user.email));
      const querySnapshot = await getDocs(userQuery);

      if (querySnapshot.empty) {
        // Pasul 3: Adaugare utilizator dacă nu există
        const isAdmin = ["admin@gmail.com"].includes(user.email); 
        const newUser = {
          uid: user.uid,
          email: user.email,
          displayName: user.displayName || "Unknown User",
          firstName: user.displayName ? user.displayName.split(" ")[0] : "",
          lastName: user.displayName ? user.displayName.split(" ")[1] || "":"",
          userType: isAdmin ? "admin" : "standard",
          createdAt: new Date().toISOString(),
          birthDate: "1970-01-01",
        };

        await setDoc(doc(db, "Users", user.uid), newUser);
        localStorage.setItem("LogedUser", JSON.stringify(newUser));
      } else {
        // Utilizator deja existent
        const userData = querySnapshot.docs[0].data();
        userData.displayName = user.displayName || `${userData.firstName} ${userData.lastName}`;
        localStorage.setItem("LogedUser", JSON.stringify(userData));
      }

      // Pasul 4: Finalizare
      onSuccess();
    } catch (err) {
      console.error("Google sign-in error:", err.message);
      onError("Google sign-in failed. Please try again.");
    }
  };

  return (
    <button onClick={handleGoogleSignIn} className={styles.googleSignIn}>
      Sign in with Google
    </button>
  );
};

GoogleSignInButton.propTypes = {
  onSuccess: PropTypes.func.isRequired,
  onError: PropTypes.func.isRequired,
};

export default GoogleSignInButton;
