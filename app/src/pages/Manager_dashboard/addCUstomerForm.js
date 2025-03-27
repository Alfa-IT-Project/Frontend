import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './styles.module.css';
import './addCustomerStyle.css';

const API_URL = 'http://localhost:4000';

function AddCustomer() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    email: '',
    name: '',
    phone: '',
    order_date: '',
    notes: ''
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const fetchCustomers = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(`${API_URL}/customers`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        console.log('Customers:', response.data);
      } catch (error) {
        console.error('Error fetching customers:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCustomers();
  }, []);

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
    if (!formData.order_date) {
      newErrors.order_date = "Order date is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const onFinish = async (values) => {
    if (!validate()) return;

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

  const handleSubmit = (event) => {
    event.preventDefault();
    onFinish(formData);
  };

  return (
    <div className={styles.contain}>
      {/* Topmost Section: Navbar within Image Container */}
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

              <label>Notes</label>
              <textarea 
                name="notes" 
                rows="3" 
                value={formData.notes} 
                onChange={handleChange}
              />

              <button class="button button1" type="submit" disabled={loading}>
                {loading ? "Submitting..." : "Add Customer"}
              </button>
              <button class="button button2" type="submit" disabled={loading}>
                {loading ? "Submitting..." : "Cancel Adding"}
              </button>
            </div>
          </div>
        </form>

      </div>
    </div>
  );
}

export default AddCustomer;
