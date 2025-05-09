import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import styles from './styles.module.css';
import apssaraLogo from './apssaraLogo.png'; // Import the logo

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const isActive = (path) => location.pathname === path;

  return (
    <div className={styles.header}>
      <img src={apssaraLogo} alt="Company Logo" className={styles.logo} />
      <nav className={styles.navbar}>
        <button
          className={`${styles.navButton} ${isActive('/manager-dashboard') ? styles.active : ''}`}
          onClick={() => navigate('/manager-dashboard')}
        >
          Home
        </button>
        <button
          className={`${styles.navButton} ${isActive('/customers') ? styles.active : ''}`}
          onClick={() => navigate('/customers')}
        >
          Customers
        </button>
        <button
          className={`${styles.navButton} ${isActive('/purchases') ? styles.active : ''}`}
          onClick={() => navigate('/purchases')}
        >
          Purchases
        </button>
        <button
          className={`${styles.navButton} ${isActive('/rewardList') ? styles.active : ''}`}
          onClick={() => navigate('/rewardList')}
        >
          Generate Rewards
        </button>
        <button className={styles.navButton} onClick={handleLogout}>Logout</button>
      </nav>
    </div>
  );
};

export default Navbar;
