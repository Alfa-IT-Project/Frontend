import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/CRM/Login/login.js';

import CustomerDashboard from './pages/CRM/customer_profile/profile.js';
import ContactUs from './pages/CRM/customer_profile/contact_us.js';
import EditProfile from './pages/CRM/customer_profile/edit_profile.js';

import GeneralManagerDashboard from './pages/CRM/Manager_dashboard/gm_dashboard.js';
import CustomerList from './pages/CRM/Manager_dashboard/customer_list.js';
import PurchaseList from './pages/CRM/Manager_dashboard/purchase_list.js';
import ContactList from './pages/CRM/Manager_dashboard/generate_rewards.js';

import InventoryHome from './pages/Inventory_management/Home.jsx';
import InventoryCreate from './pages/Inventory_management/Create.jsx';
import InventoryEdit from './pages/Inventory_management/Edit.jsx';  
import InventoryRead from './pages/Inventory_management/Read.jsx';

import DeliveryDashboard from './pages/Delivery_Management/Dashoard.js';
import AddDelivery from './pages/Delivery_Management/Add_Delivery.js';
import UpdateDelivery from './pages/Delivery_Management/UpdateDelivery.js'
import Driverdasboard from './pages/Delivery_Management/Driverdashboard.js'

import SupplierDashboard from './pages/Supplier_management/Home.js';
import SupplierList from './pages/Supplier_management/Supplier.js';
import SupplierOrder from './pages/Supplier_management/Order.js';
import SupplierView from './pages/Supplier_management/Sview.js';
import SupplierEdit from './pages/Supplier_management/Sedit.js';


import StaffDashboard from './pages/Staff_management/StaffDashboard';
import ManagerDashboard from './pages/Staff_management/ManagerDashboard';
import Leaves from './pages/Staff_management/Leaves';
// import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Performance from './components/Staff_management/Performance';
import DashboardLayout from './components/Staff_management/DashboardLayout';
import Scheduler from './pages/Staff_management/Scheduler';
import StaffCalendar from './pages/Staff_management/StaffCalendar';
import StaffAttendance from './pages/Staff_management/StaffAttendance';
import ManagerAttendance from './pages/Staff_management/ManagerAttendance';
import Profile from './pages/Staff_management/Profile';
import Settings from './pages/Staff_management/Settings';
import StaffPayroll from './pages/Staff_management/StaffPayroll';
import AdminPayroll from './pages/Staff_management/AdminPayroll';
import UserManagement from './pages/Staff_management/UserManagement';

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
          element={token && role === 'general_manager' ? (<GeneralManagerDashboard />) : (<Navigate to="/login" />)}
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
          path="/rewardList"
          element={
            token && role === 'general_manager' ? (
              <ContactList />
            ) : (
              <Navigate to="/login" />
            )
          }
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
          path="/update/:trackingID"
          element={token && role === 'delivery_manager' ? (<UpdateDelivery/>) : (<Navigate to="/login"/>)}
        />
        <Route
          path="/driver"
          element={token && role === 'driver' ? (<Driverdasboard/>) : (<Navigate to="/login"/>)}
        />
         
       
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
          path="/edit"
          element={token && role === 'product_manager' ? (<InventoryEdit />) : (<Navigate to="/login" />)}
        />
        <Route
          path="/read"
          element={token && role === 'product_manager' ? (<InventoryRead />) : (<Navigate to="/login" />)}
        />

        {/*Supplier Management*/}
        
        <Route
          path="/supplier-manager-dashboard"
          element={token && role === 'supplier_manager' ? (<SupplierDashboard />) : (<Navigate to="/login" />)}
        />
        <Route
          path="/supplier"
          element={token && role === 'supplier_manager' ? (<SupplierList />) : (<Navigate to="/login" />)}
        />
        <Route
          path="/order"
          element={token && role === 'supplier_manager' ? (<SupplierOrder />) : (<Navigate to="/login" />)}
        />
        <Route
          path="/sview"
          element={token && role === 'supplier_manager' ? (<SupplierView />) : (<Navigate to="/login" />)}
        />
        <Route  
          path="/sedit"
          element={token && role === 'supplier_manager' ? (<SupplierEdit />) : (<Navigate to="/login" />)}
        />
        <Route
        path="/manager"
        element={token && role === 'ADMIN' ? <DashboardLayout><ManagerDashboard /></DashboardLayout> : <Navigate to="/" />} />
      <Route
        path="/staff"
        element={token && role === 'STAFF' ? <DashboardLayout><StaffDashboard /></DashboardLayout> : <Navigate to="/" />} />
      <Route
        path="/leaves"
        element={token && (role === 'ADMIN' || role === 'STAFF') ? <DashboardLayout><Leaves /></DashboardLayout> : <Navigate to="/login" />} />
      <Route
        path="/payroll"
        element={token && role === 'ADMIN' ? <DashboardLayout><AdminPayroll /></DashboardLayout> : <DashboardLayout><StaffPayroll /></DashboardLayout>} />
      <Route
        path="/performance"
        element={token && (role === 'ADMIN' || role === 'STAFF')  ? <DashboardLayout><Performance /></DashboardLayout> : <Navigate to="/login" />} />
      <Route
        path="/scheduler"
        element={token && role === 'ADMIN' ? <DashboardLayout><Scheduler /></DashboardLayout> : <Navigate to="/" />} />
      <Route
        path="/calendar"
        element={token && role === 'STAFF' ? <DashboardLayout><StaffCalendar /></DashboardLayout> : <Navigate to="/" />} />
      <Route
        path="/attendance"
        element={token && role === 'STAFF' ? <DashboardLayout><StaffAttendance /></DashboardLayout> : <Navigate to="/" />} />
      <Route
        path="/attendance-records"
        element={token && role === 'ADMIN' ? <DashboardLayout><ManagerAttendance /></DashboardLayout> : <Navigate to="/" />} />
      <Route
        path="/profile"
        element={token && (role === 'ADMIN' || role === 'STAFF') ? <DashboardLayout><Profile /></DashboardLayout> : <Navigate to="/login" />} />
      <Route
        path="/settings"
        element={token && (role === 'ADMIN' || role === 'STAFF') ? <DashboardLayout><Settings /></DashboardLayout> : <Navigate to="/login" />} />
      <Route
        path="/user-management"
        element={token && role === 'ADMIN' ? <DashboardLayout><UserManagement /></DashboardLayout> : <Navigate to="/" />} />

         {/* Redirect unknown paths to login */}
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>

      
    </Router>
  );
}

export default App;