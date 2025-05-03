import React, { useState } from 'react';
import Navbar from '../../components/CRM/manager/NavBarAdmin.js';
import './generate_rewards.css'; // Import CSS for styling

function RewardListPage() {
  const [rewards, setRewards] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [targetCustomers, setTargetCustomers] = useState('all');
  const [points, setPoints] = useState('');
  const [reason, setReason] = useState('');
  const [sendEmail, setSendEmail] = useState(false);
  const [customers, setCustomers] = useState([
    { id: 1, user: { name: 'John Doe', email: 'john@example.com', phone: '123-456-7890', address: '123 Main St' }, notes: 'VIP Customer' },
    { id: 2, user: { name: 'Jane Smith', email: 'jane@example.com', phone: '987-654-3210', address: '456 Elm St' }, notes: 'New Customer' },
  ]);

  const handleGenerateBulk = () => {
    // submit to backend
    console.log('Generating rewards with:', {
      targetCustomers,
      points,
      reason,
      sendEmail,
    });
    setShowModal(false); // Close the modal after generating
  };

  const handleDelete = (customerId) => {
    // Implement delete functionality here
    console.log('Deleting customer with ID:', customerId);
  };

  return (
  <>
    <Navbar />
    <div className="reward-page">
         
        <div className="header-rewards">
         
          <h2>Reward List</h2>
          <button className="primary-button" onClick={() => setShowModal(true)}>
            + Generate Rewards
          </button>
        </div>

        <table className="customer-table">
          <thead>
            <tr>
              <th>Customer ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Address</th>
              <th>Notes</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {customers.map((customer) => (
              <tr key={customer.id}>
                <td>{customer.id}</td>
                <td>{customer.user.name}</td>
                <td>{customer.user.email}</td>
                <td>{customer.user.phone || 'N/A'}</td>
                <td>{customer.user.address || 'N/A'}</td>
                <td>{customer.notes || 'N/A'}</td>
                <td>
                  <button onClick={() => handleDelete(customer.id)}>
                    Delete Customer
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {showModal && (
          <div className="modal">
            <div className="modal-content">
              <span className="close" onClick={() => setShowModal(false)}>&times;</span>
              <h2>Generate Rewards</h2>
              <div className="form">
                <div className="form-item">
                  <label>Target Customers</label>
                  <select value={targetCustomers} onChange={(e) => setTargetCustomers(e.target.value)}>
                    <option value="all">All Customers</option>
                    <option value="tier_silver">Tier: Silver</option>
                    <option value="tier_gold">Tier: Gold</option>
                  </select>
                </div>
                <div className="form-item">
                  <label>Points</label>
                  <input type="number" value={points} onChange={(e) => setPoints(e.target.value)} />
                </div>
                <div className="form-item">
                  <label>Reason</label>
                  <textarea value={reason} onChange={(e) => setReason(e.target.value)} />
                </div>
                <div className="form-item">
                  <label>
                    <input type="checkbox" checked={sendEmail} onChange={(e) => setSendEmail(e.target.checked)} />
                    Send Email Notification
                  </label>
                </div>
                <button className="primary-button" onClick={handleGenerateBulk}>Generate</button>
              </div>
            </div>
          </div>
        )}
      </div>
      
      </>
    );
  }

export default RewardListPage;
