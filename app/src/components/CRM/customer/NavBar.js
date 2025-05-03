import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './Nav.css';
import apssaraLogo from './apssaraLogo.png';
const Navbar = () => {
  
  const navigate = useNavigate();
  const handleLogout = () => {
    localStorage.removeItem("token"); 
    navigate("/login"); 
  };
  return (
    <nav className="navbar">
      <img src={apssaraLogo} alt="Company Logo" className={styles.logo} />
      <div className="navbar-center">
        <ul className="nav-links">
          <li><a href="/customer-dashboard">Purchases</a></li>
          <li><a href="/edit_profile">Edit Profile</a></li>
          <li><a href="/contact">Contact Us</a></li>
        </ul>
      </div>
      <div className="navbar-right">
      <button className= "logout" onClick={handleLogout} style={styles.button}>
      Logout
    </button>
        
      </div>
    </nav>
    
  );
};


export default Navbar;