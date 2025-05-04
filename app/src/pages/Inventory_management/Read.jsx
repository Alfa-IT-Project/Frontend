import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";

function Read() {
  const [item, setItem] = useState(null);
  const [error, setError] = useState(null);
  const { id } = useParams();

  useEffect(() => {
    // Check if 'id' exists before making the API call
    if (!id) {
      setError("Item ID is missing.");
      return;
    }

    axios.get(`http://localhost:4000/api/inventory/${id}`)
      .then((res) => {
        setItem(res.data);
        setError(null); // Clear any previous errors
      })
      .catch((err) => {
        setError("Failed to fetch item details.");
        console.error("Error fetching item:", err);
      });
  }, [id]);

  return (
    <div className="container bg-light min-vh-100 p-4">
      <h2 className="text-center my-4">Item Details</h2>
      <Link to="/product-manager-dashboard" className="btn btn-secondary mb-3">Back</Link>

      {error ? (
        <p className="text-danger">{error}</p>
      ) : item ? (
        <ul className="list-group">
          <li className="list-group-item"><b>Item ID:</b> {item.item_id}</li>
          <li className="list-group-item"><b>Name:</b> {item.product_name}</li>
          <li className="list-group-item"><b>Category:</b> {item.category}</li>
          <li className="list-group-item"><b>Quantity:</b> {item.quantity}</li>
          <li className="list-group-item"><b>Price (LKR):</b> {item.price}</li>
          <li className="list-group-item"><b>Supplier Name:</b> {item.supplier_name}</li> {/* New field */}
          <li className="list-group-item"><b>Date Added:</b> {item.date_added}</li> {/* New field */}
        </ul>
      ) : (
        <p>Loading item details...</p>
      )}
    </div>
  );
}

export default Read;