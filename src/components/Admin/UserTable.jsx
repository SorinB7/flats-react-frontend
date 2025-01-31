import PropTypes from "prop-types";
import UserRow from "./UserRow";
import styles from "../../styles/UserTable.module.css";

const UserTable = ({ users, filters, sortOption }) => {
  const applyFilters = () => {
    return users
      .filter((user) => {
        const age = new Date().getFullYear() - new Date(user.birthDate).getFullYear();
        const flatsCounter = user.flatsCounter || 0;
        const isAdmin = user.userType === "admin";

        return (
          (!filters.userType || user.userType === filters.userType) &&
          age >= filters.ageRange[0] &&
          age <= filters.ageRange[1] &&
          flatsCounter >= filters.flatsRange[0] &&
          flatsCounter <= filters.flatsRange[1] &&
          (filters.isAdmin === "" || filters.isAdmin === isAdmin.toString())
        );
      })
      .sort((a, b) => {
        if (sortOption === "firstName") return a.firstName.localeCompare(b.firstName);
        if (sortOption === "lastName") return b.lastName.localeCompare(a.lastName);
        if (sortOption === "flatsCounter") return (b.flatsCounter || 0) - (a.flatsCounter || 0);
        return 0;
      });
  };

  return (
    <table className={styles.table}>
      <thead>
        <tr>
          <th>First Name</th>
          <th>Last Name</th>
          <th>Birth Date</th>
          <th>User Type</th>
          <th>Email</th>
          <th>Flats Counter</th>
          <th>Is Admin</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {applyFilters().map((user) => (
          <UserRow key={user.id} user={user} />
        ))}
      </tbody>
    </table>
  );
};

UserTable.propTypes = {
  users: PropTypes.array.isRequired,
  filters: PropTypes.object.isRequired,
  sortOption: PropTypes.string.isRequired,
};

export default UserTable;
