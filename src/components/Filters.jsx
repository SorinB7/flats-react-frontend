import PropTypes from "prop-types";
import { Grid, Select, MenuItem, TextField, Checkbox, FormControlLabel } from "@mui/material";

const Filters = ({ filters, setFilters, sortOption, setSortOption }) => {
  return (
    <Grid container spacing={2} marginBottom={2}>
      {/* Filter: User Type */}
      <Grid item xs={12} sm={6} md={4}>
        <Select
          value={filters.userType}
          onChange={(e) => setFilters({ ...filters, userType: e.target.value })}
          displayEmpty
          fullWidth
          aria-label="Filter by user type"
        >
          <MenuItem value="">All User Types</MenuItem>
          <MenuItem value="regularUser">Regular User</MenuItem>
          <MenuItem value="admin">Admin</MenuItem>
        </Select>
      </Grid>

      {/* Filter: Age Range */}
      <Grid item xs={6} sm={3}>
        <TextField
          type="number"
          label="Min Age"
          value={filters.ageRange[0]}
          onChange={(e) =>
            setFilters({
              ...filters,
              ageRange: [Number(e.target.value), filters.ageRange[1]],
            })
          }
          fullWidth
        />
      </Grid>
      <Grid item xs={6} sm={3}>
        <TextField
          type="number"
          label="Max Age"
          value={filters.ageRange[1]}
          onChange={(e) =>
            setFilters({
              ...filters,
              ageRange: [filters.ageRange[0], Number(e.target.value)],
            })
          }
          fullWidth
        />
      </Grid>

      {/* Filter: Flats Counter Range */}
      <Grid item xs={6} sm={3}>
        <TextField
          type="number"
          label="Min Flats"
          value={filters.flatsCounterRange[0]}
          onChange={(e) =>
            setFilters({
              ...filters,
              flatsCounterRange: [
                Number(e.target.value),
                filters.flatsCounterRange[1],
              ],
            })
          }
          fullWidth
        />
      </Grid>
      <Grid item xs={6} sm={3}>
        <TextField
          type="number"
          label="Max Flats"
          value={filters.flatsCounterRange[1]}
          onChange={(e) =>
            setFilters({
              ...filters,
              flatsCounterRange: [
                filters.flatsCounterRange[0],
                Number(e.target.value),
              ],
            })
          }
          fullWidth
        />
      </Grid>

      {/* Filter: Is Admin */}
      <Grid item xs={12}>
        <FormControlLabel
          control={
            <Checkbox
              checked={filters.isAdmin}
              onChange={(e) =>
                setFilters({ ...filters, isAdmin: e.target.checked })
              }
              color="primary"
            />
          }
          label="Is Admin"
        />
      </Grid>

      {/* Sort Option */}
      <Grid item xs={12} sm={6} md={4}>
        <Select
          value={sortOption}
          onChange={(e) => setSortOption(e.target.value)}
          displayEmpty
          fullWidth
          aria-label="Sort by"
        >
          <MenuItem value="">Sort by</MenuItem>
          <MenuItem value="firstName">First Name</MenuItem>
          <MenuItem value="lastName">Last Name</MenuItem>
          <MenuItem value="flatsCounter">Flats Counter</MenuItem>
        </Select>
      </Grid>
    </Grid>
  );
};

Filters.propTypes = {
  filters: PropTypes.shape({
    userType: PropTypes.string,
    ageRange: PropTypes.arrayOf(PropTypes.number).isRequired,
    flatsCounterRange: PropTypes.arrayOf(PropTypes.number).isRequired,
    isAdmin: PropTypes.bool,
  }).isRequired,
  setFilters: PropTypes.func.isRequired,
  sortOption: PropTypes.string.isRequired,
  setSortOption: PropTypes.func.isRequired,
};

export default Filters;
