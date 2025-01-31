import { Outlet } from "react-router-dom";
import Header from "../components/Header/Header";
import Sidebar from "../components/Sidebar/Sidebar";
import Footer from "../components/Footer/Footer";
import styles from "../styles/Layout.module.css";

const Layout = () => {
  return (
    <div className={styles.layoutContainer}>
      {/* Header */}
      <header className={styles.headerWrapper}>
        <Header />
      </header>

      {/* Content: Sidebar and Main */}
      <div className={styles.contentContainer}>
        <aside className={styles.sidebarWrapper}>
          <Sidebar />
        </aside>
        <main className={styles.mainWrapper}>
          <Outlet />
        </main>
      </div>

      {/* Footer */}
      <footer className={styles.footerWrapper}>
        <Footer />
      </footer>
    </div>
  );
};

export default Layout;
