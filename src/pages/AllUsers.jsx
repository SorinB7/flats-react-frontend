import { useState, useEffect } from "react";
import {
  collection,
  getDocs,
  doc,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { db } from "../firebase";
import styles from "../styles/AllUsers.module.css";
import GrantAdminButton from "../components/GrantAdminButton";
import DeleteUserButton from "../components/DeleteUserButton";
import ViewProfileButton from "../components/ViewProfileButton";
import EditUserButton from "../components/Admin/EditUserButton";

const AllUsers = () => {
  const [users, setUsers] = useState([]);
  const [filters, setFilters] = useState({
    userType: "",
    ageRange: [0, 100],
    flatsCounterRange: [0, 100],
    isAdmin: false,
  });
  const [sortOption, setSortOption] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentUserId, setCurrentUserId] = useState(null);

  useEffect(() => {
    const auth = getAuth();
    setCurrentUserId(auth.currentUser?.uid || null);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const usersSnapshot = await getDocs(collection(db, "Users"));
        const flatsSnapshot = await getDocs(collection(db, "Flats"));

        const usersData = usersSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        const flatsData = flatsSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setUsers(
          usersData.map((user) => {
            const userFlatsCount = flatsData.filter(
              (flat) => flat.userId === user.uid
            ).length;
            return { ...user, flatsCounter: userFlatsCount };
          })
        );
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Failed to fetch data.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const applyFilters = () => {
    return users
      .filter((user) => {
        const age =
          new Date().getFullYear() - new Date(user.birthDate).getFullYear();
        return (
          (filters.userType === "" || user.userType === filters.userType) &&
          age >= filters.ageRange[0] &&
          age <= filters.ageRange[1] &&
          user.flatsCounter >= filters.flatsCounterRange[0] &&
          user.flatsCounter <= filters.flatsCounterRange[1] &&
          (!filters.isAdmin || user.userType === "admin")
        );
      })
      .sort((a, b) => {
        if (sortOption === "firstName")
          return a.firstName.localeCompare(b.firstName);
        if (sortOption === "lastName")
          return a.lastName.localeCompare(b.lastName);
        if (sortOption === "flatsCounter")
          return a.flatsCounter - b.flatsCounter;
        return 0;
      });
  };

  if (error) {
    return <div className={styles.error}>{error}</div>;
  }

  if (loading) {
    return <div>Loading users...</div>;
  }

  return (
    <div className={styles.allUsersContainer}>
      <h1>All Users</h1>
      <div className={styles.filters}>
        <select
          onChange={(e) => setFilters({ ...filters, userType: e.target.value })}
        >
          <option value="">All User Types</option>
          <option value="regularUser">Regular User</option>
          <option value="admin">Admin</option>
        </select>
        <input
          type="number"
          placeholder="Min Age"
          onChange={(e) =>
            setFilters({
              ...filters,
              ageRange: [Number(e.target.value), filters.ageRange[1]],
            })
          }
        />
        <input
          type="number"
          placeholder="Max Age"
          onChange={(e) =>
            setFilters({
              ...filters,
              ageRange: [filters.ageRange[0], Number(e.target.value)],
            })
          }
        />
        <input
          type="number"
          placeholder="Min Flats"
          onChange={(e) =>
            setFilters({
              ...filters,
              flatsCounterRange: [
                Number(e.target.value),
                filters.flatsCounterRange[1],
              ],
            })
          }
        />
        <input
          type="number"
          placeholder="Max Flats"
          onChange={(e) =>
            setFilters({
              ...filters,
              flatsCounterRange: [
                filters.flatsCounterRange[0],
                Number(e.target.value),
              ],
            })
          }
        />
        <select onChange={(e) => setSortOption(e.target.value)}>
          <option value="">Sort by</option>
          <option value="firstName">First Name</option>
          <option value="lastName">Last Name</option>
          <option value="flatsCounter">Flats Counter</option>
        </select>
      </div>
      <table className={styles.userTable}>
        <thead>
          <tr>
            <th>First Name</th>
            <th>Last Name</th>
            <th>Email</th>
            <th>Birth Date</th>
            <th>Age</th>
            <th>User Type</th>
            <th>Flats Counter</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {applyFilters().map((user) => (
            <tr key={user.id}>
              <td>{user.firstName}</td>
              <td>{user.lastName}</td>
              <td>{user.email}</td>
              <td>{user.birthDate}</td>
              <td>
                {new Date().getFullYear() -
                  new Date(user.birthDate).getFullYear()}
              </td>
              <td>{user.userType}</td>
              <td>{user.flatsCounter || 0}</td>
              <td className={styles.actions}>
                <GrantAdminButton
                  isAdmin={user.userType === "admin"}
                  currentUserId={currentUserId}
                  targetUserId={user.id}
                  onClick={async () => {
                    const newType =
                      user.userType === "admin" ? "regularUser" : "admin";
                    await updateDoc(doc(db, "Users", user.id), {
                      userType: newType,
                    });
                    setUsers((prev) =>
                      prev.map((u) =>
                        u.id === user.id ? { ...u, userType: newType } : u
                      )
                    );
                  }}
                />
                <DeleteUserButton
                  userId={user.id}
                  onDelete={async (id) => {
                    try {
                      const userRef = doc(db, "Users", id);
                      await deleteDoc(userRef);
                      setUsers((prev) => prev.filter((u) => u.id !== id));
                    } catch (error) {
                      console.error("Error deleting user:", error);
                    }
                  }}
                />
                <ViewProfileButton user={user} />
                {/* Buton rotund cu icon */}
                <EditUserButton
                  user={user}
                  onUpdate={(updatedUser) =>
                    setUsers((prev) =>
                      prev.map((u) =>
                        u.id === updatedUser.id ? updatedUser : u
                      )
                    )
                  }
                  customClass={styles.editUserButton} 
                />
              </td>
            </tr>
          ))}
          {/* Row to display total flats */}
          <tr>
            <td colSpan="6" style={{ fontWeight: "bold" }}>
              Total Flats:
            </td>
            <td colSpan="1">
              {users.reduce((sum, user) => sum + user.flatsCounter, 0)}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default AllUsers;
