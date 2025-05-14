import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import styles from './styles/pmCSS.module.css';

const Create = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    product_name: '',
    category: '',
    quantity: '',
    price: '',
    supplier_name: '',
    date_added: '',
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validate()) {
      try {
        setLoading(true);
        setError(null);
        
        const response = await axios.post('http://localhost:4000/add_item', formData);
        
        if (response.data) {
          alert('Product saved successfully!');
          navigate('/home'); // Navigate back to home page after successful creation
        }
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to create product');
        alert('Failed to create product. Please try again.');
      } finally {
        setLoading(false);
      }
    }
  };

  if (error) {
    return <div className={styles.createError}>{error}</div>;
  }

  return (
    <div className={styles.createMainContainer}>
      <div className={styles.createFormCard}>
        <h3 className={styles.createFormTitle}>Add Product</h3>
        <div className={styles.createHomeButton}>
          <a href="/" className={styles.createButtonSuccess}>Home</a>
        </div>
        <form onSubmit={handleSubmit}>
          <div className={styles.createFormGroup}>
            <label className={styles.createFormLabel}>Product Name</label>
            <input
              type="text"
              name="product_name"
              className={styles.createFormControl}
              value={formData.product_name}
              onChange={handleChange}
            />
            {errors.product_name && <small className={styles.createTextDanger}>{errors.product_name}</small>}
          </div>

          <div className={styles.createFormGroup}>
            <label className={styles.createFormLabel}>Category</label>
            <div className={styles.createSelectWrapper}>
              <select
                name="category"
                className={styles.createFormControl}
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
            {errors.category && <small className={styles.createTextDanger}>{errors.category}</small>}
          </div>

          <div className={styles.createFormGroup}>
            <label className={styles.createFormLabel}>Quantity</label>
            <input
              type="number"
              name="quantity"
              className={styles.createFormControl}
              value={formData.quantity}
              onChange={handleChange}
            />
            {errors.quantity && <small className={styles.createTextDanger}>{errors.quantity}</small>}
          </div>

          <div className={styles.createFormGroup}>
            <label className={styles.createFormLabel}>Price</label>
            <input
              type="number"
              name="price"
              step="0.01"
              className={styles.createFormControl}
              value={formData.price}
              onChange={handleChange}
            />
            {errors.price && <small className={styles.createTextDanger}>{errors.price}</small>}
          </div>

          <div className={styles.createFormGroup}>
            <label className={styles.createFormLabel}>Supplier Name</label>
            <input
              type="text"
              name="supplier_name"
              className={styles.createFormControl}
              value={formData.supplier_name}
              onChange={handleChange}
            />
            {errors.supplier_name && <small className={styles.createTextDanger}>{errors.supplier_name}</small>}
          </div>

          <div className={styles.createFormGroup}>
            <label className={styles.createFormLabel}>Date</label>
            <input
              type="date"
              name="date_added"
              className={styles.createFormControl}
              value={formData.date_added}
              onChange={handleChange}
            />
            {errors.date_added && <small className={styles.createTextDanger}>{errors.date_added}</small>}
          </div>

          <div className={styles.createFormGroup}>
            <button 
              type="submit" 
              className={`${styles.createButtonSuccess} ${styles.createFullWidth}`}
              disabled={loading}
            >
              {loading ? 'Saving...' : 'Save'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Create;