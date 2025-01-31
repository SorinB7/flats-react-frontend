import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  CircularProgress,
} from "@mui/material";
import { FaEye } from "react-icons/fa";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import styles from "../styles/ViewProfileButton.module.css";

const ViewProfileButton = ({ user }) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [flats, setFlats] = useState([]);

  // Effect for loading flats when the modal is opened
  useEffect(() => {
    const fetchFlats = async () => {
      if (!open) return; 
      setLoading(true);

      try {
        // Actualizează câmpul pentru interogare conform bazei de date
        const flatsQuery = query(
          collection(db, "Flats"),
          where("userId", "==", user.uid)
        );
        const flatsSnapshot = await getDocs(flatsQuery);
        const userFlats = flatsSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setFlats(userFlats);
      } catch (error) {
        console.error("Error fetching flats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFlats();
  }, [open, user.uid]); 

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <>
      <button
        onClick={handleOpen}
        className={styles.button}
        title="View Profile"
      >
        <FaEye className={styles.icon} />
      </button>

      <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
        <DialogTitle>User Profile</DialogTitle>
        <DialogContent>
          <p>
            <strong>First Name:</strong> {user.firstName}
          </p>
          <p>
            <strong>Last Name:</strong> {user.lastName}
          </p>
          <p>
            <strong>Email:</strong> {user.email}
          </p>
          <p>
            <strong>Birth Date:</strong> {user.birthDate}
          </p>
          <p>
            <strong>Age:</strong>{" "}
            {new Date().getFullYear() - new Date(user.birthDate).getFullYear()}
          </p>
          <p>
            <strong>User Type:</strong> {user.userType}
          </p>
          <p>
            <strong>Flats Counter:</strong> {user.flatsCounter || 0}
          </p>
          <h3>Uploaded Flats:</h3>
          {loading ? (
            <CircularProgress />
          ) : flats.length === 0 ? (
            <p>No flats uploaded by this user.</p>
          ) : (
            <ul className={styles.flatList}>
              {flats.map((flat) => (
                <li key={flat.id} className={styles.flatItem}>
                  <strong>{flat.name}</strong> - {flat.city},{" "}
                  {flat.streetName} {flat.streetNumber}
                </li>
              ))}
            </ul>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

ViewProfileButton.propTypes = {
  user: PropTypes.shape({
    id: PropTypes.string.isRequired,
    uid: PropTypes.string.isRequired, 
    firstName: PropTypes.string.isRequired,
    lastName: PropTypes.string.isRequired,
    email: PropTypes.string.isRequired,
    birthDate: PropTypes.string.isRequired,
    userType: PropTypes.string.isRequired,
    flatsCounter: PropTypes.number,
  }).isRequired,
};

export default ViewProfileButton;
