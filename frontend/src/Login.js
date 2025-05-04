import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './Login.module.css';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [errorMessage, setErrorMessage] = useState(''); // State for styled alert
  const navigate = useNavigate();

  const hardcodedEmail = 'admin@example.com';
  const hardcodedPassword = 'admin123';

  const validateField = (name, value) => {
    let error = '';

    if (name === 'email') {
      if (!value) {
        error = 'Email is required';
      } else if (!/\S+@\S+\.\S+/.test(value)) {
        error = 'Email address is invalid';
      }
    }

    if (name === 'password') {
      if (!value) {
        error = 'Password is required';
      } else if (value.length < 6) {
        error = 'Password must be at least 6 characters long';
      }
    }

    setErrors((prevErrors) => ({ ...prevErrors, [name]: error }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'email') setEmail(value);
    if (name === 'password') setPassword(value);

    validateField(name, value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    validateField('email', email);
    validateField('password', password);

    if (!errors.email && !errors.password && email && password) {
      if (email === hardcodedEmail && password === hardcodedPassword) {
        navigate('/home');
      } else {
        setErrorMessage('Invalid credentials. Please try again.'); // Set error message

        // Hide the error message after 3 seconds
        setTimeout(() => {
          setErrorMessage('');
        }, 3000);
      }
    }
  };

  return (
    <div className={styles.loginContainer}>
      <form className={styles.form} onSubmit={handleSubmit}>
        <div className={styles.header}>
          <h2>Product Manager</h2>
        </div>

        {errorMessage && (
          <div className={styles.alert}>
            {errorMessage}
          </div>
        )}

        <div className={styles.mb3}>
          <label><strong>Email</strong></label>
          <input
            type="email"
            name="email"
            placeholder="Enter Email"
            value={email}
            onChange={handleChange}
            style={{ border: errors.email ? '2px solid red' : '1px solid #ccc' }}
          />
          {errors.email && <p className={styles.error}>{errors.email}</p>}
        </div>

        <div className={styles.mb3}>
          <label><strong>Password</strong></label>
          <input
            type="password"
            name="password"
            placeholder="Enter Password"
            value={password}
            onChange={handleChange}
            style={{ border: errors.password ? '2px solid red' : '1px solid #ccc' }}
          />
          {errors.password && <p className={styles.error}>{errors.password}</p>}
        </div>

        <button type="submit" className={styles.btn}>Log in</button>
      </form>
    </div>
  );
}

export default Login;
