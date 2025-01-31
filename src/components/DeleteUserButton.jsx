import PropTypes from "prop-types";
import { useState } from "react";
import { FaTrash } from "react-icons/fa"; 
import { doc, deleteDoc } from "firebase/firestore"; 
import { db } from "../firebase";
import { Snackbar, Alert } from "@mui/material"; // Snackbar pentru notificări
import styles from "../styles/DeleteUserButton.module.css";

const DeleteUserButton = ({ userId, onDelete, disabled = false }) => {
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success", // "success" | "error" | "warning" | "info"
  });

  const handleDeleteUser = async () => {
    try {
      // Referință directă la documentul utilizatorului din Firebase
      const userDocRef = doc(db, "Users", userId);

      // Ștergem documentul
      await deleteDoc(userDocRef);

      // Notificăm lista părinte
      setSnackbar({
        open: true,
        message: "User deleted successfully!",
        severity: "success",
      });
      onDelete(userId);
    } catch (error) {
      console.error("Error deleting user:", error);
      setSnackbar({
        open: true,
        message: "Failed to delete user. Please try again.",
        severity: "error",
      });
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  return (
    <>
      <button
        onClick={handleDeleteUser}
        className={styles.button}
        title="Delete User" // Tooltip
        disabled={disabled} 
      >
        <FaTrash className={styles.icon} />
      </button>
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
};

DeleteUserButton.propTypes = {
  userId: PropTypes.string.isRequired, 
  onDelete: PropTypes.func.isRequired, 
  disabled: PropTypes.bool, 
};

export default DeleteUserButton;
