//NavBarAdmin.js


import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import styles from './styles.module.css';
import apssaraLogo from './apssaraLogo(1).png'; // Import the logo
import axios from 'axios';
import * as XLSX from 'xlsx';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const handleExportDelivery = async () => {
    try {
      // Fetch delivery data from your API
      const response = await axios.get('http://localhost:4000/alldeliveries', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });

      const deliveryData = response.data;

      // Transform data for Excel
      const excelData = deliveryData.map(delivery => ({
        'Tracking ID': delivery.TrackingID,
        'Description': delivery.Description,
        'Client Name': delivery.Client_Name,
        'Delivery Address': delivery.Delivery_address,
        'Contact Number': delivery.Contact_Number,
        'Email': delivery.Email,
        'Assigned Date': new Date(delivery.Assigned_Date).toLocaleDateString(),
        'Expected Delivery Date': new Date(delivery.Expected_DeliveryDate).toLocaleDateString(),
        'Comments': delivery.Comments
      }));

      // Create worksheet
      const worksheet = XLSX.utils.json_to_sheet(excelData);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Deliveries');

      // Generate Excel file
      XLSX.writeFile(workbook, 'delivery_report.xlsx');
    } catch (error) {
      console.error('Error exporting delivery data:', error);
      alert('Failed to export delivery data. Please try again.');
    }
  };

  const isActive = (path) => location.pathname === path;

  return (
    <div className={styles.header}>
      <img src={apssaraLogo} alt="Company Logo" className={styles.logo} />
      <nav className={styles.navbar}>
        <button
          className={`${styles.navButton} ${isActive('/delivery-manager-dashboard') ? styles.active : ''}`}
          onClick={() => navigate('/delivery-manager-dashboard')}
        >
          Dashboard
        </button>
           
        <button
          className={`${styles.navButton} ${isActive('/delivery-manager-dashboard') ? styles.active : ''}`}
          onClick={handleExportDelivery}
        >
          Export Delivery
        </button>
        <button className={styles.navButton} onClick={handleLogout}>Logout</button>
      </nav>
    </div>
  );
};

export default Navbar;