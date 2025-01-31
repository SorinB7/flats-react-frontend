import PropTypes from "prop-types";
import styles from "../../styles/UserFilters.module.css";

const UserFilters = ({ filters, setFilters, setSortOption }) => {
  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <div className={styles.filters}>
      <h3>Filters</h3>
      <label>
        User Type:
        <select
          value={filters.userType}
          onChange={(e) => handleFilterChange("userType", e.target.value)}
        >
          <option value="">All</option>
          <option value="admin">Admin</option>
          <option value="regularUser">Regular User</option>
        </select>
      </label>
      <label>
        Age Range:
        <input
          type="number"
          placeholder="Min Age"
          onChange={(e) =>
            handleFilterChange("ageRange", [Number(e.target.value), filters.ageRange[1]])
          }
        />
        <input
          type="number"
          placeholder="Max Age"
          onChange={(e) =>
            handleFilterChange("ageRange", [filters.ageRange[0], Number(e.target.value)])
          }
        />
      </label>
      <label>
        Flats Counter Range:
        <input
          type="number"
          placeholder="Min Flats"
          onChange={(e) =>
            handleFilterChange("flatsRange", [Number(e.target.value), filters.flatsRange[1]])
          }
        />
        <input
          type="number"
          placeholder="Max Flats"
          onChange={(e) =>
            handleFilterChange("flatsRange", [filters.flatsRange[0], Number(e.target.value)])
          }
        />
      </label>
      <label>
        Is Admin:
        <select
          value={filters.isAdmin}
          onChange={(e) => handleFilterChange("isAdmin", e.target.value)}
        >
          <option value="">All</option>
          <option value="true">Yes</option>
          <option value="false">No</option>
        </select>
      </label>
      <h3>Sort</h3>
      <select onChange={(e) => setSortOption(e.target.value)}>
        <option value="firstName">First Name</option>
        <option value="lastName">Last Name</option>
        <option value="flatsCounter">Flats Counter</option>
      </select>
    </div>
  );
};

UserFilters.propTypes = {
  filters: PropTypes.object.isRequired,
  setFilters: PropTypes.func.isRequired,
  setSortOption: PropTypes.func.isRequired,
};

export default UserFilters;
