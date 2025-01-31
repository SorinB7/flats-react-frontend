import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { db } from "../firebase";
import {
  collection,
  query,
  where,
  getDocs,
  updateDoc,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { getAuth, deleteUser, updateProfile } from "firebase/auth";
import styles from "../styles/MyAccount.module.css";
import EditAccountModal from "../components/EditAccountModal";

const MyAccount = () => {
  const [userDetails, setUserDetails] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [updatedDetails, setUpdatedDetails] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const auth = getAuth();
  const currentUser = auth.currentUser || JSON.parse(localStorage.getItem("LogedUser"));

  useEffect(() => {
    const fetchUserDetails = async () => {
      if (!currentUser || !currentUser.uid) {
        console.error("Current user is not logged in.");
        setError("User not logged in.");
        return;
      }

      try {
        const usersQuery = query(
          collection(db, "Users"),
          where("uid", "==", currentUser.uid)
        );
        const querySnapshot = await getDocs(usersQuery);

        if (!querySnapshot.empty) {
          const userDoc = querySnapshot.docs[0];
          setUserDetails({ ...userDoc.data(), docId: userDoc.id });
          setUpdatedDetails(userDoc.data());
        } else {
          setError("User not found in database.");
        }
      } catch (error) {
        console.error("Error fetching user details:", error);
        setError("Failed to fetch user details.");
      }
    };

    fetchUserDetails();
  }, [currentUser]);

  const handleEdit = async () => {
    try {
      setLoading(true);
      const userRef = doc(db, "Users", userDetails.docId);
      await updateDoc(userRef, updatedDetails);

      if (auth.currentUser) {
        const newDisplayName = `${updatedDetails.firstName} ${updatedDetails.lastName}`;
        await updateProfile(auth.currentUser, { displayName: newDisplayName });

        const updatedUser = { ...currentUser, ...updatedDetails, displayName: newDisplayName };
        localStorage.setItem("LogedUser", JSON.stringify(updatedUser));
      }

      setUserDetails(updatedDetails);
      setIsEditing(false);
      navigate("/login");
    } catch (error) {
      console.error("Error updating user details:", error);
      setError("Failed to update user details.");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (!currentUser) {
      setError("User not logged in.");
      return;
    }
  
    try {
      setLoading(true);
  
      // Ștergere utilizator din colecția "Users"
      const userRef = doc(db, "Users", userDetails.docId);
      await deleteDoc(userRef);
  
      // Ștergere apartamente asociate utilizatorului
      const flatsQuery = query(
        collection(db, "Flats"),
        where("userId", "==", currentUser.uid)
      );
      const flatsSnapshot = await getDocs(flatsQuery);
      flatsSnapshot.forEach(async (flat) => {
        await deleteDoc(doc(db, "Flats", flat.id));
      });
  
      // **Ștergere mesaje asociate utilizatorului**
      const messagesQuery = query(
        collection(db, "Messages"),
        where("userId", "==", currentUser.uid) 
      );
      const messagesSnapshot = await getDocs(messagesQuery);
      messagesSnapshot.forEach(async (message) => {
        await deleteDoc(doc(db, "Messages", message.id));
      });
  
      // Ștergere utilizator din Firebase Auth
      await deleteUser(auth.currentUser);
  
      // Ștergere din localStorage și redirecționare
      localStorage.removeItem("LogedUser");
      navigate("/login");
    } catch (error) {
      console.error("Error deleting account:", error);
      setError("Failed to delete account. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  

  if (error) {
    return <div className={styles.error}>{error}</div>;
  }

  if (!userDetails) return <div>Loading user details...</div>;

  return (
    <div className={styles.accountContainer}>
      <h1>My Account</h1>
      <div className={styles.accountDetails}>
        <p><strong>First Name:</strong> {userDetails.firstName}</p>
        <p><strong>Last Name:</strong> {userDetails.lastName}</p>
        <p><strong>Birth Date:</strong> {userDetails.birthDate}</p>
        <p><strong>User Type:</strong> {userDetails.userType}</p>
        <p><strong>Email:</strong> {userDetails.email}</p>
      </div>
      <button
        className={styles.editButton}
        onClick={() => setIsEditing(true)}
      >
        Edit
      </button>
      <button
        className={styles.deleteButton}
        onClick={handleDeleteAccount}
        disabled={loading}
      >
        {loading ? "Deleting..." : "Delete Account"}
      </button>

      <EditAccountModal
        isVisible={isEditing}
        userDetails={userDetails}
        updatedDetails={updatedDetails}
        setUpdatedDetails={setUpdatedDetails}
        onSave={handleEdit}
        onClose={() => setIsEditing(false)}
        loading={loading}
      />
    </div>
  );
};

export default MyAccount;
