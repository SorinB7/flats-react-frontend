import PropTypes from "prop-types";
import { updateDoc, doc, deleteDoc } from "firebase/firestore";
import { db } from "../../firebase";
import styles from "../../styles/AdminOperations.module.css";
import { FaUserShield, FaTrash } from "react-icons/fa";

const AdminOperations = ({ user }) => {
  const handleGrantAdmin = async () => {
    try {
      const userRef = doc(db, "Users", user.id);
      const newType = user.userType === "admin" ? "regularUser" : "admin";
      await updateDoc(userRef, { userType: newType });
      alert(
        `User ${user.firstName} ${user.lastName} is now ${
          newType === "admin" ? "an admin" : "a regular user"
        }!`
      );
    } catch (error) {
      console.error("Error updating user type:", error);
    }
  };

  const handleRemoveUser = async () => {
    try {
      const userRef = doc(db, "Users", user.id);
      await deleteDoc(userRef);
      alert(`User ${user.firstName} ${user.lastName} removed successfully!`);
    } catch (error) {
      console.error("Error removing user:", error);
    }
  };

  return (
    <div className={styles.operations}>
      <button
        onClick={handleGrantAdmin}
        className={`${styles.iconButton} ${
          user.userType === "admin" ? styles.admin : styles.regular
        }`}
        title={
          user.userType === "admin" ? "Revoke Admin Privileges" : "Grant Admin"
        }
      >
        <FaUserShield />
      </button>
      <button
        onClick={handleRemoveUser}
        className={`${styles.iconButton} ${styles.delete}`}
        title="Remove User"
      >
        <FaTrash />
      </button>
    </div>
  );
};

AdminOperations.propTypes = {
  user: PropTypes.object.isRequired,
};

export default AdminOperations;
