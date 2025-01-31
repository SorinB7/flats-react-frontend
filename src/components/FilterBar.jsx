import PropTypes from "prop-types"; 
import styles from "../styles/FilterBar.module.css";

const FilterBar = ({ filters, setFilters }) => {
  return (
    <div className={styles.filterBar}>
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
    </div>
  );
};

// Definim PropTypes pentru validare
FilterBar.propTypes = {
  filters: PropTypes.shape({
    city: PropTypes.string, 
    priceRange: PropTypes.arrayOf(PropTypes.number), 
    areaRange: PropTypes.arrayOf(PropTypes.number), 
  }).isRequired,
  setFilters: PropTypes.func.isRequired, 
};

export default FilterBar;
