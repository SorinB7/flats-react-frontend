import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../firebase";
import styles from "../styles/EditFlat.module.css";

const EditFlat = () => {
  const { flatId } = useParams();
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
  const [originalData, setOriginalData] = useState(null); 
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!flatId) {
      console.error("Flat ID is missing!");
      setError("Flat ID is missing!");
      return;
    }

    const fetchFlat = async () => {
      try {
        const docRef = doc(db, "Flats", flatId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setOriginalData(data); 
          setFormData({
            ...data,
            dateAvailable: data.dateAvailable
              ? new Date(data.dateAvailable.seconds * 1000).toISOString().split("T")[0]
              : "",
          });
        } else {
          console.error("No such document!");
          setError("Flat not found.");
        }
      } catch (err) {
        console.error("Error fetching flat:", err);
        setError("Failed to fetch flat details.");
      }
    };

    fetchFlat();
  }, [flatId]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    if (!formData.name.trim() || !formData.city.trim() || !formData.rentPrice) {
      setError("Please fill in all required fields.");
      setLoading(false);
      return;
    }

    try {
      const docRef = doc(db, "Flats", flatId);
      await updateDoc(docRef, {
        ...formData,
        dateAvailable: formData.dateAvailable ? new Date(formData.dateAvailable) : null,
      });
      navigate(`/`); 
    } catch (err) {
      console.error("Error updating flat:", err);
      setError("Failed to update flat.");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate(-1);
  };

  if (error) {
    return <div className={styles.error}>Error: {error}</div>;
  }

  if (!originalData) {
    return <div>Loading...</div>;
  }

  return (
    <div className={styles.editFlatContainer}>
      <h2>Edit Flat</h2>
      <form className={styles.editFlatForm} onSubmit={handleSubmit}>
        <div className={styles.formGroup}>
          <label htmlFor="name">Name</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
          />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="city">City</label>
          <input
            type="text"
            id="city"
            name="city"
            value={formData.city}
            onChange={handleChange}
          />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="streetName">Street Name</label>
          <input
            type="text"
            id="streetName"
            name="streetName"
            value={formData.streetName}
            onChange={handleChange}
          />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="streetNumber">Street Number</label>
          <input
            type="number"
            id="streetNumber"
            name="streetNumber"
            value={formData.streetNumber}
            onChange={handleChange}
          />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="areaSize">Area Size</label>
          <input
            type="number"
            id="areaSize"
            name="areaSize"
            value={formData.areaSize}
            onChange={handleChange}
          />
        </div>
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
        <div className={styles.formGroup}>
          <label htmlFor="yearBuilt">Year Built</label>
          <input
            type="number"
            id="yearBuilt"
            name="yearBuilt"
            value={formData.yearBuilt}
            onChange={handleChange}
          />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="rentPrice">Rent Price</label>
          <input
            type="number"
            id="rentPrice"
            name="rentPrice"
            value={formData.rentPrice}
            onChange={handleChange}
          />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="dateAvailable">Date Available</label>
          <input
            type="date"
            id="dateAvailable"
            name="dateAvailable"
            value={formData.dateAvailable}
            onChange={handleChange}
          />
        </div>
        <div className={styles.formActions}>
          <button type="submit" className={styles.saveButton} disabled={loading}>
            {loading ? "Saving..." : "Save Changes"}
          </button>
          <button type="button" className={styles.cancelButton} onClick={handleCancel}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditFlat;
