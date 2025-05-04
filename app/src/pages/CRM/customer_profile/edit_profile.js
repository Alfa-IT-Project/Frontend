import React, { useState, useEffect } from "react";
import axios from "axios";
import NavBar from "../../../components/CRM/customer/NavBar.js"; // Adjust the path as necessary

const API_URL = "http://localhost:4000";

function EditProfile({ userId }) {
        const [customer, setCustomer] = useState({ 
                id: userId,
                name: '',
                email: '',
                phone: '',
                address: '',
                password: ''
               
        });
    
        useEffect(() => {

            const fetchCustomer = async () => {
                try {
                    const token = localStorage.getItem("token");

                    const decodedToken = JSON.parse(atob(token.split('.')[1]));
                    const userId = decodedToken.id;

                    const response = await axios.get(`${API_URL}/users/${userId}/profile`, {
                        headers: { Authorization: `Bearer ${token}` }
                    });
                    console.log(response.data);
                    setCustomer(response.data || { user: {}});
                } catch (error) {
                    
                    setCustomer({ 
                       
                            id:id,
                            name: '',
                            email: '',
                            phone: '',
                            address: '',
                            password: ''

                    });
                }
            };
            const id = localStorage.getItem("id");
            if (id) fetchCustomer();
        }, [userId]);

    const handleChange = (e) => {
       
        const { name, value } = e.target;
        setCustomer((prevState) => ({
            
            ...prevState,
                [name]: value,
           
        }));
    };

    // Submit updated data
    const onFinish = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem("token");

        
        let updatedData = {
            name: customer.name || "",
            email: customer.email || "",
            phone: customer.phone || "",
            address: customer.address || "",
            password: customer.password || "",
            confirmPassword: customer.confirmPassword,
          
        };

       
        try {
            if (customer.confirmPassword !== customer.password) {
                alert('Passwords must match');
                return;
            }

            const response = await axios.put(
                `${API_URL}/customers/${userId}/updateCustomer`, 
                updatedData,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            
            console.log("Profile updated:", response.data);
            alert("Profile updated successfully");
        } catch (error) {
            console.error("Error updating profile:", error);
        }
    };

    return (
        <div>
            <NavBar />
            <h1>Edit Profile</h1>
     
            <form onSubmit={onFinish} style={ {maxWidth: '600px', margin: '0 auto', padding: '20px' }}>
                <div>
                    <label>Name: </label>
                    <input
                        type="text"
                        name="name"
                        value={customer.name || ""}
                        onChange={handleChange}
                    />
                </div>
                <div>
                    <label>Email: </label>
                    <input
                        type="email"
                        name="email"
                        value={customer.email || ""}
                        onChange={handleChange}
                    />
                </div>
                <div>
                    <label>Address: </label>
                    <input
                        type="text"
                        name="address"
                        value={customer.address || ""}
                        onChange={handleChange}
                    />
                </div>
                <div>
                    <label>Telephone: </label>
                    <input
                        type="text"
                        name="phone"
                        value={customer.phone || ""}
                        onChange={handleChange}
                    />
                </div>
                <div>
                    <label>Password: </label>
                    <input
                        type="password"
                        name="password"
                        value={customer.password || ""}
                        onChange={handleChange}
                    />
                </div>
                <div>
                    <label>Confirm Password: </label>
                    <input
                        type="password"
                        name="confirmPassword"
                        value={customer.confirmPassword }
                        onChange={handleChange}
                        
                    />
                </div>
                <button type="submit">Save Changes</button>
            </form>
          
        </div>
    );
}

export default EditProfile;