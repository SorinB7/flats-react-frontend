import PropTypes from "prop-types";
import AdminOperations from "./AdminOperations";
import styles from "../../styles/UserRow.module.css";

const UserRow = ({ user }) => (
  <tr className={styles.row}>
    <td>{user.firstName}</td>
    <td>{user.lastName}</td>
    <td>{user.birthDate}</td>
    <td>{user.userType}</td>
    <td>{user.email}</td>
    <td>{user.flatsCounter || 0}</td>
    <td>{user.userType === "admin" ? "Yes" : "No"}</td>
    <td>
      <AdminOperations user={user} />
    </td>
  </tr>
);

UserRow.propTypes = {
  user: PropTypes.object.isRequired,
};

export default UserRow;
