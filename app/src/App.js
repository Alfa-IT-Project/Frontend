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
import ContactList from './pages/Manager_dashboard/AdminContactMessages.js';

function App() {
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const [role, setRole] = useState(localStorage.getItem('role') || null);
  // const [userId] = useState(localStorage.getItem('userId') || null);
  const [userId, setUserId] = useState(() => {
    const storedUserId = localStorage.getItem('userId');
    return storedUserId ? parseInt(storedUserId, 10) : null;
  });

  return (
    <Router>
      <Routes>
        {/* Always show login page first when running the project */}
        {/* <Route path="/" element={<Navigate to="/login" />} /> */}

        {/* Login Route */}
        <Route path="/login" element={<Login setToken={setToken} setRole={setRole} setUserId={setUserId} />} />

        {/* Protected Routes for Customers */}
        {token && role === 'customer' ? (
          <>
            <Route path="/customer-dashboard" element={<CustomerDashboard />} />
            <Route path="/contact" element={<ContactUs />} />
            <Route path="/edit_profile" element={<EditProfile userId={userId} />} />



          </>
        ) : (
          <Route path="/customer-dashboard" element={<Navigate to="/login" />} />
        )}

        {/* Protected Routes for General Manager */}
        {token && role === 'general_manager' ? (
          <>
              <Route path="/manager-dashboard" element={<ManagerDashboard />} />
              <Route path="/customers" element={<CustomerList />} />
              <Route path="/purchases" element={<PurchaseList />} />
              <Route path="/addCustomer" element={<AddCustomer />} />
              <Route path="/contactList" element={<ContactList />} />
          </>
        ) : (
          <Route path="/manager-dashboard" element={<Navigate to="/login" />} />
        )}

        {/* Redirect unknown paths to login */}
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}

export default App;




// import './App.css';
// import React , {useState} from 'react';
// import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
// import Home from './components/Manager_dashboard/gm_dashboard.js';
// // import Order from './components/Order/order';
// // import Sview from './components/Supplier/sview';
// import Login from './components/Login/login'; 
// function App() {
//   const [token, setToken] = useState();
//   const [role, setRole] = useState(localStorage.getItem('role') || null);

// if(!token){
//   return <Login setToken={setToken} />
// }


//   return (
//     <Router>
//       <div>
//         <Routes>
//           <Route path="/" element={<Home />} />
//           {/* <Route path="/order" element={<Order />} />
//           <Route path="/sview" element={<Sview />} /> */}
//         </Routes>
//       </div>
//     </Router>
//   );
// }

// export default App;
