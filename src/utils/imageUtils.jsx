import axios from "axios";

const PEXELS_API_KEY = import.meta.env.VITE_PEXELS_API_KEY;
const PEXELS_API_URL = "https://api.pexels.com/v1/search";

export const getRandomFlatImage = async () => {
  try {
    const response = await axios.get(PEXELS_API_URL, {
      headers: {
        Authorization: PEXELS_API_KEY,
      },
      params: {
        query: "apartment interior",
        per_page: 15,
      },
    });

    const images = response.data.photos;
    if (!images || images.length === 0) {
      throw new Error("No apartment images found.");
    }

    // Filtrare imagini care pot conține persoane
    const filteredImages = images.filter((image) => {
      const altText = image.alt?.toLowerCase() || "";
      return !altText.includes("person") && !altText.includes("man") && !altText.includes("woman") &&
             !altText.includes("people") && !altText.includes("human");
    });

    if (filteredImages.length === 0) {
      throw new Error("No valid apartment images found.");
    }

    const randomImage = filteredImages[Math.floor(Math.random() * filteredImages.length)];
    return {
      src: randomImage.src.medium,
      photographer: randomImage.photographer,
      photographer_url: randomImage.photographer_url,
      alt: randomImage.alt || "Apartment Interior",
    };
  } catch (error) {
    console.error("Error fetching apartment image:", error.message);
    return {
      src: "https://via.placeholder.com/600x400?text=No+Image",
      photographer: "Unknown",
      photographer_url: "#",
      alt: "No Image Available",
    };
  }
};

