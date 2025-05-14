import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './styles/pmCSS.module.css';

const Logout = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate('/'); // Redirect to home or login
  };

  const handleCancel = () => {
    navigate('/product-manager-dashboard'); // Go back to previous page
  };

  return (
    <div className={styles.logoutBackdrop}>
      <div className={styles.logoutCard}>
        <h2 className={styles.logoutTitle}>Apsara Hardware Store</h2>
        <p className={styles.logoutMessage}>Are you sure you want to log out?</p>
        <div className={styles.logoutButtonGroup}>
          <button className={styles.logoutButton} onClick={handleLogout}>Yes, Log Out</button>
          <button className={styles.logoutCancelButton} onClick={handleCancel}>Cancel</button>
        </div>
      </div>
    </div>
  );
};

export default Logout;