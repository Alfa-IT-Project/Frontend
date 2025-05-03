import React, { useState, useEffect } from "react"; 
import { Link, useParams, useNavigate } from "react-router-dom"; 
import axios from "axios";

function Edit() { 
  const [item, setItem] = useState({
    product_name: "",
    category: "",
    quantity: "",
    price: "",
    supplier_name: "", // New field for supplier
    date_added: "" // New field for date
  });

  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    if (!id) {
      console.error("Item ID is missing!");
      return;
    }
    axios
      .get(`http://localhost:5000/api/inventory/${id}`)
      .then((res) => setItem(res.data))
      .catch((err) => console.log("Error fetching item:", err));
  }, [id]);

  function handleChange(e) {
    setItem({ ...item, [e.target.name]: e.target.value });
  }

  function handleSubmit(e) {
    e.preventDefault();

    // Validate the input data
    if (parseInt(item.quantity) <= 0 || isNaN(item.quantity)) {
      alert("Quantity must be a positive integer.");
      return;
    }

    if (parseFloat(item.price) <= 0 || isNaN(item.price)) {
      alert("Price must be a positive number.");
      return;
    }

    // Validate the supplier_name and date_added
    if (!item.supplier_name) {
      alert("Supplier name is required.");
      return;
    }

    if (!item.date_added) {
      alert("Date added is required.");
      return;
    }

    axios
      .put(`http://localhost:5000/api/inventory/update/${id}`, item)
      .then(() => {
        console.log("Item updated successfully");
        navigate("/");  // Redirect to home (after saving)
      })
      .catch((err) => console.log("Error updating item:", err));
  }

  return (
    <div className="container bg-light min-vh-100">
      <h2 className="text-center my-4">Edit Inventory Item</h2>
      <Link to="/" className="btn btn-secondary mb-3">Back</Link>
      
      <form onSubmit={handleSubmit} className="border p-4 rounded bg-white">
        <div className="form-group my-3">
          <label htmlFor="product_name">Item Name</label>
          <input
            type="text"
            name="product_name"
            className="form-control"
            value={item.product_name}
            required
            onChange={handleChange}
          />
        </div>
        <div className="form-group my-3">
          <label htmlFor="category">Category</label>
          <input
            type="text"
            name="category"
            className="form-control"
            value={item.category}
            required
            onChange={handleChange}
          />
        </div>
        <div className="form-group my-3">
          <label htmlFor="quantity">Quantity</label>
          <input
            type="number"
            name="quantity"
            className="form-control"
            value={item.quantity}
            required
            onChange={handleChange}
          />
        </div>
        <div className="form-group my-3">
          <label htmlFor="price">Price (LKR)</label>
          <input
            type="number"
            name="price"
            className="form-control"
            value={item.price}
            required
            onChange={handleChange}
          />
        </div>
        <div className="form-group my-3">
          <label htmlFor="supplier_name">Supplier Name</label>
          <input
            type="text"
            name="supplier_name"
            className="form-control"
            value={item.supplier_name}
            required
            onChange={handleChange}
          />
        </div>
        <div className="form-group my-3">
          <label htmlFor="date_added">Date Added</label>
          <input
            type="date"
            name="date_added"
            className="form-control"
            value={item.date_added}
            required
            onChange={handleChange}
          />
        </div>
        <button type="submit" className="btn btn-success">Save Changes</button>
      </form>
    </div>
  );
}

export default Edit;
