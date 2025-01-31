import PropTypes from "prop-types";
import { useState } from "react";
import { FaUserShield } from "react-icons/fa"; 
import { Snackbar, Alert } from "@mui/material"; 
import styles from "../styles/GrantAdminButton.module.css";

const GrantAdminButton = ({
  isAdmin,
  onClick = () => {},
  disabled = false,
  currentUserId,
  targetUserId,
}) => {
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "" });

  const handleClick = async () => {
    if (currentUserId === targetUserId) {
      setSnackbar({
        open: true,
        message: "You cannot modify your own privileges.",
        severity: "error",
      });
      return;
    }

    try {
      await onClick();
      setSnackbar({
        open: true,
        message: isAdmin
          ? "Admin privileges have been revoked."
          : "User has been granted admin privileges.",
        severity: "success",
      });
    } catch (error) {
      console.error("Error modifying admin privileges:", error);
      setSnackbar({
        open: true,
        message: "Failed to modify admin privileges. Please try again.",
        severity: "error",
      });
    }
  };

  return (
    <>
      <button
        onClick={handleClick}
        className={`${styles.button} ${isAdmin ? styles.admin : ""}`}
        title={
          disabled
            ? "Cannot modify privileges for the current user"
            : isAdmin
            ? "Revoke Admin"
            : "Grant Admin"
        }
        disabled={disabled || currentUserId === targetUserId}
      >
        <FaUserShield className={styles.icon} />
      </button>

      {/* Snackbar for feedback */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
};

GrantAdminButton.propTypes = {
  isAdmin: PropTypes.bool.isRequired,
  onClick: PropTypes.func,
  disabled: PropTypes.bool,
  currentUserId: PropTypes.string.isRequired, 
  targetUserId: PropTypes.string.isRequired, 
};

export default GrantAdminButton;
