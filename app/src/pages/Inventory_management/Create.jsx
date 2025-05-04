import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

function Create() {
    const [values, setValues] = useState({
        product_name: '',
        category: '',
        quantity: '',
        price: '',
        supplier_name: '',
        date_added: ''
    });

    const [errors, setErrors] = useState({
        quantity: '',
        price: '',
        date_added: ''
    });

    const navigate = useNavigate();

    // Handle input field changes
    function handleChange(e) {
        setValues(prev => ({ ...prev, [e.target.name]: e.target.value }));
    }

    // Validate date format (YYYY-MM-DD)
    function isValidDateFormat(dateString) {
        return /^\d{4}-\d{2}-\d{2}$/.test(dateString);
    }

    // Form validation logic
    function validateForm() {
        const newErrors = {
            quantity: '',
            price: '',
            date_added: ''
        };

        if (parseInt(values.quantity) <= 0 || isNaN(values.quantity)) {
            newErrors.quantity = "Quantity must be a positive integer.";
        }

        if (parseFloat(values.price) <= 0 || isNaN(values.price)) {
            newErrors.price = "Price must be a positive number.";
        }

        if (!isValidDateFormat(values.date_added)) {
            newErrors.date_added = "Date must be in YYYY-MM-DD format.";
        }

        setErrors(newErrors);

        return !newErrors.quantity && !newErrors.price && !newErrors.date_added;
    }

    // Handle form submission
    function handleSubmit(e) {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        // Round the price to 2 decimal places
        const roundedPrice = parseFloat(values.price).toFixed(2);

        const updatedValues = {
            ...values,
            price: roundedPrice
        };

        // Send data to the backend API
        axios.post("http://localhost:4000/add_item", updatedValues)
            .then((res) => {
                console.log("Item added successfully:", res.data);
                setValues({
                    product_name: '',
                    category: '',
                    quantity: '',
                    price: '',
                    supplier_name: '',
                    date_added: ''
                });
                navigate('/product-manager-dashboard');
            })
            .catch((err) => {
                console.error("Error adding item:", err);
            });
    }

    return (
        <div className="vh-100 vw-100 bg-primary d-flex align-items-center justify-content-center">
            <div className="container bg-light p-4 rounded shadow">
                <h3 className="text-center">Add Product</h3>
                <div className="d-flex justify-content-end mb-3">
                    <Link to="/product-manager-dashboard" className="btn btn-success">Home</Link>
                </div>
                <form onSubmit={handleSubmit}>
                    <div className="form-group my-3">
                        <label htmlFor="product_name">Product Name</label>
                        <input 
                            type="text" 
                            name="product_name" 
                            value={values.product_name} 
                            required 
                            onChange={handleChange} 
                            className="form-control" 
                        />
                    </div>
                    <div className="form-group my-3">
                        <label htmlFor="category">Category</label>
                        <input 
                            type="text" 
                            name="category" 
                            value={values.category} 
                            required 
                            onChange={handleChange} 
                            className="form-control" 
                        />
                    </div>
                    <div className="form-group my-3">
                        <label htmlFor="quantity">Quantity</label>
                        <input 
                            type="number" 
                            name="quantity" 
                            value={values.quantity} 
                            required 
                            onChange={handleChange} 
                            className="form-control" 
                        />
                        {errors.quantity && <small className="text-danger">{errors.quantity}</small>}
                    </div>
                    <div className="form-group my-3">
                        <label htmlFor="price">Price</label>
                        <input 
                            type="number" 
                            step="0.01" 
                            name="price" 
                            value={values.price} 
                            required 
                            onChange={handleChange} 
                            className="form-control" 
                        />
                        {errors.price && <small className="text-danger">{errors.price}</small>}
                    </div>
                    <div className="form-group my-3">
                        <label htmlFor="supplier_name">Supplier Name</label>
                        <input 
                            type="text" 
                            name="supplier_name" 
                            value={values.supplier_name} 
                            required 
                            onChange={handleChange} 
                            className="form-control" 
                        />
                    </div>
                    <div className="form-group my-3">
                        <label htmlFor="date_added">Date (YYYY-MM-DD)</label>
                        <input 
                            type="text" 
                            name="date_added" 
                            value={values.date_added} 
                            required 
                            onChange={handleChange} 
                            className="form-control" 
                            placeholder="e.g. 2025-04-04"
                        />
                        {errors.date_added && <small className="text-danger">{errors.date_added}</small>}
                    </div>
                    <div className="form-group my-3">
                        <button type="submit" className="btn btn-success w-100">Save</button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default Create;