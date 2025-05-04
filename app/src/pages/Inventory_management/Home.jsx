import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

function Home() {
    const [items, setItems] = useState([]);

    // Fetch data from the API
    const fetchData = () => {
        axios.get('http://localhost:4000/hardware_inventory')
            .then((res) => setItems(res.data))
            .catch((err) => console.log("Error fetching inventory:", err));
    };

    useEffect(() => {
        fetchData();
    }, []); // Fetch data when the component mounts

    // Handle delete operation
    function handleDelete(id) {
        if (window.confirm("Are you sure you want to delete this item?")) {
            axios.delete(`http://localhost:4000/api/inventory/delete/${id}`)
                .then(() => fetchData()) // Refresh the inventory list after delete
                .catch((err) => console.log("Error deleting item:", err));
        }
    }

    return (
        <div className='container bg-light min-vh-100'>
            <h3 className="text-center my-4">Inventory Items</h3>
            <div className='d-flex justify-content-end mb-3'>
                <Link className='btn btn-success' to='/create'>Add Item</Link>
            </div>
            <table className='table table-bordered table-striped'>
                <thead className='table-dark'>
                    <tr>
                        <th>Item ID</th>
                        <th>Item Name</th>
                        <th>Category</th>
                        <th>Quantity</th>
                        <th>Price (LKR)</th>
                        <th>Supplier</th>
                        <th>Date Added</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {items.length > 0 ? (
                        items.map((item) => (
                            <tr key={item.item_id}>
                                <td>{item.item_id}</td>
                                <td>{item.product_name}</td>
                                <td>{item.category}</td>
                                <td>{item.quantity}</td>
                                <td>{item.price}</td>
                                <td>{item.supplier_name}</td> {/* Added supplier column */}
                                <td>{item.date_added}</td> {/* Added date_added column */}
                                <td>
                                    <Link className='btn btn-info mx-2' to={`/read/${item.item_id}`}>View</Link>
                                    <Link className='btn btn-warning mx-2' to={`/edit/${item.item_id}`}>Edit</Link>
                                    <button onClick={() => handleDelete(item.item_id)} className='btn btn-danger mx-2'>Delete</button> 
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="8" className="text-center">No items found.</td>
                        </tr>
                    )}
                </tbody>
            </table>
            <div className="text-center mt-3">
                <p><strong>Total Items:</strong> {items.length}</p>
            </div>
        </div>
    );
}

export default Home;