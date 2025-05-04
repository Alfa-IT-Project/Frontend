import React, { useState } from 'react';
import styles from './supplier.module.css';
import apssaraLogo from './apssaraLogo.png';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function Supplier() {
  
  const [name, setName] = useState('');
  const [sid, setSid] = useState('');
  const [email, setEmail] = useState('');
  const [contact, setContact] = useState('');
  const [address, setAddress] = useState('');
  const [nic, setNic] = useState('');
  const [gender, setGender] = useState(''); // New state for gender
  const [remarks, setRemarks] = useState('');
  const [nameError, setNameError] = useState('');
  const [sidError, setSidError] = useState('');
  const [contactError, setContactError] = useState('');
  const [nicError, setNicError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [alertMessage, setAlertMessage] = useState('');
  const [alertType, setAlertType] = useState(''); // 'success' or 'error'
  const navigate = useNavigate();

  const handleNICChange = (e) => {
    const inputNic = e.target.value;
    setNic(inputNic);

    if (!/^\d{9}[Vv]$|^\d{12}$/.test(inputNic)) {
        setNicError('Invalid NIC. Use 9 digits followed by V/v or 12 digits.');
        setGender('');
    } else {
        setNicError('');

        // Detect gender
        let genderDigits = '';
        if (inputNic.length === 10) {
            genderDigits = inputNic.substring(2, 5);
        } else if (inputNic.length === 12) {
            genderDigits = inputNic.substring(4, 7);
        }

        if (genderDigits) {
            const genderNumber = parseInt(genderDigits, 10);
            setGender(genderNumber > 500 ? 'Female' : 'Male');
        } else {
            setGender('');
        }
    }
};

  //supplier name validatiuon
  const handleNameChange = (e) => {
    const inputName = e.target.value;
    if (/\d/.test(inputName)) {
      setNameError('Numbers are not allowed in the name field.');
    } else {
      setNameError('');
      
    }
    setName(inputName);
  };

  // Supplier ID validation
  const handleSIDChange = (e) => {
    const value = e.target.value;
    if (value.length > 6) {
      setSidError('Supplier ID must not exceed 6 characters.');
    }else if (value.length < 6){
      setSidError('Supplier ID must have 6 characters.');
    } 
    else {
      setSidError('');
    }
    setSid(value);
  };

  //contact number validation
  const handleContactChange = (e) => {
    const value = e.target.value;
  
    if (!/^\d*$/.test(value)) {
      setContactError('Only digits are allowed.');
    } else if (value.length > 10) {
      setContactError('Contact number cannot exceed 10 digits.');
    } else if (value.length < 10 && value.length > 0) {
      setContactError('Contact number must be exactly 10 digits.');
    } else {
      setContactError('');
    }
  
    setContact(value);
  };

  //email validation
  const handleEmailChange = (e) => {
    const inputEmail = e.target.value;
    setEmail(inputEmail);

    // Email validation pattern
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(inputEmail)) {
        setEmailError('Invalid email address. Please enter a valid email.');
    } else {
        setEmailError('');
    }
};

  const showAlert = (message, type) => {
    setAlertMessage(message);
    setAlertType(type);
    setTimeout(() => {
    setAlertMessage('');
    }, 3000); // Dismiss after 3 seconds
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name || !sid || !email || !contact || !address || !nic || !remarks) {
      showAlert('Please fill out all fields before submitting.', 'error');
      return;
    }

    if (nameError || sidError || contactError || nicError || emailError) {
      showAlert('Please fix all errors before submitting.', 'error');
      return;
    }

    try {
      const response = await axios.post('http://localhost:5000/supplier', {
        name,
        sid,
        email,
        contact,
        address,
        nic,
        gender, // Including gender in the post request
        remarks,
      });

      if (response.status === 200) {
        showAlert('Supplier registered successfully!', 'success');
        setTimeout(() => {
          navigate('/sview');
        }, 2000);
      }
    } catch (error) {
      showAlert('Error: ' + error.response.data, 'error');
    }
  };

  const handleClick = () => {
    navigate('/sview');
  };

  return (
    <div className={styles.contain}>
      <div className={styles.header}>
        <img src={apssaraLogo} alt="Company Logo" className={styles.logo} />
        
        <nav className={styles.navbar}>
          <button className={styles.navButton} onClick={() => navigate('/home')}>Home</button>
          <button className={styles.navButton}>Supplier</button>
          <button className={styles.navButton} onClick={() => navigate('/order')}>Order Product</button>
        </nav>
      </div>

      <div className={styles.content1}>

        <div className={styles.supplierContainer}>

        {alertMessage && (
         <div className={`${styles.alert} ${styles[alertType]}`}>
           {alertMessage}
         </div>
         )}

         <div className={styles.btn_back} onClick={handleClick}><button>back</button></div>
          <form className={styles.form} onSubmit={handleSubmit}>
            <div className={styles.headers}>
              <h2>Supplier Details</h2>
            </div>

            <div className={styles.formGrid}>
              <div className={styles.mb3}>
                <label><strong>Supplier Name</strong></label>
                <input
                  type="text"
                  placeholder='Enter name'
                  value={name}
                  onChange={handleNameChange}
                  style={{ border: nameError ? '2px solid red' : '' }} 
                />
                {nameError && <p className={styles.errorText}>{nameError}</p>}
              </div>

              <div className={styles.mb3}>
                <label><strong>Supplier ID</strong></label>
                <input
                  type="text"
                  placeholder='Enter ID'
                  value={sid}
                  onChange={handleSIDChange}
                  style={{ border: sidError ? '2px solid red' : '' }} 
                />
                {sidError && <p className={styles.errorText}>{sidError}</p>}
              </div>

              <div className={styles.mb3}>
                <label><strong>Email</strong></label>
                <input
                  type="email"
                  placeholder='Enter Email'
                  value={email}
                  onChange={handleEmailChange}
                  style={{ border: emailError ? '2px solid red' : '' }} 
                />
                 {emailError && <p className={styles.errorText}>{emailError}</p>}
              </div>

              <div className={styles.mb3}>
                <label><strong>Contact Number</strong></label>
                <input
                  type="tel"
                  placeholder='Enter phone number'
                  value={contact}
                  onChange={handleContactChange}
                  style={{ border: contactError ? '2px solid red' : '' }}
                />
                 {contactError && <p className={styles.errorText}>{contactError}</p>}
              </div>

              <div className={styles.mb3}>
                <label><strong>Address</strong></label>
                <input
                  type="text"
                  placeholder='Enter Address'
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                />
              </div>

              <div className={styles.mb3}>
               <label><strong>NIC number</strong></label>
               <input
                 type="text"
                 placeholder='Enter NIC'
                 value={nic}
                 onChange={handleNICChange}
                style={{ border: nicError ? '2px solid red' : '' }} 
               />
                {nicError && <p className={styles.errorText}>{nicError}</p>}
              </div>

              <div className={styles.mb3}>
                <label><strong>Gender</strong></label>
                <input
                  type="text"
                  value={gender}
                  readOnly
                  placeholder="Gender will be detected automatically"
                />
              </div>

              <div className={styles.mb3}>
                <label><strong>Remarks</strong></label>
                <input
                  type="text"
                  placeholder='Enter Remarks'
                  value={remarks}
                  onChange={(e) => setRemarks(e.target.value)}
                />
              </div>
            </div>

            <button type="submit" className={styles.btn}>Add Supplier</button>
          </form>
        </div>

      </div>

    </div>

  );
}

export default Supplier;
