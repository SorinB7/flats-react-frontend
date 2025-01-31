import { useState, useEffect } from "react";
import UserFilters from "./UserFilters";
import UserTable from "./UserTable";
import { db } from "../../firebase";
import { collection, getDocs } from "firebase/firestore";
import styles from "../../styles/AllUsers.module.css";

const AllUsers = () => {
  const [users, setUsers] = useState([]);
  const [filters, setFilters] = useState({
    userType: "",
    ageRange: [0, 100],
    flatsRange: [0, 100],
    isAdmin: "",
  });
  const [sortOption, setSortOption] = useState("firstName");

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "Users"));
        const userList = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setUsers(userList);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchUsers();
  }, []);

  return (
    <div className={styles.container}>
      <h1>All Users</h1>
      <UserFilters
        filters={filters}
        setFilters={setFilters}
        setSortOption={setSortOption}
      />
      <UserTable users={users} filters={filters} sortOption={sortOption} />
    </div>
  );
};

export default AllUsers;
