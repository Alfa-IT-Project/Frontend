import React, { useEffect, useState } from 'react';
import styles from './styles.module.css';
import axios from 'axios';
import Navbar from '../../components/CRM/manager/NavBarAdmin.js'; // Updated Navbar import path

const API_URL = 'http://localhost:4000';

function CustomerList() {
  const [customers, setCustomers] = useState([]);

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(`${API_URL}/customers/getCustomers`, {
          headers: {
            Authorization: `Bearer ${token}`, // Include token in request
          },
        });
        console.log('Customers:', response.data);
        setCustomers(response.data);
      } catch (error) {
        console.error('Error fetching customers:', error);
      }
    };

    fetchCustomers();
  }, []);

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
        <div className="customer-section">
          <h2>Customers</h2>
          <table className="customer-table">
            <thead>
              <tr>
                <th>Customer ID</th>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Address</th>
                <th>Notes</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {customers.map((customer) => (
                <tr key={customer.id}>
                  <td>{customer.id}</td>
                  <td>{customer.user.name}</td>
                  <td>{customer.user.email}</td>
                  <td>{customer.user.phone || 'N/A'}</td>
                  <td>{customer.user.address || 'N/A'}</td>
                  <td>{customer.notes || 'N/A'}</td>
                  <td>
                    <button onClick={() => handleDelete(customer.id)}>
                      Delete Customer
                    </button>
                  </td>
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