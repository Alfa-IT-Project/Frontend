import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import styles from "./styles/pmCSS.module.css";

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
    <div className={styles.readContainer}>
      <h2 className={styles.readTitle}>Item Details</h2>
      <Link to="/home" className={styles.readBackButton}>Back</Link>

      {error ? (
        <p className={styles.readError}>{error}</p>
      ) : item ? (
        <ul className={styles.readListGroup}>
          <li className={styles.readListItem}><span className={styles.readLabel}>Item ID :</span> {item.item_id}</li>
          <li className={styles.readListItem}><span className={styles.readLabel}>Name :</span> {item.product_name}</li>
          <li className={styles.readListItem}><span className={styles.readLabel}>Category :</span> {item.category}</li>
          <li className={styles.readListItem}><span className={styles.readLabel}>Quantity :</span> {item.quantity}</li>
          <li className={styles.readListItem}><span className={styles.readLabel}>Price :</span> LKR {item.price}</li>
          <li className={styles.readListItem}><span className={styles.readLabel}>Supplier Name :</span> {item.supplier_name}</li>
          <li className={styles.readListItem}><span className={styles.readLabel}>Date Added :</span> {item.date_added}</li>
        </ul>
      ) : (
        <p>Loading item details...</p>
      )}
    </div>
  );
}

export default Read;