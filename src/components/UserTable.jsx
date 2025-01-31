import PropTypes from "prop-types";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";
import ActionButtons from "./ActionButtons";
import EditUserButton from "./EditUserButton"; 

const UserTable = ({ users, onGrantAdmin, onDelete, onViewProfile, onUpdate }) => {
  return (
    <TableContainer>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>First Name</TableCell>
            <TableCell>Last Name</TableCell>
            <TableCell>Email</TableCell>
            <TableCell>Birth Date</TableCell>
            <TableCell>Age</TableCell>
            <TableCell>User Type</TableCell>
            <TableCell>Flats Counter</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {users.map((user) => (
            <TableRow key={user.id}>
              <TableCell>{user.firstName}</TableCell>
              <TableCell>{user.lastName}</TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>{user.birthDate}</TableCell>
              <TableCell>
                {new Date().getFullYear() - new Date(user.birthDate).getFullYear()}
              </TableCell>
              <TableCell>{user.userType}</TableCell>
              <TableCell>{user.flatsCounter || 0}</TableCell>
              <TableCell>
                <div style={{ display: "flex", gap: "8px" }}>
                  <ActionButtons
                    isAdmin={user.userType === "admin"}
                    onGrantAdmin={() => onGrantAdmin(user)}
                    onDelete={() => onDelete(user.id)}
                    onViewProfile={() => onViewProfile(user)}
                  />
                  <EditUserButton
                    user={user}
                    onUpdate={(updatedUser) => onUpdate(updatedUser)}
                  />
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

UserTable.propTypes = {
  users: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      firstName: PropTypes.string.isRequired,
      lastName: PropTypes.string.isRequired,
      email: PropTypes.string.isRequired,
      birthDate: PropTypes.string.isRequired,
      userType: PropTypes.string.isRequired,
      flatsCounter: PropTypes.number,
    })
  ).isRequired,
  onGrantAdmin: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  onViewProfile: PropTypes.func.isRequired,
  onUpdate: PropTypes.func.isRequired, 
};

export default UserTable;
