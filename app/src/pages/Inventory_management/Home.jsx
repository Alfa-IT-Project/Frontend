import React, { useState, useEffect } from 'react';
// import NavBar from './NavBar'; // Import the NavBar component
import styles from './pmCss.module.css';

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
    <div className={styles.homeContainer}>
       {/* Add the NavBar component <NavBar />*/}
      <h3>Apsara Hardware Store - Inventory Items</h3>
      <div className={styles.topBar}>
        <div className={styles.searchInputContainer}>
          <input
            type="text"
            className={styles.searchInput}
            placeholder="Search by item name..."
            value={searchItem}
            onChange={(e) => setSearchItem(e.target.value)}
          />
          <input
            type="text"
            className={styles.searchInput}
            placeholder="Search by supplier name..."
            value={searchSupplier}
            onChange={(e) => setSearchSupplier(e.target.value)}
          />
        </div>
        <a className={styles.addButton} href="/create">Add Item</a>
      </div>
      <table className={styles.inventoryTable}>
        <thead>
          <tr>
            <th>Item ID</th>
            <th>Item Name</th>
            <th>Category</th>
            <th>Quantity</th>
            <th>Price (LKR)</th>
            <th>Supplier</th>
            <th>Date Added</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filterItems().length === 0 ? (
            <tr><td colSpan="8">No items found.</td></tr>
          ) : (
            filterItems().map(item => (
              <tr key={item.item_id}>
                <td>{item.item_id}</td>
                <td>{item.product_name}</td>
                <td>{item.category}</td>
                <td>{item.quantity}</td>
                <td>{item.price}</td>
                <td>{item.supplier_name}</td>
                <td>{item.date_added}</td>
                <td>
                  <a href={`/read?id${item.item_id}`} className="btn btn-info">View</a>
                  <a href={`/edit?id${item.item_id}`} className="btn btn-warning">Edit</a>
                  <button className="btn btn-danger" onClick={() => deleteItem(item.item_id)}>Delete</button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
      <div className={styles.summary}>Total Items: {filterItems().length}</div>
    </div>
  );
}

export default Home;
