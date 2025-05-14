import axios from 'axios';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './styles.module.css';
import './addCustomerStyle.css';

const API_URL = 'http://localhost:4000';

function AddCustomer() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: '',
    password: '',
    email: '',
    name: '',
    phone: '',
    address: ''
  });
  const [errors, setErrors] = useState({});

  const handleClick1 = () => {
    navigate('/manager-dashboard');
  };

  const handleClick2 = () => {
    navigate('/purchases');
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value
    }));
  };

  const validate = () => {
    const newErrors = {};
    const phonePattern = /^[0-9]{10}$/;
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    if (!formData.username) {
      newErrors.username = "Username is required";
    }
    if (!formData.password || formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }
    if (!formData.email || !emailPattern.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }
    if (!formData.name) {
      newErrors.name = "Name is required";
    }
    if (!formData.phone || !phonePattern.test(formData.phone)) {
      newErrors.phone = "Phone number must be exactly 10 digits";
    }
   

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (validate()) {
      await onFinish(formData);
    }
  };

  const onFinish = async (values) => {
    
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(`${API_URL}/customers/addCustomer`, values, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      console.log('Customer added:', response.data);
      navigate('/manager-dashboard');
    } catch (error) {
      console.error('Error adding customer:', error);
      alert("There was an error adding the customer.");
    } 
  };

  const handleCancel = () => {
    navigate('/manager-dashboard');
  };

  return (
    <div className={styles.contain}>
      <div className={styles.header}>
        <nav className={styles.navbar}>
          <button className={styles.navButton} onClick={handleClick1}>Home</button>
          <button className={styles.navButton}>Customers</button>
          <button className={styles.navButton} onClick={handleClick2}>Purchases</button>
        </nav>
      </div>

      <div>
        <h2>Add Customer</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-column">
              <label>Username</label>
              <input 
                type="text" 
                name="username" 
                required 
                value={formData.username} 
                onChange={handleChange} 
              />
              {errors.username && <div className="error">{errors.username}</div>}

              <label>Password</label>
              <input 
                type="password" 
                name="password" 
                required 
                minLength="6" 
                value={formData.password} 
                onChange={handleChange} 
              />
              {errors.password && <div className="error">{errors.password}</div>}

              <label>Email</label>
              <input 
                type="email" 
                name="email" 
                required 
                value={formData.email} 
                onChange={handleChange} 
              />
              {errors.email && <div className="error">{errors.email}</div>}

              <label>Phone</label>
              <input 
                type="text" 
                name="phone" 
                pattern="[0-9]{10}" 
                required 
                value={formData.phone} 
                onChange={handleChange} 
              />
              {errors.phone && <div className="error">{errors.phone}</div>}
            </div>

            <div className="form-column">
              <label>Name</label>
              <input 
                type="text" 
                name="name" 
                required 
                value={formData.name} 
                onChange={handleChange} 
              />
              {errors.name && <div className="error">{errors.name}</div>}

              <label>Adsress</label>
              <textarea 
                name="address" 
                rows="3" 
                value={formData.address} 
                onChange={handleChange}
              />

              <button 
                className="button button1" 
                type="submit" 
                
              >
                Add Customer
              </button>
              <button 
                type="button" 
                className="button button2" 
                onClick={handleCancel}
               
              >
                Cancel
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddCustomer;