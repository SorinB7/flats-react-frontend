import { useState } from "react";
import PropTypes from "prop-types";
import styles from "../styles/EditAccountModal.module.css";

const EditAccountModal = ({
  isVisible,
  updatedDetails,
  setUpdatedDetails,
  onSave,
  onClose,
  loading,
}) => {
  const [passwordInputType, setPasswordInputType] = useState("password");

  if (!isVisible) return null;

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modal}>
        <h2>Edit Account Details</h2>
        <div className={styles.modalContent}>
          <label>
            First Name:
            <input
              type="text"
              value={updatedDetails.firstName || ""}
              onChange={(e) =>
                setUpdatedDetails({ ...updatedDetails, firstName: e.target.value })
              }
            />
          </label>
          <label>
            Last Name:
            <input
              type="text"
              value={updatedDetails.lastName || ""}
              onChange={(e) =>
                setUpdatedDetails({ ...updatedDetails, lastName: e.target.value })
              }
            />
          </label>
          <label>
            Birth Date:
            <input
              type="date"
              value={updatedDetails.birthDate || ""}
              onChange={(e) =>
                setUpdatedDetails({ ...updatedDetails, birthDate: e.target.value })
              }
            />
          </label>
          <label>
            Password:
            <input
              type={passwordInputType}
              value={updatedDetails.password || ""}
              onChange={(e) =>
                setUpdatedDetails({ ...updatedDetails, password: e.target.value })
              }
              onMouseEnter={() => setPasswordInputType("text")}
              onMouseLeave={() => setPasswordInputType("password")}
            />
          </label>
        </div>
        <div className={styles.modalActions}>
          <button onClick={onSave} disabled={loading}>
            {loading ? "Saving..." : "Save"}
          </button>
          <button onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  );
};

// Definire PropTypes pentru componentă
EditAccountModal.propTypes = {
  isVisible: PropTypes.bool.isRequired, 
  userDetails: PropTypes.object.isRequired, 
  updatedDetails: PropTypes.object.isRequired, 
  setUpdatedDetails: PropTypes.func.isRequired, 
  onSave: PropTypes.func.isRequired, 
  onClose: PropTypes.func.isRequired, 
  loading: PropTypes.bool, 
};

export default EditAccountModal;
