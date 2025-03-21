import React, { useEffect, useState } from "react";
import axios from "axios";
import { Card /*,Input, Button*/ } from "antd";
//import { useNavigate } from 'react-router-dom';
// import { Spin } from 'antd';

const API_URL = 'http://localhost:4000';

function CustomerProfile() {
  const [user, setUser] = useState([]);
  // const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(`${API_URL}/users/:id/profile`, {
          headers: {
            Authorization: `Bearer ${token}` // Include token in request
          }
        });
        console.log("role", response.role);
        console.log('Customers:', response.data);
        setUser(response.data);
      } catch (error) {
        console.error('Error fetching orders:', error);
      }
    };
    fetchUser();
  }, []);

  return (
    <div className="max-w-lg mx-auto p-6">
      <Card title="Customer Profile" bordered={true} className="shadow-lg">
        <p><strong>Name:</strong> {user.username}</p>
        <p><strong>Email:</strong> {user.email}</p>
        <p><strong>Phone:</strong> {user.phone}</p>
        
        {/* <h3 className="mt-4 text-lg font-semibold">Purchases & Warranties</h3>
        {user.purchases.length > 0 ? (
          user.purchases.map(purchase => (
            <Card key={purchase.id} className="mt-3 shadow-sm" bordered={true}>
              <p><strong>Product:</strong> {purchase.}</p>
              <p><strong>Purchase Date:</strong> {purchase.}</p>
              <p><strong>Warranty Expiry:</strong> {purchase.}</p>
            </Card>
          )) */}
        {/* ) : (
          <p className="text-gray-500">No purchases found.</p>
        )}  */}
      </Card>
    </div>
  );
};

export default CustomerProfile;