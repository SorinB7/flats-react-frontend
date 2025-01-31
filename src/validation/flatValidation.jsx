export const validateFlatForm = (formData) => {
  const errors = {};

  if (!formData.name || !formData.name.trim()) {
    errors.name = "Name is required.";
  }

  if (!formData.city.trim()) errors.city = "City is required.";
  if (!formData.streetName.trim()) errors.streetName = "Street name is required.";
  if (!formData.streetNumber || isNaN(Number(formData.streetNumber)) || Number(formData.streetNumber) <= 0)
    errors.streetNumber = "Street number must be a positive number.";
  if (!formData.areaSize || isNaN(Number(formData.areaSize)) || Number(formData.areaSize) <= 0)
    errors.areaSize = "Area size must be a positive number.";
  if (!formData.yearBuilt || isNaN(Number(formData.yearBuilt)) || Number(formData.yearBuilt) < 1800 || Number(formData.yearBuilt) > new Date().getFullYear())
    errors.yearBuilt = "Year built must be a valid year.";
  if (!formData.rentPrice || isNaN(Number(formData.rentPrice)) || Number(formData.rentPrice) <= 0)
    errors.rentPrice = "Rent price must be a positive number.";
  if (!formData.dateAvailable) errors.dateAvailable = "Date available is required.";

  // Validare URL imagine (opțională)
  if (!formData.imageURL || typeof formData.imageURL.src !== "string" || !formData.imageURL.src.startsWith("http")) {
    errors.imageURL = "A valid image URL is required.";
  }
  
  

  return errors;
};
