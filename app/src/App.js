import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login/login.js';

import CustomerDashboard from './pages/customer_profile/profile.js';
import ContactUs from './pages/customer_profile/contact_us.js';
import EditProfile from './pages/customer_profile/edit_profile.js';

import ManagerDashboard from './pages/Manager_dashboard/gm_dashboard.js';
import CustomerList from './pages/Manager_dashboard/customer_list.js';
import PurchaseList from './pages/Manager_dashboard/purchase_list.js';
import AddCustomer from './pages/Manager_dashboard/addCUstomerForm.js';
import ContactList from './pages/Manager_dashboard/generate_rewards.js';

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
          element={
            token && role === 'customer' ? (
              <CustomerDashboard />
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route
          path="/contact"
          element={
            token && role === 'customer' ? (
              <ContactUs />
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route
          path="/edit_profile"
          element={
            token && role === 'customer' ? (
              <EditProfile userId={userId} />
            ) : (
              <Navigate to="/login" />
            )
          }
        />

        {/* Manager Routes */}
        <Route
          path="/manager-dashboard"
          element={
            token && role === 'general_manager' ? (
              <ManagerDashboard />
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route
          path="/customers"
          element={
            token && role === 'general_manager' ? (
              <CustomerList />
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route
          path="/purchases"
          element={
            token && role === 'general_manager' ? (
              <PurchaseList />
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route
          path="/addCustomer"
          element={
            token && role === 'general_manager' ? (
              <AddCustomer />
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route
          path="/contactList"
          element={
            token && role === 'general_manager' ? (
              <ContactList />
            ) : (
              <Navigate to="/login" />
            )
          }
        />

        {/* Redirect unknown paths to login */}
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}

export default App;