import PropTypes from "prop-types";
import { doc, updateDoc, arrayRemove } from "firebase/firestore";
import { db } from "../firebase";
import styles from '../styles/ActionButtons.module.css'


const ActionButtons = ({ flatId, useruid, isFavorite, onFavoriteChange }) => {
  const handleRemoveFromFavorites = async () => {
    try {
      if (!flatId || !useruid) {
        console.error("Flat ID or User ID is missing.");
        return;
      }

      // Reference the document in the "Flats" collection
      const flatDocRef = doc(db, "Flats", flatId);

      // Remove the user from `favouritedBy` array in Firebase
      await updateDoc(flatDocRef, {
        favouritedBy: arrayRemove(useruid),
      });


      // Trigger UI update through callback
      if (onFavoriteChange) {
        onFavoriteChange(flatId, false);
      }
    } catch (error) {
      console.error("Error removing from favorites:", error.message);
    }
  };

  return (
    <div className={styles.actions}>
      {isFavorite ? (
        <button
          className={styles.removeButton}
          onClick={handleRemoveFromFavorites}
          title="Remove from Favorites"
        >
          Remove
        </button>
      ) : (
        <button className={styles.addButton} title="Add to Favorites" disabled>
          Add
        </button>
      )}
    </div>
  );
};

ActionButtons.propTypes = {
  flatId: PropTypes.string.isRequired,
  useruid: PropTypes.string.isRequired,
  isFavorite: PropTypes.bool.isRequired,
  onFavoriteChange: PropTypes.func,
};

export default ActionButtons;
