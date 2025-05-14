import React, { useEffect, useState } from 'react';
import styles from './styles.module.css';
import axios from 'axios';
import Navbar from '../../../components/CRM/manager/NavBarAdmin.js'; // Updated Navbar import path

const API_URL = 'http://localhost:4000';

function CustomerList() {
  const [customers, setCustomers] = useState([]);
  const [selectedTier, setSelectedTier] = useState('all');

  useEffect(() => {
    fetchCustomers();
  }, [selectedTier]);

  const fetchCustomers = async () => {
    try {
      const token = localStorage.getItem("token");
      const endpoint = selectedTier === 'all' 
        ? `${API_URL}/customers/getCustomers`
        : `${API_URL}/customers/getCustomersByTier/${selectedTier}`;
      
      const response = await axios.get(endpoint, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log('Customers:', response.data);
      setCustomers(response.data);
    } catch (error) {
      console.error('Error fetching customers:', error);
    }
  };

  const handleTierChange = (event) => {
    setSelectedTier(event.target.value);
  };

  const handleDelete = async (customerId) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${API_URL}/customers/${customerId}/deleteCustomer`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setCustomers((prevCustomers) =>
        prevCustomers.filter((customer) => customer.id !== customerId)
      );
      console.log(`Customer with ID ${customerId} deleted successfully.`);
    } catch (error) {
      console.error('Error deleting customer:', error);
    }
  };

  return (
    <div className={styles.contain}>
      <Navbar /> {/* Navbar handles navigation */}
      <div className={styles.content}>
        <div className={styles.customerSection}>
          <h2>Customers</h2>
          <div className={styles.filterSection}>
            <label htmlFor="tierFilter">Filter by Tier: </label>
            <select 
              id="tierFilter" 
              value={selectedTier} 
              onChange={handleTierChange}
              className={styles.tierSelect}
            >
              <option value="all">All Customers</option>
              <option value="platinum">Platinum</option>
              <option value="gold">Gold</option>
              <option value="silver">Silver</option>
            </select>
          </div>
          <table className={styles.customerTable}>
            <thead>
              <tr>
                <th>Customer ID</th>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Address</th>
                <th>Notes</th>
                
              </tr>
            </thead>
            <tbody>
              {customers.map((customer) => (
                <tr key={customer.id}>
                  <td>{customer.id}</td>
                  <td>{customer.user.name}</td>
                  <td>{customer.user.email}</td>
                  <td>{customer.user.phoneNumber || 'N/A'}</td>
                  <td>{customer.user.address || 'N/A'}</td>
                  <td>{customer.notes || 'N/A'}</td>
                 
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default CustomerList;