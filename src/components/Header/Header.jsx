import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { auth, db } from "../../firebase";
import { onAuthStateChanged, signOut, deleteUser } from "firebase/auth";
import { doc, getDoc, query, collection, getDocs, where, deleteDoc } from "firebase/firestore";
import styles from "../../styles/Header.module.css";
import LoginIcon from "@mui/icons-material/Login";
import LogoutIcon from "@mui/icons-material/Logout";
import { FaTrash } from "react-icons/fa";
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Button } from "@mui/material";
import Timer from "../Timer/Timer";

const Header = () => {
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false); 
  const [openDialog, setOpenDialog] = useState(false); 
  const [isMenuOpen, setIsMenuOpen] = useState(false); 
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserType = async (uid) => {
      const userDocRef = doc(db, "Users", uid);
      const userDoc = await getDoc(userDocRef);
      if (userDoc.exists()) {
        const userData = userDoc.data();
        setUser(userData);
        setIsAdmin(userData.userType === "admin"); 
        localStorage.setItem("LogedUser", JSON.stringify(userData)); 
      }
    };

    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        const storedUser = localStorage.getItem("LogedUser");
        if (storedUser) {
          const parsedUser = JSON.parse(storedUser);
          setUser(parsedUser);
          setIsAdmin(parsedUser.userType === "admin");
        } else {
          fetchUserType(currentUser.uid);
        }
      } else {
        setUser(null);
        setIsAdmin(false);
        localStorage.removeItem("LogedUser");
      }
    });

    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      localStorage.removeItem("LogedUser");
      navigate("/login");
    } catch (error) {
      console.error("Logout error:", error.message);
      alert("An error occurred while logging out. Please try again.");
    }
  };

  const handleDeleteAccount = async () => {
    if (!user) {
      console.error("No user is logged in.");
      return;
    }

    try {
      // Ștergem utilizatorul din colecția "Users"
      const usersQuery = query(collection(db, "Users"), where("uid", "==", user.uid));
      const userSnapshot = await getDocs(usersQuery);
      if (!userSnapshot.empty) {
        const userDoc = userSnapshot.docs[0];
        await deleteDoc(doc(db, "Users", userDoc.id));
      } else {
        console.warn("No matching user document found in 'Users' collection.");
      }

      // Ștergem apartamentele asociate utilizatorului
      const flatsQuery = query(collection(db, "Flats"), where("userId", "==", user.uid));
      const flatsSnapshot = await getDocs(flatsQuery);
      flatsSnapshot.forEach(async (flatDoc) => {
        await deleteDoc(doc(db, "Flats", flatDoc.id));
      });

      // Ștergem mesajele asociate utilizatorului
      const messagesQuery = query(collection(db, "Messages"), where("senderId", "==", user.uid));
      const messagesSnapshot = await getDocs(messagesQuery);
      messagesSnapshot.forEach(async (messageDoc) => {
        await deleteDoc(doc(db, "Messages", messageDoc.id));
      });

      // Ștergem utilizatorul din Firebase Auth
      await deleteUser(auth.currentUser);

      // Ștergem din localStorage și redirecționăm
      localStorage.removeItem("LogedUser");
      navigate("/login");
    } catch (error) {
      console.error("Error during account deletion:", error);
      alert("Failed to delete account. Please try again.");
    }
  };

  const toggleMenu = () => setIsMenuOpen((prev) => !prev);

  const openDeleteDialog = () => setOpenDialog(true);
  const closeDeleteDialog = () => setOpenDialog(false);

  return (
    <header className={styles.header}>
      <div className={styles.logo} onClick={() => navigate("/")}>
        <img src="/FlatFinder.png" alt="FlatFinder Logo" className={styles.logoImage} />
      </div>
      {user && (
        <div className={styles.greeting}>
          Hello, {user.displayName || user.email || "User"}!
        </div>
      )}

      {/* Timer Section */}
      <div className={styles.timerContainer}>
        <Timer initialTime={3600} onSessionExpire={handleLogout} />
      </div>

      <div className={styles.hamburgerMenu} onClick={toggleMenu}>
        <span className={styles.bar}></span>
        <span className={styles.bar}></span>
        <span className={styles.bar}></span>
      </div>

      <nav
        className={`${styles.dropdownMenu} ${
          isMenuOpen ? styles.active : ""
        }`}
      >
        <Link to="/home" onClick={toggleMenu}>Home</Link>
        <Link to="/my-account" onClick={toggleMenu}>My Acount</Link>
        <Link to="/my-flats" onClick={toggleMenu}>My Flats</Link>
        <Link to="/favourites" onClick={toggleMenu}>Favourites</Link>
        <Link to="/new-flat" onClick={toggleMenu}>Add Flat</Link>
        {isAdmin && (
          <Link to="/all-users" onClick={toggleMenu}>All Users</Link>
        )}
      </nav>

      <div className={styles.icons}>
        {user ? (
          <>
            <FaTrash
              title="Delete Account"
              className={styles.deleteIcon}
              onClick={openDeleteDialog}
              style={{ cursor: "pointer", color: "red", marginRight: "15px" }}
            />
            <LogoutIcon titleAccess="Logout" onClick={handleLogout} />
          </>
        ) : (
          <Link to="/login">
            <LoginIcon titleAccess="Login" />
          </Link>
        )}
      </div>

      <Dialog
        open={openDialog}
        onClose={closeDeleteDialog}
        aria-labelledby="delete-account-dialog-title"
        aria-describedby="delete-account-dialog-description"
      >
        <DialogTitle id="delete-account-dialog-title">Delete Account</DialogTitle>
        <DialogContent>
          <DialogContentText id="delete-account-dialog-description">
            Are you sure you want to delete your account? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeDeleteDialog} color="primary">No</Button>
          <Button onClick={() => { handleDeleteAccount(); closeDeleteDialog(); }} color="error">Yes</Button>
        </DialogActions>
      </Dialog>

      <div className={styles.timerBar}></div>
    </header>
  );
};

export default Header;
