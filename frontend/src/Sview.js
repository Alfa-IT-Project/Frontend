import React, { useEffect, useState } from 'react';
import styles from './sview.module.css';
import apssaraLogo from './apssaraLogo.png';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function Sview() {
  const [suppliers, setSuppliers] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSuppliers = async () => {
      try {
        const response = await axios.get('http://localhost:5000/suppliers');
        setSuppliers(response.data);
      } catch (error) {
        console.error('Error fetching suppliers:', error);
      }
    };

    fetchSuppliers();
  }, []);

  const handleAddSupplier = () => {
    navigate('/supplier');
  };

  const handleEdit = (supplier) => {
    navigate('/sedit', { state: { supplier } });
  };
  

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/supplier/${id}`);
      setSuppliers(suppliers.filter(supplier => supplier.id !== id));
    } catch (error) {
      console.error('Error deleting supplier:', error);
    }
  };

  const handleClick = () => {
    navigate('/supplier');
  };
  const handleClick2 = () => {
    navigate('/sedit');
  };

  return (
    <div className={styles.contain}>
      {/* Topmost Section: Navbar within Image Container */}
      <div className={styles.header}>
        <img src={apssaraLogo} alt="Company Logo" className={styles.logo} />
        <nav className={styles.navbar}>
          <button className={styles.navButton} onClick={() => navigate('/home')}>Home</button>
          <button className={styles.navButton} onClick={() => navigate('/sview')}>Supplier</button>
          
          <button className={styles.navButton} onClick={() => navigate('/order')}>Order Product</button>
        </nav>
      </div>

      {/* Supplier Details Table */}
      <div className={styles.content}>
        <div className={styles.supplierSection}>
          <h2>Supplier Details</h2>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Name</th>
                <th>SID</th>
                <th>Email</th>
                <th>Contact</th>
                <th>Address</th>
                <th>NIC</th>
                <th>Gender</th>
                <th>Remarks</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {suppliers.map(supplier => (
                <tr key={supplier.id}>
                  <td>{supplier.name}</td>
                  <td>{supplier.sid}</td>
                  <td>{supplier.email}</td>
                  <td>{supplier.contact}</td>
                  <td>{supplier.address}</td>
                  <td>{supplier.nic}</td>
                  <td>{supplier.gender}</td>
                  <td>{supplier.remarks}</td>
                  <td>
                    <div className={styles.buttonContainer}>
                    <button className={styles.tableButton} onClick={() => handleEdit(supplier)}>Edit</button>
                    <button className={styles.tableButton} onClick={() => handleDelete(supplier.id)}>Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className={styles.btn_supplierContainer}>
            <button className={styles.btn_supplier} onClick={handleClick}> Add Suppliers</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Sview;
