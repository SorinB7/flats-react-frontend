import { useState, useEffect } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { db } from "../firebase"; 
import ActionButtons from "../components/ActionButtons"; 
import styles from "../styles/Favourites.module.css";

const Favourites = () => {
  const [favourites, setFavourites] = useState([]); 
  const [userId, setUserId] = useState(null); 
  const navigate = useNavigate();

  // Preluăm ID-ul utilizatorului conectat din localStorage
  useEffect(() => {
    const loggedUser = JSON.parse(localStorage.getItem("LogedUser"));
    if (loggedUser) {
      setUserId(loggedUser.uid);
      fetchFavourites(loggedUser.uid); 
    }
  }, []);

  // Funcție pentru a prelua apartamentele favorite ale utilizatorului
  const fetchFavourites = async (uid) => {
    try {
      // Interogare pentru a găsi apartamentele favorite
      const q = query(collection(db, "Flats"), where("favouritedBy", "array-contains", uid));
      const querySnapshot = await getDocs(q);
      const userFavourites = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setFavourites(userFavourites); 
    } catch (error) {
      console.error("Eroare la preluarea apartamentelor favorite: ", error);
    }
  };

  // Gestionăm eliminarea unui apartament din lista de favorite
  const handleFavoriteChange = (flatId, isFavorite) => {
    if (!isFavorite) {
      // Eliminăm apartamentul din starea locală dacă este șters din favorite
      setFavourites((prevFavourites) =>
        prevFavourites.filter((favourite) => favourite.id !== flatId)
      );
    }
  };

  return (
    <div className={styles.favouritesContainer}>
      <h1>Apartamentele Favorite</h1>
      {favourites.length === 0 ? (
        <p>Nu aveți niciun apartament adăugat la favorite.</p>
      ) : (
        <table className={styles.favouritesTable}>
          <thead>
            <tr>
              <th>Nume</th>
              <th>Oraș</th>
              <th>Preț chirie</th>
              <th>Acțiuni</th>
            </tr>
          </thead>
          <tbody>
            {favourites.map((favourite) => (
              <tr key={favourite.id}>
                <td>{favourite.name || "N/A"}</td>
                <td>{favourite.city || "N/A"}</td>
                <td>${favourite.rentPrice || "N/A"}</td>
                <td>
                  <div className={styles.actions}>
                    <button
                      className={styles.viewButton}
                      onClick={() => navigate(`/flat/${favourite.id}`)}
                    >
                      Vezi Detalii
                    </button>
                    <ActionButtons
                      flatId={favourite.id}
                      useruid={userId}
                      isFavorite={true}
                      onFavoriteChange={handleFavoriteChange}
                    />
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

export default Favourites;
