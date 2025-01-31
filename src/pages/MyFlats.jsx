import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { collection, getDocs, doc, deleteDoc } from "firebase/firestore";
import { db } from "../firebase";
import { Delete, Add, Visibility } from "@mui/icons-material"; 
import styles from "../styles/MyFlats.module.css";

const MyFlats = () => {
  const [flats, setFlats] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const loggedUser = JSON.parse(localStorage.getItem("LogedUser"));
    if (loggedUser) {
      fetchFlats(loggedUser.uid);
    }
  }, []);

  const fetchFlats = async (userId) => {
    try {
      const querySnapshot = await getDocs(collection(db, "Flats"));
      const userFlats = querySnapshot.docs
        .filter((doc) => doc.data().userId === userId)
        .map((doc) => ({ id: doc.id, ...doc.data() }));
      setFlats(userFlats);
    } catch (error) {
      console.error("Error fetching flats: ", error);
    }
  };

  const handleDeleteFlat = async (flatId) => {
    try {
      await deleteDoc(doc(db, "Flats", flatId));
      setFlats(flats.filter((flat) => flat.id !== flatId));
    } catch (error) {
      console.error("Error deleting flat: ", error);
    }
  };

  const handleAddFlat = () => {
    navigate("/new-flat"); 
  };

  return (
    <div className={styles.myFlatsContainer}>
      <h1>My Flats</h1>
      <div className={styles.actionsHeader}>
        <button
          className={`${styles.actionButton} ${styles.addButton}`}
          onClick={handleAddFlat}
          title="Add New Flat"
        >
          <Add className={styles.icon} /> {/* Icon Add */}
        </button>
      </div>
      {flats.length === 0 ? (
        <p>No flats added yet.</p>
      ) : (
        <table className={styles.myFlatsTable}>
          <thead>
            <tr>
              <th>Name</th>
              <th>City</th>
              <th>Rent Price</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {flats.map((flat) => (
              <tr key={flat.id}>
                <td>{flat.name}</td>
                <td>{flat.city}</td>
                <td>${flat.rentPrice}</td>
                <td>
                  <div className={styles.tableButtons}>
                    <button
                      className={`${styles.actionButton} ${styles.detailsButton}`}
                      onClick={() => navigate(`/flat/${flat.id}`)}
                      title="View Details"
                    >
                      <Visibility className={styles.icon} /> {/* Icon View */}
                    </button>
                    <button
                      className={`${styles.actionButton} ${styles.deleteButton}`}
                      onClick={() => handleDeleteFlat(flat.id)}
                      title="Delete Flat"
                    >
                      <Delete className={styles.icon} /> {/* Icon Delete */}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default MyFlats;
