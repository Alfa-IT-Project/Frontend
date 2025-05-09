import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import styles from './pmCss.module.css';

const Edit = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    product_name: '',
    category: '',
    quantity: '',
    price: '',
    supplier_name: '',
    date_added: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const { quantity, price } = formData;

    if (parseInt(quantity) <= 0 || isNaN(quantity)) {
      alert("Quantity must be a positive integer.");
      return;
    }

    if (parseFloat(price) <= 0 || isNaN(price)) {
      alert("Price must be a positive number.");
      return;
    }

    console.log('Updated Item:', formData);
    alert('Item updated successfully!');
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.formTitle}>Edit Inventory Item</h2>

      <div className={styles.homeButton}>
        <button className={styles.btnSuccess} onClick={() => navigate('/product-manager-dashboard')}>Home</button>
      </div>

      <form onSubmit={handleSubmit}>
        <div className={styles.formGroup}>
          <label>Product Name</label>
          <input
            type="text"
            name="product_name"
            value={formData.product_name}
            onChange={handleChange}
            className={styles.formControl}
            required
          />
        </div>

        <div className={styles.formGroup}>
          <label>Category</label>
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            className={styles.formControl}
            required
          >
            <option value="">Select a category</option>
            <option value="Tools">Tools</option>
            <option value="Paints">Paints</option>
            <option value="Electrical">Electrical</option>
            <option value="Plumbing">Plumbing</option>
            <option value="Building Materials">Building Materials</option>
            <option value="Other">Other</option>
          </select>
        </div>

        <div className={styles.formGroup}>
          <label>Quantity</label>
          <input
            type="number"
            name="quantity"
            value={formData.quantity}
            onChange={handleChange}
            className={styles.formControl}
            required
          />
        </div>

        <div className={styles.formGroup}>
          <label>Price</label>
          <input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleChange}
            className={styles.formControl}
            required
          />
        </div>

        <div className={styles.formGroup}>
          <label>Supplier Name</label>
          <input
            type="text"
            name="supplier_name"
            value={formData.supplier_name}
            onChange={handleChange}
            className={styles.formControl}
            required
          />
        </div>

        <div className={styles.formGroup}>
          <label>Date</label>
          <input
            type="date"
            name="date_added"
            value={formData.date_added}
            onChange={handleChange}
            className={styles.formControl}
            required
          />
        </div>

        <button type="submit" className={`${styles.btnSuccess} ${styles.fullWidth}`}>Save</button>
      </form>
    </div>
  );
};

export default Edit;
