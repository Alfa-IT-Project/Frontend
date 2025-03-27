import React from 'react';
import './Nav.css';

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="navbar-left">
        <a href="/" className="logo">
          Customer Profile
        </a>
      </div>
      <div className="navbar-center">
        <ul className="nav-links">
          <li><a href="/customer-dashboard">Purchases</a></li>
          <li><a href="/edit_profile">Edit Profile</a></li>
          <li><a href="/contact">Contact Us</a></li>
        </ul>
      </div>
      <div className="navbar-right">
        <a href="/cart" className="cart-icon">
          <i className="fas fa-shopping-cart"></i>
          <span className="cart-count">0</span>
        </a>
        <a href="/account" className="user-icon">
          <i className="fas fa-user"></i>
        </a>
      </div>
    </nav>
  );
};

export default Navbar;