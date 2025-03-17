import React, { useEffect, useState } from "react";
import axios from "axios";
import { Card /*,Input, Button*/ } from "antd";
import { useNavigate } from 'react-router-dom';
import { Spin } from 'antd';

export default function CustomerProfile() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const userId = localStorage.getItem("userId");
  
  
  if (userId !== null) {
    console.log('userId:', userId); // Log as string
    // If you need to send it as a number:
    const numericUserId = parseInt(userId, 10);
    console.log('Numeric userId:', numericUserId);
  }

  useEffect(() => {
    if (!userId) {
      navigate('/');
      return;
    }
  
    const token = localStorage.getItem('token'); // Get stored token
    axios
      .get(`http://localhost:4000/users/${userId}/profile`, {
        headers: { Authorization: `Bearer ${token}` }, // Attach token
      })
      .then((response) => {
        if (response.status === 200) {
          setUser(response.data);
        } else if (response.status === 404) {
          navigate('/');
        } else {
          console.error('API request failed:', response.status);
          navigate('/');
        }
      })
      .catch((error) => {
        console.error('Error fetching user data:', error);
        navigate('/');
      });
  }, [userId, navigate]);
  
  
  if (!user) {
    return <Spin size="large" />;
  }
  
  return (
    <div className="max-w-lg mx-auto p-6">
      <Card title="Customer Profile" bordered={true} className="shadow-lg">
        <p><strong>Name:</strong> {user.username}</p>
        <p><strong>Email:</strong> {user.email}</p>
        <p><strong>Phone:</strong> {user.phone}</p>
        
        <h3 className="mt-4 text-lg font-semibold">Purchases & Warranties</h3>
        {user.purchases.length > 0 ? (
          user.purchases.map(purchase => (
            <Card key={purchase.id} className="mt-3 shadow-sm" bordered={true}>
              <p><strong>Product:</strong> {purchase.product}</p>
              <p><strong>Purchase Date:</strong> {purchase.purchaseDate}</p>
              <p><strong>Warranty Expiry:</strong> {purchase.warrantyExpiryDate}</p>
            </Card>
          ))
        ) : (
          <p className="text-gray-500">No purchases found.</p>
        )} }
      </Card>
    </div>
  );
};

