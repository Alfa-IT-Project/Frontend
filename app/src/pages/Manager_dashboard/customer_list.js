import React, { useEffect, useState } from 'react';
import styles from './styles.module.css';
import apssaraLogo from './apssaraLogo.png'; //Import the logo
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const API_URL = 'http://localhost:4000';

function CustomerList() {
  const [customers, setCustomers] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(`${API_URL}/customers/getCustomers`, {
          headers: {
            Authorization: `Bearer ${token}` // Include token in request
          }
        });
        console.log("role", response.role);
        console.log('Customers:', response.data);
        setCustomers(response.data);
      } catch (error) {
        console.error('Error fetching orders:', error);
      }
    };

    fetchCustomers();
  }, []);

  const handleClick1 = () => {
    navigate('/manager-dashboard');
  };

  const handleClick2 = () => {
    navigate('/customers');
  };
  const handleClick3 = () => {
    navigate('/purchases');
  };
  const handleClick4 = () => {
    navigate('/contactList');
  };

  const handleLogout = () => {
      localStorage.removeItem("token"); 
      navigate("/login"); 
  };
  const handleDelete = async (customerId) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${API_URL}/customers/${customerId}/deleteCustomer`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setCustomers(customers.filter(customer => customer.id !== customerId));
      console.log(`Customer with ID ${customerId} deleted successfully.`);
    } catch (error) {
      console.error('Error deleting customer:', error);
    }
  };

  return (
    <div className={styles.contain}>
      {/* Topmost Section: Navbar within Image Container */}
      <div className={styles.header}>
      <img src={apssaraLogo} alt="Company Logo" className={styles.logo} />
      
        <nav className={styles.navbar}>

          <button className={styles.navButton} onClick={handleClick1}>Home</button>
          <button className={styles.navButton} onClick={handleClick2}>Customers</button>
          <button className={styles.navButton} onClick={handleClick3}>Purchases</button>
          <button className={styles.navButton} onClick={handleClick4}>ContactList</button>
          <button onClick={handleLogout} style={styles.button}>
                Logout
          </button>
        </nav>
      </div>

      {/* Company Information Section */}
        <div className={styles.content}>
       

        <div className="customer-section">
            <h2>Customers</h2>
            {/* <button onClick={() => navigate('/addcustomer')}>Add Customer</button> */}
            <table className="customer-table">
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
