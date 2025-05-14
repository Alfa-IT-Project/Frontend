import React from 'react';
import styles from './styles/pmCSS.module.css';
import NavBar from './NavBar.jsx';
const PmProfile = () => {
  return (
    <>
    <NavBar/>
    <div className={styles.profileContainer}>
      <h1 className={styles.profileTitle}>Apsara Hardware</h1>
      <div className={styles.profileSubtitle}>Product Manager Profile</div>
      <div className={styles.profileImageWrapper}>
        <img className={styles.profileImage} src="/manager.jpg" alt="Profile" />
      </div>
      <h2 className={styles.profileName}>Nipun Demintha</h2>
      <div className={styles.profileRole}>Product Manager</div>
      <div className={styles.profileDetailsWrapper}>
        <div className={styles.profileDetailsLeft}>
          <div><b>Email:</b> nipun.demintha@apsarahardware.com</div>
          <div><b>Phone:</b> +94 77 123 4567</div>
          <div><b>Department:</b> Product Management</div>
          <div><b>Date Joined:</b> 20.08.2015</div>
          <div><b>Experience:</b> 8+ years in product strategy</div>
          <div><b>Location:</b> Colombo, Sri Lanka</div>
          <div><b>Languages:</b> English, Sinhala</div>
        </div>
        <div className={styles.profileDetailsRight}>
          <div><b>Education:</b> BSc in Industrial Engineering, UoM</div>
          <div><b>Skills:</b> Market Analysis, Supplier Management</div>
          <div><b>Current Projects:</b> Eco-friendly tools, Supplier system</div>
          <div><b>Achievements:</b> Launched 25+ tools, +20% delivery speed</div>
          <div><b>Responsibilities:</b> Dev & Strategy, Market Research</div>
          <div><b>Reporting To:</b> General Manager</div>
        </div>
      </div>
    </div>
    </>
  );
};

export default PmProfile;