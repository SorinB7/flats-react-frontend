import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../firebase";

const FlatCounter = ({ userId }) => {
  const [flatsCount, setFlatsCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFlatsCount = async () => {
      try {
        const flatsQuery = query(collection(db, "Flats"), where("userId", "==", userId));
        const flatsSnapshot = await getDocs(flatsQuery);
        setFlatsCount(flatsSnapshot.size); // Numărăm câte documente corespund
      } catch (error) {
        console.error(`Error fetching flats for userId ${userId}:`, error);
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchFlatsCount();
    }
  }, [userId]);

  if (loading) {
    return <span>Loading...</span>;
  }

  return <span>{flatsCount}</span>;
};

FlatCounter.propTypes = {
  userId: PropTypes.string.isRequired,
};

export default FlatCounter;
