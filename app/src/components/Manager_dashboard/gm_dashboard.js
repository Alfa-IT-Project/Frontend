import React, { useEffect, useState } from 'react';
import styles from './styles.module.css';
//import apssaraLogo from './apssaraLogo.png'; //Import the logo
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const API_URL = 'http://localhost:4000/users';

function ManagerDashboard() {
  const [orders, setOrders] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get(`${API_URL}/:id/profile`);
        console.log('Orders:', response.data);
        setOrders(response.data);
      } catch (error) {
        console.error('Error fetching orders:', error);
      }
    };

    fetchOrders();
  }, []);

//   const handleClick1 = () => {
//     navigate('/supplier');
//   };

  const handleClick2 = () => {
    navigate('/customers');
  };

 
  const handleClick3 = () => {
    navigate('/purchases');
  };

  return (
    <div className={styles.contain}>
      {/* Topmost Section: Navbar within Image Container */}
      <div className={styles.header}>
       
        <nav className={styles.navbar}>
          <button className={styles.navButton}>Home</button>
          <button className={styles.navButton} onClick={handleClick2}>Customers</button>
          <button className={styles.navButton} onClick={handleClick3}>Purchases</button>
        </nav>
      </div>

      {/* Company Information Section */}
      <div className={styles.content}>
       

        {/* Orders Table */}
        <div className={styles.ordersSection}>
          <h2>Ordered Items</h2>
          <table className={styles.ordersTable}>
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Supplier Name</th>
                <th>Email</th>
                <th>Product Name</th>
                <th>Quantity</th>
                <th>Require Date</th>
                <th>Remarks</th>
                <th>Created At</th>
              </tr>
            </thead>
            <tbody>
              {orders.map(order => (
                <tr key={order.id}>
                  <td>{order.id}</td>
                  <td>{order.name}</td>
                  <td>{order.email}</td>
                  <td>{order.productName}</td>
                  <td>{order.quantity}</td>
                  <td>{order.requireDate}</td>
                  <td>{order.remarks}</td>
                  <td>{new Date(order.createdAt).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Add New Order Button */}
          
        </div>
      </div>
    </div>
  );
}

export default ManagerDashboard;
