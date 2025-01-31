import { useState } from "react";
import { Link } from "react-router-dom";
import styles from "../styles/HamburgerMenu.module.css";

const HamburgerMenu = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <div className={styles.hamburgerMenuContainer}>
      {/* Icon Hamburger */}
      <div className={styles.hamburgerIcon} onClick={toggleMenu}>
        <span className={styles.bar}></span>
        <span className={styles.bar}></span>
        <span className={styles.bar}></span>
      </div>

      {/* Dropdown Menu */}
      {isMenuOpen && (
        <nav className={styles.dropdownMenu}>
          <Link to="/home" onClick={toggleMenu}>Home</Link>
          <Link to="/my-account" onClick={toggleMenu}>My Acount</Link>
          <Link to="/my-flats" onClick={toggleMenu}>My Flats</Link>
          <Link to="/favourites" onClick={toggleMenu}>Favourites</Link>
          <Link to="/new-flat" onClick={toggleMenu}>Add Flat</Link>
        </nav>
      )}
    </div>
  );
};

export default HamburgerMenu;
