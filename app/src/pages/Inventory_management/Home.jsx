import React, { useState, useEffect } from 'react';
import styles from './styles/pmCSS.module.css';
import NavBar from './NavBar.jsx';
const API_URL = 'http://localhost:4000/hardware_inventory';
const DELETE_URL = 'http://localhost:4000/api/inventory/delete/';

function Home() {
  const [items, setItems] = useState([]);
  const [searchItem, setSearchItem] = useState('');
  const [searchSupplier, setSearchSupplier] = useState('');

  useEffect(() => {
    fetchInventory();
  }, []);

  const fetchInventory = () => {
    fetch(API_URL)
      .then(res => res.json())
      .then(data => setItems(data))
      .catch(err => {
        console.error('Fetch error:', err);
        alert('Error loading data');
      });
  };

  const deleteItem = (id) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      fetch(DELETE_URL + id, { method: 'DELETE' })
        .then(res => {
          if (res.ok) {
            fetchInventory();
          } else {
            alert('Failed to delete item.');
          }
        })
        .catch(err => {
          console.error('Delete error:', err);
          alert('Error deleting item.');
        });
    }
  };

  const filterItems = () => {
    return items.filter(item =>
      item.product_name.toLowerCase().includes(searchItem.toLowerCase()) &&
      item.supplier_name.toLowerCase().includes(searchSupplier.toLowerCase())
    );
  };

  return (
    <>
    <NavBar/>
    <div className={styles.homeContainer}>
      <h3 className={styles.homeTitle}>Apsara Hardware Store - Inventory Items</h3>
      <div className={styles.homeTopBar}>
        <div className={styles.homeSearchContainer}>
          <input
            type="text"
            className={styles.homeSearchInput}
            placeholder="Search by item name..."
            value={searchItem}
            onChange={(e) => setSearchItem(e.target.value)}
          />
          <input
            type="text"
            className={styles.homeSearchInput}
            placeholder="Search by supplier name..."
            value={searchSupplier}
            onChange={(e) => setSearchSupplier(e.target.value)}
          />
        </div>
        <a className={styles.homeAddButton} href="/create">Add Item</a>
      </div>
      <table className={styles.homeTable}>
        <thead>
          <tr>
            <th className={styles.homeTableHeader}>Item ID</th>
            <th className={styles.homeTableHeader}>Item Name</th>
            <th className={styles.homeTableHeader}>Category</th>
            <th className={styles.homeTableHeader}>Quantity</th>
            <th className={styles.homeTableHeader}>Price (LKR)</th>
            <th className={styles.homeTableHeader}>Supplier</th>
            <th className={styles.homeTableHeader}>Date Added</th>
            <th className={styles.homeTableHeader}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filterItems().length === 0 ? (
            <tr><td colSpan="8" className={styles.homeTableCell}>No items found.</td></tr>
          ) : (
            filterItems().map(item => (
              <tr key={item.item_id}>
                <td className={styles.homeTableCell}>{item.item_id}</td>
                <td className={styles.homeTableCell}>{item.product_name}</td>
                <td className={styles.homeTableCell}>{item.category}</td>
                <td className={styles.homeTableCell}>{item.quantity}</td>
                <td className={styles.homeTableCell}>{item.price}</td>
                <td className={styles.homeTableCell}>{item.supplier_name}</td>
                <td className={styles.homeTableCell}>{item.date_added}</td>
                <td className={styles.homeTableCell}>
                  <a href={`/read/${item.item_id}`} className={`${styles.homeButton} ${styles.homeButtonInfo}`}>View</a>
                  <a href={`/edit/${item.item_id}`} className={`${styles.homeButton} ${styles.homeButtonWarning}`}>Update</a>
                  <button className={`${styles.homeButton} ${styles.homeButtonDanger}`} onClick={() => deleteItem(item.item_id)}>Delete</button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
      <div className={styles.homeSummary}>Total Items: {filterItems().length}</div>
    </div>
    </>
  );
}

export default Home;