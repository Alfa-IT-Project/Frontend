import React from 'react';
import styles from './styles/pmCSS.module.css';
import { NavLink } from 'react-router-dom';


const NavBar = () => {
  return (
    <div className={styles.navbarHeader}>
      <div className={styles.navbarLogo}>
        <img src="./apssaraLogo.png" alt="Apsara Logo" style={{ height: "40px" }} />
      </div>
      <nav className={styles.navbarNav}>
        <NavLink to="/product-manager-dashboard" className={styles.navbarButton}>Dashboard</NavLink>
        <NavLink to="/home" className={styles.navbarButton}>Inventory List</NavLink>
        <NavLink to="/report" className={styles.navbarButton}>Reports</NavLink>
        <NavLink to="/profile" className={styles.navbarButton}>My Profile</NavLink>
        <NavLink to="/logout" className={styles.navbarButton}>Logout</NavLink>
        
      </nav>
    </div>
  );
};

export default NavBar;