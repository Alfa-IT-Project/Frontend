import React, { useEffect, useState } from 'react';
import styles from './styles.module.css';
import axios from 'axios';
import Navbar from '../../../components/CRM/manager/NavBarAdmin.js'; // Updated Navbar import path

const API_URL = 'http://localhost:4000';

function PurchaseList() {
    const [purchases, setPurchases] = useState([]);
    const [expandedRows, setExpandedRows] = useState(new Set());  // Track expanded rows
    

    // Fetch purchases data on component mount
    useEffect(() => {
        const fetchPurchases = async () => {
            try {
                const token = localStorage.getItem("token");
                const response = await axios.get(`${API_URL}/purchases/getAllPurchases`, {
                    headers: {
                        Authorization: `Bearer ${token}` // Include token in request
                    }
                });
                console.log('Purchases:', response.data);
                setPurchases(response.data);
            } catch (error) {
                console.error('Error fetching purchases:', error);
            }
        };

        fetchPurchases();
    }, []);

 
    // Toggle expanded row for item details
    const toggleRow = (purchaseId) => {
        setExpandedRows((prev) => {
            const newExpandedRows = new Set(prev);
            if (newExpandedRows.has(purchaseId)) {
                newExpandedRows.delete(purchaseId);
            } else {
                newExpandedRows.add(purchaseId);
            }
            return newExpandedRows;
        });
    };

    return (
        <div className={styles.contain}>
        <Navbar/>

            {/* Purchases List Section */}
            <div className={styles.content}>
                <div className={styles.customerSection}>
                    <h2>Customer Purchases</h2>
                    <table className={styles.customerTable}>
                        <thead>
                            <tr>
                                <th>Purchase ID</th>
                                <th>User ID</th>
                                <th>Total Amount</th>
                                <th>Shipping Fee</th>
                                <th>Grand Total</th>
                                <th>Order Date</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {purchases.map((purchase) => (
                                <React.Fragment key={purchase.purchase_id}>
                                    <tr>
                                        <td>{purchase.purchase_id}</td>
                                        <td>{purchase.user_id}</td>
                                        <td>{purchase.total_amount}</td>
                                        <td>{purchase.shipping_fee}</td>
                                        <td>{purchase.grand_total}</td>
                                        <td>{new Date(purchase.order_date).toLocaleDateString()}</td>
                                        <td>
                                            <button onClick={() => toggleRow(purchase.purchase_id)}>
                                                {expandedRows.has(purchase.purchase_id) ? 'Hide Items' : 'Show Items'}
                                            </button>
                                        </td>
                                    </tr>

                                    {/* Expanded Row for Item Details */}
                                    {expandedRows.has(purchase.purchase_id) && (
                                        <tr>
                                            <td colSpan="7">
                                                <table className={styles.itemDetails}>
                                                    <thead>
                                                        <tr>
                                                            <th>Item ID</th>
                                                            <th>Item Name</th>
                                                            <th>Price</th>
                                                            <th>Stock</th>
                                                            <th>Category</th>
                                                            <th>Warranty Details</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {purchase.items.map((item) => (
                                                            <tr key={item.item_id}>
                                                                <td>{item.item.item_id}</td>
                                                                <td>{item.item.product_name}</td>
                                                                <td>{item.item.price}</td>
                                                                <td>{item.item.stock}</td>
                                                                <td>{item.item.category}</td>
                                                                <td>{item.item.warranty_details || 'N/A'}</td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            </td>
                                        </tr>
                                    )}
                                </React.Fragment>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

export default PurchaseList;


