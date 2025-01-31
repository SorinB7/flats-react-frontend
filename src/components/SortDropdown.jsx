import PropTypes from "prop-types"; 
import styles from "../styles/SortDropdown.module.css";

const SortDropdown = ({ sortOption, setSortOption }) => {
  return (
    <div className={styles.sortDropdown}>
      <select value={sortOption} onChange={(e) => setSortOption(e.target.value)}>
        <option value="city">Sort by City</option>
        <option value="price">Sort by Price</option>
        <option value="area">Sort by Area</option>
      </select>
    </div>
  );
};

SortDropdown.propTypes = {
  sortOption: PropTypes.string.isRequired, 
  setSortOption: PropTypes.func.isRequired, 
};

export default SortDropdown;
