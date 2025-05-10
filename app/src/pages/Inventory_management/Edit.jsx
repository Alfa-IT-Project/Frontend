import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import styles from './styles/pmCSS.module.css';

const Edit = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    product_name: '',
    category: '',
    quantity: '',
    price: '',
    supplier_name: '',
    date_added: '',
  });

  useEffect(() => {
    // Fetch item data when component mounts
    if (id) {
      axios.get(`http://localhost:4000/api/inventory/${id}`)
        .then(response => {
          setFormData(response.data);
          setLoading(false);
        })
        .catch(err => {
          setError('Failed to fetch item details');
          setLoading(false);
          console.error('Error fetching item:', err);
        });
    }
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
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

    try {
      setLoading(true);
      const response = await axios.put(`http://localhost:4000/api/inventory/update/${id}`, formData);
      alert('Item updated successfully!');
      navigate('/home'); // Navigate back to home page after successful update
    } catch (err) {
      setError('Failed to update item');
      console.error('Error updating item:', err);
      alert('Failed to update item. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className={styles.editContainer}>Loading...</div>;
  }

  if (error) {
    return <div className={styles.editContainer}>{error}</div>;
  }

  
  return (
    <div className={styles.editContainer}>
      <h2 className={styles.editTitle}>Edit Inventory Item</h2>

      <div className={styles.editHomeButtonWrapper}>
        <button className={styles.editButton} onClick={() => navigate('/home')}>Home</button>
      </div>

      <form onSubmit={handleSubmit}>
        <div className={styles.editFormGroup}>
          <label className={styles.editFormLabel}>Product Name</label>
          <input type="text" name="product_name" value={formData.product_name} onChange={handleChange} className={styles.editFormControl} required />
        </div>

        <div className={styles.editFormGroup}>
          <label className={styles.editFormLabel}>Category</label>
          <select name="category" value={formData.category} onChange={handleChange} className={styles.editFormControl} required>
            <option value="">Select a category</option>
            <option value="Tools">Tools</option>
            <option value="Paints">Paints</option>
            <option value="Electrical">Electrical</option>
            <option value="Plumbing">Plumbing</option>
            <option value="Building Materials">Building Materials</option>
            <option value="Other">Other</option>
          </select>
        </div>

        <div className={styles.editFormGroup}>
          <label className={styles.editFormLabel}>Quantity</label>
          <input type="number" name="quantity" value={formData.quantity} onChange={handleChange} className={styles.editFormControl} required />
        </div>

        <div className={styles.editFormGroup}>
          <label className={styles.editFormLabel}>Price</label>
          <input type="number" name="price" value={formData.price} onChange={handleChange} className={styles.editFormControl} required />
        </div>

        <div className={styles.editFormGroup}>
          <label className={styles.editFormLabel}>Supplier Name</label>
          <input type="text" name="supplier_name" value={formData.supplier_name} onChange={handleChange} className={styles.editFormControl} required />
        </div>

        <div className={styles.editFormGroup}>
          <label className={styles.editFormLabel}>Date</label>
          <input type="date" name="date_added" value={formData.date_added} onChange={handleChange} className={styles.editFormControl} required />
        </div>

        <button type="submit" className={styles.editSubmitButton} disabled={loading}>
          {loading ? 'Updating...' : 'Save'}
        </button>
      </form>
    </div>
  );
};

export default Edit;