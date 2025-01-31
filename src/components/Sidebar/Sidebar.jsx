import { NavLink } from "react-router-dom";
import styles from "../../styles/Sidebar.module.css";
import Timer from "../Timer/Timer";

const Sidebar = () => {
  // Obținem datele utilizatorului autentificat
  const currentUser = JSON.parse(localStorage.getItem("LogedUser"));

  const handleSessionExpire = () => {
    alert("Session expired. Please log in again.");
    window.location.href = "/login"; 
  };

  return (
    <aside className={styles.sidebar}>
      {/* Timer Section */}
      <Timer initialTime={3600} onSessionExpire={handleSessionExpire} />

      {/* Menu Section */}
      <div className={styles.menuWrapper}>
        <ul className={styles.menuItems}>
          <li className={styles.menuItem}>
            <NavLink
              to="/home"
              className={({ isActive }) =>
                isActive ? styles.activeLink : styles.link
              }
            >
              Home
            </NavLink>
          </li>
          <li className={styles.menuItem}>
            <NavLink
              to="/new-flat"
              className={({ isActive }) =>
                isActive ? styles.activeLink : styles.link
              }
            >
              NewFlat
            </NavLink>
          </li>
          <li className={styles.menuItem}>
            <NavLink
              to="/my-flats"
              className={({ isActive }) =>
                isActive ? styles.activeLink : styles.link
              }
            >
              My Flats
            </NavLink>
          </li>
          <li className={styles.menuItem}>
            <NavLink
              to="/favourites"
              className={({ isActive }) =>
                isActive ? styles.activeLink : styles.link
              }
            >
              Favourites
            </NavLink>
          </li>
          <li className={styles.menuItem}>
            <NavLink
              to="/my-account"
              className={({ isActive }) =>
                isActive ? styles.activeLink : styles.link
              }
            >
              MyAccount
            </NavLink>
          </li>
          {/* Vizibil doar pentru utilizatorii admin */}
          {currentUser?.userType === "admin" && (
            <li className={styles.menuItem}>
              <NavLink
                to="/all-users"
                className={({ isActive }) =>
                  isActive ? styles.activeLink : styles.link
                }
              >
                All Users
              </NavLink>
            </li>
          )}
        </ul>
      </div>
    </aside>
  );
};

export default Sidebar;
