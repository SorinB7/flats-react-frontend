import { useEffect, useState } from "react";
import { getRandomFlatImage } from "../utils/imageUtils";
import styles from "../styles/FlatImage.module.css";

const FlatImage = () => {
  const [imageData, setImageData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchImage = async () => {
      const data = await getRandomFlatImage();
      setImageData(data);
      setLoading(false);
    };

    fetchImage();
  }, []);

  if (loading) {
    return <p>Loading image...</p>;
  }

  return (
    <div className={styles.imageContainer}>
      <img
        src={imageData.src}
        alt={imageData.alt}
        className={styles.image}
      />
      <p className={styles.credit}>
        Photo by{" "}
        <a
          href={imageData.photographer_url}
          target="_blank"
          rel="noopener noreferrer"
        >
          {imageData.photographer}
        </a>{" "}
        on Pexels
      </p>
    </div>
  );
};

export default FlatImage;
