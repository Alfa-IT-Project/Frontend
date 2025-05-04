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
          <li><a href="/add">Add Delivery</a></li> {/*add delivery*/}
          <li><a href="/driver">View as Driver</a></li> {/*view as driver*/}
          <li><a href="/delivery-dashboard">Delivery Dashboard</a></li> {/*delivery dashboard*/}
          <li><a href="/view-delivery">View Delivery</a></li> {/*view delivery*/}
          <li><a href="/view-driver">View Driver</a></li> {/*view driver from yasiru's code */} 
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