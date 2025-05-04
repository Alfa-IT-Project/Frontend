import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
// const API_URL = 'http://localhost:4000';
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

    function generateTrackingNumber() {
        const datePart = new Date().toISOString().slice(0, 10).replace(/-/g, "");
        const randomPart = Math.floor(1000 + Math.random() * 9000);
        return `TRK${datePart}-${randomPart}`;
    }

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
            expected.setDate(assigned.getDate() + 2); // Add 2 days
            const expectedFormatted = expected.toISOString().split('T')[0];
            setExpectedDeliveryDate(expectedFormatted);
        } else {
            setExpectedDeliveryDate(""); // Reset if no assigned date
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

        const trackingNumber = generateTrackingNumber();

        axios.post("http://localhost:4000/add", {
            trackingNumber,
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
            navigate("/ ");
        })
        .catch((err) => {
            console.error(err);
        });
    }

    return (
        <div className="d-flex vh-100 bg-primary justify-content-center align-items-center">
            <div className="w-50 bg-white rounded p-3">
                <form onSubmit={handleSubmit}>
                    <h1 align="left">Add Delivery</h1>

                    <div className="mb-2" align="left">
                        <label htmlFor="description" className="form-label">Description</label>
                        <input type="text" className="form-control" id="description" 
                            onChange={e => setDescription(e.target.value)} required
                        />
                    </div>

                    <div className="mb-2" align="left">
                        <label htmlFor="clientName" className="form-label">Client Name</label>
                        <input type="text" className="form-control" id="clientName" 
                            onChange={e => setClientName(e.target.value)} required
                        />
                    </div>

                    <div className="mb-2" align="left">
                        <label htmlFor="deliveryAddress" className="form-label">Delivery Address</label>
                        <input type="text" className="form-control" id="deliveryAddress" 
                            onChange={e => setDeliveryAddress(e.target.value)} required
                        />
                    </div>

                    <div className="mb-2" align="left">
                        <label htmlFor="contactNumber" className="form-label">Contact Number</label>
                        <input type="text" className="form-control" id="contactNumber" 
                            onChange={e => setContactNumber(e.target.value)} required
                        />
                    </div>

                    <div className="mb-2" align="left">
                        <label htmlFor="email" className="form-label">Email</label>
                        <input type="text" className="form-control" id="email" 
                            onChange={e => setEmail(e.target.value)} required
                        />
                        {emailError && <div className="text-danger mt-1">{emailError}</div>}
                    </div>

                    <div className="mb-2" align="left">
                        <label htmlFor="assignedDate" className="form-label">Assigned Date</label>
                        <input type="date" className="form-control" id="assignedDate"
                            value={assignedDate}
                            onChange={handleAssignedDateChange} required
                        />
                    </div>

                    <div className="mb-2" align="left">
                        <label htmlFor="expectedDeliveryDate" className="form-label">Expected Delivery Date</label>
                        <input type="date" className="form-control" id="expectedDeliveryDate"
                            value={expectedDeliveryDate}
                            onChange={handleExpectedDateChange} required
                            min={assignedDate} // Prevent selecting before assigned date
                        />
                    </div>

                    <div className="mb-2" align="left">
                        <label htmlFor="comments" className="form-label">Comments</label>
                        <textarea className="form-control" id="comments" rows="3"
                            placeholder="Special Note About the Delivery"
                            onChange={e => setComments(e.target.value)}
                        ></textarea>
                    </div>

                    <button type="submit" className="btn btn-primary">Submit</button>
                </form>
            </div>
        </div>
    );
}

export default Add_Delivery;