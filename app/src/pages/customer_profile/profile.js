import React, { useEffect, useState } from "react";
import axios from "axios";
import { Card } from "antd";
import NavBar from "../../components/NavBar.js";
const API_URL = 'http://localhost:4000';

function CustomerProfile() {
  const [user, setUser] = useState({});
  
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return; // Handle case where there's no token

        // Decode the token to extract userId
        const decodedToken = JSON.parse(atob(token.split('.')[1]));
        const userId = decodedToken.id;

        const response = await axios.get(`${API_URL}/users/${userId}/profile`, {
          headers: {
            Authorization: `Bearer ${token}` // Include token in request
          }
        });

        console.log('Fetched User:', response.data);
        setUser(response.data); // Assuming the response includes 'data' with the user profile info
      } catch (error) {
        console.error('Error fetching user profile:', error);
      }
    };
    
    fetchUser();
  }, []);

  return (
    
    <div className="max-w-lg mx-auto p-6">
      <NavBar/>
      <Card title="Purchases List" bordered={true} className="shadow-lg">
        
        
        <h3 className="mt-4 text-lg font-semibold">Purchases & Warranties</h3>
        {user.customer?.purchases?.length > 0 ? (
          user.customer.purchases.map(purchase => (
            <Card key={purchase.purchase_id} className="mt-3 shadow-sm" bordered={true}>
              <p><strong>Purchase Date:</strong> {new Date(purchase.order_date).toLocaleDateString()}</p>
              <p><strong>Total Amount:</strong> ${purchase.total_amount}</p>
              <p><strong>Grand Total:</strong> ${purchase.grand_total}</p>

              <h4 className="mt-2">Items:</h4>
              {purchase.items.map(item => (
                <p key={item.item_id}><strong>Item:</strong> {item.item.name} - Quantity: {item.quantity}</p>
              ))}

              <h4 className="mt-2">Promotions:</h4>
              {user.customer.promotions.length > 0 ? (
                user.customer.promotions.map(promo => (
                  <p key={promo.promotion_id}><strong>Promo Code:</strong> {promo.promo_code} - Discount: ${promo.discount}</p>
                ))
              ) : (
                <p>No promotions applied.</p>
              )}
            </Card>
          ))
        ) : (
          <p className="text-gray-500">No purchases found.</p>
        )}
      </Card>
    </div>
  );
}

export default CustomerProfile;
