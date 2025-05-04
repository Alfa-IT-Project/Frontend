import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/CRM/Login/login.js';

import CustomerDashboard from './pages/CRM/customer_profile/profile.js';
import ContactUs from './pages/CRM/customer_profile/contact_us.js';
import EditProfile from './pages/CRM/customer_profile/edit_profile.js';

import ManagerDashboard from './pages/CRM/Manager_dashboard/gm_dashboard.js';
import CustomerList from './pages/CRM/Manager_dashboard/customer_list.js';
import PurchaseList from './pages/CRM/Manager_dashboard/purchase_list.js';
import AddCustomer from './pages/CRM/Manager_dashboard/addCUstomerForm.js';
import ContactList from './pages/CRM/Manager_dashboard/generate_rewards.js';

import InventoryHome from './pages/Inventory_management/Home.jsx';
import InventoryCreate from './pages/Inventory_management/Create.jsx';
import InventoryEdit from './pages/Inventory_management/Edit.jsx';  
import InventoryRead from './pages/Inventory_management/Read.jsx';

import DeliveryDashboard from './pages/Delivery_Management/Dashoard.js';
import AddDelivery from './pages/Delivery_Management/Add_Delivery.js';
import UpdateDelivery from './pages/Delivery_Management/UpdateDelivery.js'
import Driverdasboard from './pages/Delivery_Management/Driverdashboard.js'
function App() {
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const [role, setRole] = useState(localStorage.getItem('role') || null);
  const [userId, setUserId] = useState(() => {
    const storedUserId = localStorage.getItem('userId');
    return storedUserId ? parseInt(storedUserId, 10) : null;
  });

  return (
    <Router>
      <Routes>
        {/* Login Route */}
        <Route
          path="/login"
          element={<Login setToken={setToken} setRole={setRole} setUserId={setUserId} />}
        />

        {/* Customer Routes */}
        <Route
          path="/customer-dashboard"
          element={token && role === 'customer' ? (<CustomerDashboard />) : (<Navigate to="/login" />)}
        />
        <Route
          path="/contact"
          element={token && role === 'customer' ? (<ContactUs />) : (<Navigate to="/login" />)}
        />
        <Route
          path="/edit_profile"
          element={token && role === 'customer' ? (<EditProfile userId={userId} />) : (<Navigate to="/login" />)}
        />

        {/* General Manager Routes */}
        <Route
          path="/manager-dashboard"
          element={token && role === 'general_manager' ? (<ManagerDashboard />) : (<Navigate to="/login" />)}
        />
        <Route
          path="/customers"
          element={token && role === 'general_manager' ? (<CustomerList />) : (<Navigate to="/login" />)}
        />
        <Route
          path="/purchases"
          element={token && role === 'general_manager' ? (<PurchaseList />) : (<Navigate to="/login" />)}
        />
        <Route
          path="/addCustomer"
          element={token && role === 'general_manager' ? (<AddCustomer />) : (<Navigate to="/login" />)}
        />
        <Route
          path="/contactList"
          element={token && role === 'general_manager' ? (<ContactList />) : (<Navigate to="/login" />)}
        />

        {/* Delivery Routers */}
        <Route 
          path="/delivery-manager-dashboard"
          element={token && role === 'delivery_manager' ? (<DeliveryDashboard/>) : (<Navigate to="/login"/>)}
        />
        <Route 
          path="/add"
          element={token && role === 'delivery_manager' ? (<AddDelivery/>) : (<Navigate to="/login"/>)}
        />
        <Route 
          path="/update/trackingID"
          element={token && role === 'delivery_manager' ? (<UpdateDelivery/>) : (<Navigate to="/login"/>)}
        />
        <Route
          path="/driver"
          element={token && role === 'driver' ? (<Driverdasboard/>) : (<Navigate to="/login"/>)}
        />
         
        {/* Redirect unknown paths to login */}
        {/*Inventory Management Routes */}
        <Route
          path="/product-manager-dashboard"
          element={token && role === 'product_manager' ? (<InventoryHome />) : (<Navigate to="/login" />)}
        />
         <Route
          path="/create"
          element={token && role === 'product_manager' ? (<InventoryCreate />) : (<Navigate to="/login" />)}
        />
         <Route
          path="/edit/:id"
          element={token && role === 'product_manager' ? (<InventoryEdit />) : (<Navigate to="/login" />)}
        />
         <Route
          path="/read/:id"
          element={token && role === 'product_manager' ? (<InventoryRead />) : (<Navigate to="/login" />)}
        />
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}

export default App;