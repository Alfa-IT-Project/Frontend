import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './styles.module.css';
const Navbar = () => {
  
  const navigate = useNavigate();
  const handleLogout = () => {
    localStorage.removeItem("token"); 
    navigate("/login"); 
  };

  const handleClick1 = () => {
    navigate('/delivery-manager-dashboard');
  };

  const handleClick2 = () => {
    navigate('/customers');
  };

  const handleClick3 = () => {
    navigate('/purchases');
  };
 
return(
<div className={styles.contain}>
      {/* Topmost Section: Navbar within Image Container */}
      <div className={styles.header}>
       
        <nav className={styles.navbar}>
          <button className={styles.navButton} onClick={handleClick1}>Home</button>
          <button className={styles.navButton} onClick={handleClick2}>DeliveryDashboard</button>
          <button className={styles.navButton} onClick={handleClick3}>DriverDashboard</button>
          <button onClick={handleLogout} style={styles.button}>
                Logout
          </button>
        </nav>
      </div>
      </div>
      )
      
};

export default Navbar;