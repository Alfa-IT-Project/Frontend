import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from '../../components/Delivery_management/Dashboard.module.css';
// /home/Dhananjana/GitHub/Frontend-1/app/src/components/Delivery_management/Dashboard.module.css
function Add_Delivery() {
    const [description, setDescription] = useState("");
    const [clientName, setClientName] = useState("");
    const [deliveryAddress, setDeliveryAddress] = useState("");
    const [contactNumber, setContactNumber] = useState("");
    const [email, setEmail] = useState("");
    const [assignedDate, setAssignedDate] = useState("");
    const [expectedDeliveryDate, setExpectedDeliveryDate] = useState("");
    const [comments, setComments] = useState("");
    const [emailError, setEmailError] = useState("");
    const navigate = useNavigate();

    const validateEmail = (email) => {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    };

    const handleAssignedDateChange = (e) => {
        const selectedDate = e.target.value;
        setAssignedDate(selectedDate);

        if (selectedDate) {
            const assigned = new Date(selectedDate);
            const expected = new Date(assigned);
            expected.setDate(assigned.getDate() + 2);
            const expectedFormatted = expected.toISOString().split('T')[0];
            setExpectedDeliveryDate(expectedFormatted);
        } else {
            setExpectedDeliveryDate("");
        }
    };

    const handleExpectedDateChange = (e) => {
        const selectedExpectedDate = e.target.value;
        if (assignedDate && selectedExpectedDate < assignedDate) {
            alert("Expected Delivery Date cannot be earlier than Assigned Date!");
            setExpectedDeliveryDate("");
        } else {
            setExpectedDeliveryDate(selectedExpectedDate);
        }
    };

    function handleSubmit(event) {
        event.preventDefault();

        if (!validateEmail(email)) {
            setEmailError("Please enter a valid email address.");
            return;
        } else {
            setEmailError("");
        }

        axios.post("http://localhost:4000/add", {
            description,
            clientName,
            deliveryAddress,
            contactNumber,
            email,
            assignedDate,
            expectedDeliveryDate,
            comments,
        })
        .then((res) => {
            console.log(res);
            navigate("/delivery-manager-dashboard");
        })
        .catch((err) => {
            console.error(err);
        });
    }

    return (
        <div className={styles.daddDeliveryContainer}>
            <div className={styles.dformWrapper}>
                <form onSubmit={handleSubmit}>
                    <h1>Add Delivery</h1>

                    <div className={styles.dformGroup}>
                        <label>Description</label>
                        <input 
                            type="text" 
                            className={styles.dformControl} 
                            onChange={e => setDescription(e.target.value)} 
                            required
                        />
                    </div>

                    <div className={styles.dformGroup}>
                        <label>Client Name</label>
                        <input 
                            type="text" 
                            className={styles.dformControl} 
                            onChange={e => setClientName(e.target.value)} 
                            required
                        />
                    </div>

                    <div className={styles.dformGroup}>
                        <label>Delivery Address</label>
                        <input 
                            type="text" 
                            className={styles.dformControl} 
                            onChange={e => setDeliveryAddress(e.target.value)} 
                            required
                        />
                    </div>

                    <div className={styles.dformGroup}>
                        <label>Contact Number</label>
                        <input 
                            type="text" 
                            className={styles.dformControl} 
                            onChange={e => setContactNumber(e.target.value)} 
                            required
                        />
                    </div>

                    <div className={styles.dformGroup}>
                        <label>Email</label>
                        <input 
                            type="text" 
                            className={styles.dformControl} 
                            onChange={e => setEmail(e.target.value)} 
                            required
                        />
                        {emailError && <div className={styles.derrorText}>{emailError}</div>}
                    </div>

                    <div className={styles.dformGroup}>
                        <label>Assigned Date</label>
                        <input 
                            type="date" 
                            className={styles.dformControl}
                            value={assignedDate}
                            onChange={handleAssignedDateChange} 
                            required
                        />
                    </div>

                    <div className={styles.dformGroup}>
                        <label>Expected Delivery Date</label>
                        <input 
                            type="date" 
                            className={styles.dformControl}
                            value={expectedDeliveryDate}
                            onChange={handleExpectedDateChange} 
                            required
                            min={assignedDate}
                        />
                    </div>

                    <div className={styles.dformGroup}>
                        <label>Comments</label>
                        <textarea 
                            className={styles.dformControl} 
                            rows="3"
                            placeholder="Special Note About the Delivery"
                            onChange={e => setComments(e.target.value)}
                        ></textarea>
                    </div>

                    <button type="submit" className={styles.dsubmitButton}>Submit</button>
                </form>
            </div>
        </div>
    );
}

export default Add_Delivery;