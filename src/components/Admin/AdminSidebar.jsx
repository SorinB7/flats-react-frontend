import { Link } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import styles from "../../styles/Sidebar.module.css";

const AdminSidebar = () => {
  const { currentUser } = useContext(AuthContext);

  if (currentUser?.userType !== "admin") return null;

  return (
    <div className={styles.sidebar}>
      <h3>Admin Panel</h3>
      <ul>
        <li>
          <Link to="/admin/all-users">All Users</Link>
        </li>
      </ul>
    </div>
  );
};

export default AdminSidebar;
