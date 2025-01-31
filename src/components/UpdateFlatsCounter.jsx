import { useEffect } from "react";
import PropTypes from "prop-types";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";

const UpdateFlatsCounter = ({ users, setUsers }) => {
  useEffect(() => {
    const updateFlatsCounter = async () => {
      try {
        const flatsSnapshot = await getDocs(collection(db, "Flats"));
        const flats = flatsSnapshot.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        }));

        const updatedUsers = users.map((user) => {
          const userFlats = flats.filter((flat) => flat.userId === user.uid);
          return { ...user, flatsCounter: userFlats.length };
        });

        setUsers(updatedUsers);
      } catch (error) {
        console.error("Error updating flats counter:", error);
      }
    };

    if (users.length > 0) {
      updateFlatsCounter();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [users]); 

  return null; 
};

// PropTypes pentru validarea tipurilor de date
UpdateFlatsCounter.propTypes = {
  users: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      flatsCounter: PropTypes.number,
    })
  ).isRequired,
  setUsers: PropTypes.func.isRequired,
};

export default UpdateFlatsCounter;
