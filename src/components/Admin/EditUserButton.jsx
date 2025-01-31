import { useState } from "react";
import PropTypes from "prop-types";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../../firebase";
import EditIcon from "@mui/icons-material/Edit";

const EditUserButton = ({ user, onUpdate, customClass }) => {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    birthDate: user.birthDate,
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpdateUser = async () => {
    try {
      const userDocRef = doc(db, "Users", user.id);
      await updateDoc(userDocRef, formData);
      onUpdate({ ...user, ...formData });
      setOpen(false);
    } catch (err) {
      console.error("Error updating user:", err);
    }
  };

  return (
    <>
      <button
        className={customClass}
        onClick={() => setOpen(true)}
        title="Edit User"
      >
        <EditIcon />
      </button>

      {/* Modal pentru editare */}
      <Modal
        open={open}
        onClose={() => setOpen(false)}
        aria-labelledby="edit-user-modal"
        aria-describedby="edit-user-modal-description"
      >
        <Box
          sx={{
            width: { xs: "70%", sm: "400px" }, 
            margin: { sm:"48px", xs: "25px"},
            mt: { xs: "30%", sm: "15%" },
            padding: { xs: "16px", sm: "20px" }, 
            backgroundColor: "white",
            borderRadius: "8px",
            boxShadow: 24,
            overflowY: "auto", 
            maxHeight: "90%", 
          }}
        >
          <h2 id="edit-user-modal">Edit User</h2>
          <form>
            <TextField
              label="First Name"
              name="firstName"
              value={formData.firstName}
              onChange={handleInputChange}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Last Name"
              name="lastName"
              value={formData.lastName}
              onChange={handleInputChange}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Birth Date"
              name="birthDate"
              type="date"
              value={formData.birthDate}
              onChange={handleInputChange}
              fullWidth
              margin="normal"
              InputLabelProps={{ shrink: true }}
            />
          </form>
          <Button
            onClick={handleUpdateUser}
            variant="contained"
            color="success"
            sx={{ mt: 2, mr: 1 }}
          >
            Save
          </Button>
          <Button
            onClick={() => setOpen(false)}
            variant="outlined"
            color="error"
            sx={{ mt: 2 }}
          >
            Cancel
          </Button>
        </Box>
      </Modal>
    </>
  );
};

EditUserButton.propTypes = {
  user: PropTypes.object.isRequired,
  onUpdate: PropTypes.func.isRequired,
  customClass: PropTypes.string,
};

export default EditUserButton;
