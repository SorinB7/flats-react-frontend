import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../firebase";
import { collection, query, where, getDocs } from "firebase/firestore";
import styles from "../styles/Login.module.css";
import GoogleSignInButton from "../components/GoogleSignInButton"; 

const Login = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // Funcție pentru resetarea câmpurilor de input
  const resetForm = () => {
    setFormData({ email: "", password: "" });
  };

  // Resetăm câmpurile de input la montarea componentei
  useEffect(() => {
    resetForm();
  }, []);

  // Actualizează câmpurile din formular
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Funcția pentru autentificare cu email și parolă
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const { email, password } = formData;
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      const userQuery = query(collection(db, "Users"), where("email", "==", email));
      const querySnapshot = await getDocs(userQuery);

      if (!querySnapshot.empty) {
        const userData = querySnapshot.docs[0].data();
        userData.displayName = user.displayName || `${userData.firstName} ${userData.lastName}`;
        localStorage.setItem("LogedUser", JSON.stringify(userData));
      } else {
        throw new Error("User not found in database.");
      }

      resetForm(); 
      navigate("/");
    } catch (err) {
      console.error("Login error:", err.message);
      setError("Invalid email or password.");
    }
  };

  return (
    <div className={styles.loginContainer}>
      <form
        className={styles.loginForm}
        onSubmit={handleSubmit}
        autoComplete="off"
      >
        <h2>Login</h2>
        {error && <p className={styles.error}>{error}</p>}

        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          required
          autoComplete="email"
          autoCapitalize="none"
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          required
          autoComplete="current-password"
        />

        <button type="submit">Login</button>

        <GoogleSignInButton
          onSuccess={() => {
            resetForm(); 
            navigate("/");
          }}
          onError={(message) => setError(message)}
        />

        <div className={styles.registerRedirect}>
          <p>Don`t have an account?</p>
          <Link to="/register" className={styles.registerLink}>
            Register here
          </Link>
        </div>
      </form>
    </div>
  );
};

export default Login;
