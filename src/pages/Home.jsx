import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { db } from "../firebase";
import {
  collection,
  query,
  getDocs,
  doc,
  updateDoc,
  arrayUnion,
  arrayRemove,
} from "firebase/firestore";
import MessageButton from "../components/MessageButton";
import { Visibility, Favorite, FavoriteBorder } from "@mui/icons-material"; 
import styles from "../styles/Home.module.css";

const Home = () => {
  const [flats, setFlats] = useState([]);
  const [filters, setFilters] = useState({
    city: "",
    priceRange: [0, 10000],
    areaRange: [0, 500],
  });
  const [sortOption, setSortOption] = useState("city");
  const navigate = useNavigate();
  const currentUser = JSON.parse(localStorage.getItem("LogedUser")) || null;

  useEffect(() => {
    if (!currentUser) {
      console.warn("User is not logged in. Redirecting to login.");
      navigate("/login");
      return;
    }

    const fetchFlats = async () => {
      try {
        const flatsQuery = query(collection(db, "Flats"));
        const flatsSnapshot = await getDocs(flatsQuery);
        const flatsData = flatsSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        const usersQuery = query(collection(db, "Users"));
        const usersSnapshot = await getDocs(usersQuery);
        const usersData = usersSnapshot.docs.reduce((acc, doc) => {
          acc[doc.data().uid] = doc.data();
          return acc;
        }, {});

        const flatsWithUserDetails = flatsData.map((flat) => {
          const user = usersData[flat.userId] || {};
          return {
            ...flat,
            userFirstName: user.firstName || "N/A",
            userLastName: user.lastName || "N/A",
            userEmail: user.email || "N/A",
          };
        });

        setFlats(flatsWithUserDetails);
      } catch (error) {
        console.error("Error fetching flats or users:", error);
      }
    };

    fetchFlats();
  }, [currentUser, navigate]);

  const applyFilters = () => {
    return flats
      .filter(({ city = "", rentPrice = 0, areaSize = 0 }) =>
        city.toLowerCase().includes(filters.city.toLowerCase()) &&
        rentPrice >= filters.priceRange[0] &&
        rentPrice <= filters.priceRange[1] &&
        areaSize >= filters.areaRange[0] &&
        areaSize <= filters.areaRange[1]
      )
      .sort((a, b) =>
        sortOption === "city"
          ? (a.city || "").localeCompare(b.city || "")
          : sortOption === "price"
          ? (a.rentPrice || 0) - (b.rentPrice || 0)
          : (a.areaSize || 0) - (b.areaSize || 0)
      );
  };

  const toggleFavourite = async (flatId) => {
    if (!currentUser) {
      console.error("User is not logged in.");
      navigate("/login");
      return;
    }

    try {
      const flatRef = doc(db, "Flats", flatId);
      const flat = flats.find((f) => f.id === flatId);
      if (flat.favouritedBy?.includes(currentUser.uid)) {
        await updateDoc(flatRef, {
          favouritedBy: arrayRemove(currentUser.uid),
        });
        setFlats((prev) =>
          prev.map((f) =>
            f.id === flatId
              ? {
                  ...f,
                  favouritedBy: f.favouritedBy.filter(
                    (id) => id !== currentUser.uid
                  ),
                }
              : f
          )
        );
      } else {
        await updateDoc(flatRef, {
          favouritedBy: arrayUnion(currentUser.uid),
        });
        setFlats((prev) =>
          prev.map((f) =>
            f.id === flatId
              ? {
                  ...f,
                  favouritedBy: [...(f.favouritedBy || []), currentUser.uid],
                }
              : f
          )
        );
      }
    } catch (error) {
      console.error("Error toggling favourite:", error);
    }
  };

  return (
    <div className={styles.homeContainer}>
      <h1>FlatFinder</h1>
      <div className={styles.filters}>
        <input
          type="text"
          placeholder="Search by city"
          value={filters.city}
          onChange={(e) => setFilters({ ...filters, city: e.target.value })}
        />
        <input
          type="number"
          placeholder="Min Price"
          onChange={(e) =>
            setFilters({
              ...filters,
              priceRange: [Number(e.target.value), filters.priceRange[1]],
            })
          }
        />
        <input
          type="number"
          placeholder="Max Price"
          onChange={(e) =>
            setFilters({
              ...filters,
              priceRange: [filters.priceRange[0], Number(e.target.value)],
            })
          }
        />
        <input
          type="number"
          placeholder="Min Area"
          onChange={(e) =>
            setFilters({
              ...filters,
              areaRange: [Number(e.target.value), filters.areaRange[1]],
            })
          }
        />
        <input
          type="number"
          placeholder="Max Area"
          onChange={(e) =>
            setFilters({
              ...filters,
              areaRange: [filters.areaRange[0], Number(e.target.value)],
            })
          }
        />
        <select onChange={(e) => setSortOption(e.target.value)}>
          <option value="city">Sort by City</option>
          <option value="price">Sort by Price</option>
          <option value="area">Sort by Area</option>
        </select>
      </div>

      <table className={styles.flatsTable}>
        <thead>
          <tr>
            <th>Name</th>
            <th>City</th>
            <th>Rent Price</th>
            <th>Area Size</th>
            <th>First Name</th>
            <th>Last Name</th>
            <th>Email</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {applyFilters().map((flat) => (
            <tr key={flat.id}>
              <td>{flat.name || "N/A"}</td>
              <td>{flat.city || "N/A"}</td>
              <td>${flat.rentPrice || "N/A"}</td>
              <td>{flat.areaSize ? `${flat.areaSize} m²` : "N/A"}</td>
              <td>{flat.userFirstName}</td>
              <td>{flat.userLastName}</td>
              <td>{flat.userEmail}</td>
              <td>
                <div className={styles.actions}>
                  <Visibility
                    className={styles.iconButton}
                    titleAccess="View Details"
                    onClick={() => navigate(`/flat/${flat.id}`)}
                  />
                  {flat.favouritedBy?.includes(currentUser?.uid) ? (
                    <Favorite
                      className={styles.iconButton}
                      titleAccess="Remove from Favourites"
                      onClick={() => toggleFavourite(flat.id)}
                      style={{ color: "red" }}
                    />
                  ) : (
                    <FavoriteBorder
                      className={styles.iconButton}
                      titleAccess="Add to Favourites"
                      onClick={() => toggleFavourite(flat.id)}
                    />
                  )}
                  <MessageButton flatId={flat.id} currentUser={currentUser} />
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Home;
