import React, { useEffect, useState } from 'react';
import styles from './styles/pmCSS.module.css';
import NavBar from './NavBar.jsx';
const Dashboard = () => {
  const [stats, setStats] = useState({
    totalProducts: 0,
    lowStockItems: 0,
    newItems: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    fetch('http://localhost:4000/api/pm-dashboard')
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch dashboard data');
        return res.json();
      })
      .then(data => {
        setStats(data);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  return (
    <>
      <NavBar />
    
    <div className={styles.dashboardContainer}>
      <h1 className={styles.dashboardTitle}>Welcome, Product Manager!</h1>
      <div className={styles.dashboardCards}>
        <div className={styles.dashboardCard}>
          <h2 className={styles.dashboardCardTitle}>Total Products</h2>
          <p className={styles.dashboardCardText}>{loading ? 'Loading...' : error ? error : `${stats.totalProducts} products available in inventory.`}</p>
        </div>
        <div className={styles.dashboardCard}>
          <h2 className={styles.dashboardCardTitle}>Low Stock Items</h2>
          <p className={styles.dashboardCardText}>{loading ? 'Loading...' : error ? error : `${stats.lowStockItems} items are low on stock.`}</p>
        </div>
        <div className={styles.dashboardCard}>
          <h2 className={styles.dashboardCardTitle}>Reports Summary</h2>
          <p className={styles.dashboardCardText}>View latest sales and stock reports.</p>
        </div>
        <div className={styles.dashboardCard}>
          <h2 className={styles.dashboardCardTitle}>Recently Added</h2>
          <p className={styles.dashboardCardText}>{loading ? 'Loading...' : error ? error : `New items added this week: ${stats.newItems}`}</p>
        </div>
      </div>
    </div>
    </>
  );
};

export default Dashboard;