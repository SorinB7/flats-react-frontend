// src/pages/NewFlat.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { addFlat } from "../firebase/flatServices";
import { validateFlatForm } from "../validation/flatValidation";
import { getRandomFlatImage } from "../utils/imageUtils";
import styles from "../styles/NewFlat.module.css";

const NewFlat = () => {
  const [formData, setFormData] = useState({
    name: "", 
    city: "",
    streetName: "",
    streetNumber: "",
    areaSize: "",
    hasAC: false,
    yearBuilt: "",
    rentPrice: "",
    dateAvailable: "",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [imagePreview] = useState(""); 
  const navigate = useNavigate();
  const currentUser = JSON.parse(localStorage.getItem("LogedUser"));

  // Actualizează câmpurile formularului
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // Trimiterea formularului
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({}); // Resetează erorile
    
    try {
      const imageURL = await getRandomFlatImage(); 
      setFormData((prev) => ({ ...prev, imageURL })); 
  
      const updatedFormData = { ...formData, imageURL }; 
      const validationErrors = validateFlatForm(updatedFormData);
      if (Object.keys(validationErrors).length > 0) {
        setErrors(validationErrors);
        return;
      }
  
      setLoading(true);
      await addFlat(updatedFormData, currentUser.uid);
      navigate("/"); 
    } catch (error) {
      console.error("Error saving flat:", error);
      setErrors({ general: "Failed to save flat. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.newFlatContainer}>
      <form className={styles.newFlatForm} onSubmit={handleSubmit}>
        <h2>Add New Flat</h2>
        {errors.general && <p className={styles.error}>{errors.general}</p>}

        {/* Previzualizare Imagine */}
        {imagePreview && (
          <div className={styles.imagePreview}>
            <h3>Image Preview</h3>
            <img src={imagePreview} alt="Flat Preview" />
          </div>
        )}

        {/* Name */}
        <div className={styles.formGroup}>
          <label htmlFor="name">Apartment Name</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className={errors.name ? styles.errorInput : ""}
          />
          {errors.name && <p className={styles.error}>{errors.name}</p>}
        </div>

        {/* City */}
        <div className={styles.formGroup}>
          <label htmlFor="city">City</label>
          <input
            type="text"
            id="city"
            name="city"
            value={formData.city}
            onChange={handleChange}
            className={errors.city ? styles.errorInput : ""}
          />
          {errors.city && <p className={styles.error}>{errors.city}</p>}
        </div>

        {/* Street Name */}
        <div className={styles.formGroup}>
          <label htmlFor="streetName">Street Name</label>
          <input
            type="text"
            id="streetName"
            name="streetName"
            value={formData.streetName}
            onChange={handleChange}
            className={errors.streetName ? styles.errorInput : ""}
          />
          {errors.streetName && <p className={styles.error}>{errors.streetName}</p>}
        </div>

        {/* Street Number */}
        <div className={styles.formGroup}>
          <label htmlFor="streetNumber">Street Number</label>
          <input
            type="number"
            id="streetNumber"
            name="streetNumber"
            value={formData.streetNumber}
            onChange={handleChange}
            className={errors.streetNumber ? styles.errorInput : ""}
          />
          {errors.streetNumber && <p className={styles.error}>{errors.streetNumber}</p>}
        </div>

        {/* Area Size */}
        <div className={styles.formGroup}>
          <label htmlFor="areaSize">Area Size (sq ft)</label>
          <input
            type="number"
            id="areaSize"
            name="areaSize"
            value={formData.areaSize}
            onChange={handleChange}
            className={errors.areaSize ? styles.errorInput : ""}
          />
          {errors.areaSize && <p className={styles.error}>{errors.areaSize}</p>}
        </div>

        {/* Has AC */}
        <div className={styles.formGroup}>
          <label htmlFor="hasAC">
            <input
              type="checkbox"
              id="hasAC"
              name="hasAC"
              checked={formData.hasAC}
              onChange={handleChange}
            />
            Has AC
          </label>
        </div>

        {/* Year Built */}
        <div className={styles.formGroup}>
          <label htmlFor="yearBuilt">Year Built</label>
          <input
            type="number"
            id="yearBuilt"
            name="yearBuilt"
            value={formData.yearBuilt}
            onChange={handleChange}
            className={errors.yearBuilt ? styles.errorInput : ""}
          />
          {errors.yearBuilt && <p className={styles.error}>{errors.yearBuilt}</p>}
        </div>

        {/* Rent Price */}
        <div className={styles.formGroup}>
          <label htmlFor="rentPrice">Rent Price ($)</label>
          <input
            type="number"
            id="rentPrice"
            name="rentPrice"
            value={formData.rentPrice}
            onChange={handleChange}
            className={errors.rentPrice ? styles.errorInput : ""}
          />
          {errors.rentPrice && <p className={styles.error}>{errors.rentPrice}</p>}
        </div>

        {/* Date Available */}
        <div className={styles.formGroup}>
          <label htmlFor="dateAvailable">Date Available</label>
          <input
            type="date"
            id="dateAvailable"
            name="dateAvailable"
            value={formData.dateAvailable}
            onChange={handleChange}
            className={errors.dateAvailable ? styles.errorInput : ""}
          />
          {errors.dateAvailable && <p className={styles.error}>{errors.dateAvailable}</p>}
        </div>

        <button type="submit" className={styles.saveButton} disabled={loading}>
          {loading ? "Saving..." : "Save"}
        </button>
      </form>
    </div>
  );
};

export default NewFlat;
