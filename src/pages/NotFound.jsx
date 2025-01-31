import { useNavigate } from "react-router-dom";
import styles from "../styles/NotFound.module.css";

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className={styles.notFoundContainer}>
      <div className={styles.content}>
        <img
          src="https://cdn-icons-png.flaticon.com/512/2748/2748558.png" 
          className={styles.image}
        />
        <h1 className={styles.title}>404 - Lost in Space</h1>
        <p className={styles.description}>
          It seems like you`ve ventured too far. The page you`re looking for isn`t here.
        </p>
        <button
          className={styles.button}
          onClick={() => navigate("/home")}
        >
          Back to Home
        </button>
      </div>
    </div>
  );
};

export default NotFound;
