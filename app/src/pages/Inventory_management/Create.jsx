import React, { useState } from 'react';
import styles from './pmCss.module.css'; // Import the updated CSS module

const Create = () => {
  const [formData, setFormData] = useState({
    product_name: '',
    category: '',
    quantity: '',
    price: '',
    supplier_name: '',
    date_added: '',
  });

  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};

    if (!formData.product_name.trim()) {
      newErrors.product_name = 'Product Name is required';
    }

    if (!formData.category) {
      newErrors.category = 'Please select a category';
    }

    if (!formData.quantity || isNaN(formData.quantity) || parseInt(formData.quantity) <= 0) {
      newErrors.quantity = 'Quantity must be a positive integer';
    }

    if (!formData.price || isNaN(formData.price) || parseFloat(formData.price) <= 0) {
      newErrors.price = 'Price must be a positive number';
    }

    if (!formData.supplier_name.trim()) {
      newErrors.supplier_name = 'Supplier Name is required';
    }

    if (!/^\d{4}-\d{2}-\d{2}$/.test(formData.date_added)) {
      newErrors.date_added = 'Date must be in YYYY-MM-DD format';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      alert('Product saved successfully!');
      console.log(formData);
      // Submit to backend or reset form here
    }
  };

  return (
    <div className={styles.mainContainer}>
      <div className={styles.formCard}>
        <h3 className={styles.formTitle}>Add Product</h3>
        <div className={styles.homeButton}>
          <a href="/" className={styles.btnSuccess}>Home</a>
        </div>
        <form onSubmit={handleSubmit}>
          <div className={styles.formGroup}>
            <label>Product Name</label>
            <input
              type="text"
              name="product_name"
              className={styles.formControl}
              value={formData.product_name}
              onChange={handleChange}
            />
            {errors.product_name && <small className={styles.textDanger}>{errors.product_name}</small>}
          </div>

          <div className={styles.formGroup}>
            <label>Category</label>
            <div className={styles.customSelectWrapper}>
              <select
                name="category"
                className={styles.formControl}
                value={formData.category}
                onChange={handleChange}
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
            {errors.category && <small className={styles.textDanger}>{errors.category}</small>}
          </div>

          <div className={styles.formGroup}>
            <label>Quantity</label>
            <input
              type="number"
              name="quantity"
              className={styles.formControl}
              value={formData.quantity}
              onChange={handleChange}
            />
            {errors.quantity && <small className={styles.textDanger}>{errors.quantity}</small>}
          </div>

          <div className={styles.formGroup}>
            <label>Price</label>
            <input
              type="number"
              name="price"
              step="0.01"
              className={styles.formControl}
              value={formData.price}
              onChange={handleChange}
            />
            {errors.price && <small className={styles.textDanger}>{errors.price}</small>}
          </div>

          <div className={styles.formGroup}>
            <label>Supplier Name</label>
            <input
              type="text"
              name="supplier_name"
              className={styles.formControl}
              value={formData.supplier_name}
              onChange={handleChange}
            />
            {errors.supplier_name && <small className={styles.textDanger}>{errors.supplier_name}</small>}
          </div>

          <div className={styles.formGroup}>
            <label>Date</label>
            <input
              type="date"
              name="date_added"
              className={styles.formControl}
              value={formData.date_added}
              onChange={handleChange}
            />
            {errors.date_added && <small className={styles.textDanger}>{errors.date_added}</small>}
          </div>

          <div className={styles.formGroup}>
            <button type="submit" className={`${styles.btnSuccess} ${styles.fullWidth}`}>Save</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Create;
