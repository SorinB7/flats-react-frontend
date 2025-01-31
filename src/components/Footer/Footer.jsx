import { Facebook, Twitter, Instagram, LinkedIn } from "@mui/icons-material"; 
import styles from "../../styles/Footer.module.css";

const Footer = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.topSection}>
          <p className={styles.copyright}>© 2024 FlatFinder. All rights reserved.</p>
          <div className={styles.links}>
            <a href="/about" className={styles.link}>About Us</a>
            <a href="/contact" className={styles.link}>Contact Us</a>
            <a href="/privacy" className={styles.link}>Privacy Policy</a>
          </div>
        </div>
        <div className={styles.socialMedia}>
          <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className={styles.socialIcon}>
            <Facebook fontSize="large" />
          </a>
          <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className={styles.socialIcon}>
            <Twitter fontSize="large" />
          </a>
          <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className={styles.socialIcon}>
            <Instagram fontSize="large" />
          </a>
          <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className={styles.socialIcon}>
            <LinkedIn fontSize="large" />
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
