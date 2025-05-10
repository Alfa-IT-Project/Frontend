import axios from "axios";
import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import styles from '../../components/Delivery_management/Dashboard.module.css';

function UpdateDelivery() {
    const [data, setData] = useState({
        description: "",
        clientName: "",
        deliveryAddress: "",
        contactNumber: "",
        email: "", 
        assignedDate: "",
        expectedDeliveryDate: "",
        comments: ""
    });
    const navigate = useNavigate();
    const { trackingID } = useParams();

    useEffect(() => {
        axios.get(`http://localhost:4000/get/${trackingID}`)
            .then(res => {
                const mappedData = {
                    description: res.data.Description,
                    clientName: res.data.Client_Name,
                    deliveryAddress: res.data.Delivery_address,
                    contactNumber: res.data.Contact_Number,
                    email: res.data.Email,
                    assignedDate: res.data.Assigned_Date,
                    expectedDeliveryDate: res.data.Expected_DeliveryDate,
                    comments: res.data.Comments
                };
                setData(mappedData);
            })
            .catch(err => console.error("Error fetching data:", err));
    }, [trackingID]);

    const handleSubmit = (event) => {
        event.preventDefault();
        axios.put(`http://localhost:4000/update/${trackingID}`, data)
            .then(() => navigate("/delivery-manager-dashboard"))
            .catch(err => {
                console.error("Error updating:", err);
                alert("Failed to update delivery item");
            });
    };

    return (
        <div className={styles.dupdateDeliveryContainer}>
            <div className={styles.dformWrapper}>
                <form onSubmit={handleSubmit}>
                    <h1>Update Delivery Details</h1>
                    {Object.keys(data).map((key) => (
                        <div className={styles.dformGroup} key={key}>
                            <label htmlFor={key} className="form-label">
                                {key.replace(/([A-Z])/g, ' $1').trim()}
                            </label>
                            <input
                                type={key.includes("Date") ? "date" : "text"}
                                className={styles.dformControl}
                                id={key}
                                name={key}
                                value={data[key] || ""}
                                onChange={(e) => setData({ ...data, [key]: e.target.value })}
                                required
                            />
                        </div>
                    ))}
                    <button type="submit" className={styles.dsubmitButton}>Update</button>
                </form>
            </div>
        </div>
    );
}

export default UpdateDelivery;