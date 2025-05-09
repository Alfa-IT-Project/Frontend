import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import styles from './pmCss.module.css'; // Importing the pmCss.module.css

function Read() {
  const [item, setItem] = useState(null);
  const [error, setError] = useState(null);
  const { id } = useParams();

  useEffect(() => {
    if (!id) {
      setError("Item ID is missing.");
      return;
    }

    axios
      .get(`http://localhost:4000/api/inventory/${id}`)
      .then((res) => {
        setItem(res.data);
        setError(null);
      })
      .catch((err) => {
        setError("Failed to fetch item details.");
        console.error("Error fetching item:", err);
      });
  }, [id]);

  return (
    <div className={styles.container}>
      <h2 className={styles.formTitle}>Item Details</h2>
      <Link to="/" className={styles.backBtn}>Back</Link>

      {error ? (
        <p className={styles.error}>{error}</p>
      ) : item ? (
        <ul className={styles.listGroup}>
          <li className={styles.listGroupItem}><span className={styles.label}>Item ID :</span> {item.item_id}</li>
          <li className={styles.listGroupItem}><span className={styles.label}>Name :</span> {item.product_name}</li>
          <li className={styles.listGroupItem}><span className={styles.label}>Category :</span> {item.category}</li>
          <li className={styles.listGroupItem}><span className={styles.label}>Quantity :</span> {item.quantity}</li>
          <li className={styles.listGroupItem}><span className={styles.label}>Price :</span> LKR {item.price}</li>
          <li className={styles.listGroupItem}><span className={styles.label}>Supplier Name :</span> {item.supplier_name}</li>
          <li className={styles.listGroupItem}><span className={styles.label}>Date Added :</span> {item.date_added}</li>
        </ul>
      ) : (
        <p>Loading item details...</p>
      )}
    </div>
  );
}

export default Read;
