import { useState, useEffect } from "react";
import PropTypes from "prop-types"; 
import styles from "../../styles/Timer.module.css";

const Timer = ({ initialTime = 3600, onSessionExpire }) => {
  // Starea pentru timpul rămas
  const [timeRemaining, setTimeRemaining] = useState(initialTime);

  useEffect(() => {
    // Creăm un interval care scade timpul rămas
    const timer = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev > 0) {
          return prev - 1;
        } else {
          clearInterval(timer);
          if (onSessionExpire) onSessionExpire();
          return 0; // Setăm timpul la 0
        }
      });
    }, 1000);

    // Curățăm intervalul când componenta se demontează
    return () => clearInterval(timer);
  }, [onSessionExpire]);

  // Funcție pentru a formata timpul rămas în format MM:SS
  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? "0" : ""}${remainingSeconds}`;
  };

  return (
    <div className={styles.timerWrapper}>
      <div className={styles.timerLabel}>Session Timer:</div>
      <div className={styles.timer}>{formatTime(timeRemaining)}</div>
    </div>
  );
};

// Definire PropTypes pentru validare
Timer.propTypes = {
  initialTime: PropTypes.number, 
  onSessionExpire: PropTypes.func,
};


export default Timer;
