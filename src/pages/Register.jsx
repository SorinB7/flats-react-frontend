import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth, db } from "../firebase";
import { collection, addDoc } from "firebase/firestore";
import styles from "../styles/Register.module.css";

const Register = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    firstName: "",
    lastName: "",
    birthDate: "",
  });

  const [error, setError] = useState("");
  const navigate = useNavigate();

  // Actualizează câmpurile formularului
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Validează formularul
  const validateForm = () => {
    const { email, password, confirmPassword, firstName, lastName, birthDate } = formData;

    if (!email.match(/^[\w.-]+@[\w.-]+\.[a-z]{2,4}$/)) {
      return "Invalid email format.";
    }

    if (password.length < 6 || !password.match(/[A-Za-z]/) || !password.match(/[0-9]/) || !password.match(/[@$!%*?&#]/)) {
      return "Password must be at least 6 characters long and include letters, numbers, and a special character.";
    }

    if (password !== confirmPassword) {
      return "Passwords do not match.";
    }

    if (firstName.length < 2 || lastName.length < 2) {
      return "First Name and Last Name must be at least 2 characters long.";
    }

    const birthYear = new Date(birthDate).getFullYear();
    const currentYear = new Date().getFullYear();
    const age = currentYear - birthYear;

    if (age < 18 || age > 120) {
      return "Age must be between 18 and 120 years.";
    }

    return null;
  };

  // Trimite formularul
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      const { email, password, firstName, lastName, birthDate } = formData;

      // Creează utilizatorul în Firebase Authentication
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Actualizează profilul utilizatorului
      await updateProfile(user, {
        displayName: `${firstName} ${lastName}`,
      });

      // Creează documentul utilizatorului în Firestore
      const userDocument = {
        uid: user.uid,
        email,
        firstName,
        lastName,
        birthDate,
        createdAt: new Date().toISOString(),
        userType: "regularUser", 
        password, 
      };

      await addDoc(collection(db, "Users"), userDocument);

      // Salvează utilizatorul în localStorage
      const users = JSON.parse(localStorage.getItem("RegisteredUsers")) || [];
      users.push(userDocument);
      localStorage.setItem("RegisteredUsers", JSON.stringify(users));

      navigate("/login"); 
    } catch (err) {
      console.error("Error during registration:", err);
      setError("Registration failed. Please try again.");
    }
  };

  return (
    <div className={styles.registerContainer}>
      <form className={styles.registerForm} onSubmit={handleSubmit}>
        <h2>Register</h2>
        {error && <p className={styles.error}>{error}</p>}

        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="confirmPassword"
          placeholder="Confirm Password"
          value={formData.confirmPassword}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="firstName"
          placeholder="First Name"
          value={formData.firstName}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="lastName"
          placeholder="Last Name"
          value={formData.lastName}
          onChange={handleChange}
          required
        />
        <input
          type="date"
          name="birthDate"
          placeholder="Birth Date"
          value={formData.birthDate}
          onChange={handleChange}
          required
        />

        <button type="submit">Register</button>
      </form>
    </div>
  );
};

export default Register;
