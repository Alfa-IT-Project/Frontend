import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from '../../../components/CRM/manager/NavBarAdmin.js';
import style from './generate_rewards.module.css'; 
const API_URL = 'http://localhost:4000';
function RewardListPage() {
  const [rewards, setRewards] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [tiers, setTiers] = useState([]);
  const [selectedTierId, setSelectedTierId] = useState(null);
  const [offer, setOffer] = useState('');
  const [note, setNote] = useState('');
  const [expireDate, setExpireDate] = useState('');
  const [editMode, setEditMode] = useState(false);
  const [editableReward, setEditableReward] = useState(null);
  const [error, setError] = useState('');
  useEffect(() => {
    const fetchTiers = async () => {
      try {
        const token = localStorage.getItem("token");

        const response = await axios.get(`${API_URL}/rewards/all/rewards`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setRewards(response.data);
      } catch (error) {
        console.error("Error fetching rewards:", error);
      }
    };
  
    fetchTiers();
  }, []);
  useEffect(() => {
    const fetchTiers = async () => {
      try {
        const token = localStorage.getItem("token");

        const response = await axios.get(`${API_URL}/rewards/tiers`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setTiers(response.data);
      } catch (error) {
        console.error("Error fetching tiers:", error);
      }
    };
  
    fetchTiers();
  }, []);
  
  const handleGenerateBulk = async () => {
    const token = localStorage.getItem("token");
    const payload = {
      tierType: tiers.find(t => t.id === selectedTierId)?.name || 'all',
      name: `${tiers.find(t => t.id === selectedTierId)?.name || 'General'} Reward`,
      offer,
      notes: note,
      generateDate: new Date().toISOString(),
      expireDate: new Date(expireDate).toISOString(),
      tierId: selectedTierId,
    };
  
    try {
      if (editMode && editableReward) {
        // Update existing reward
        await axios.put(`${API_URL}/rewards/updateReward/${editableReward.id}`, payload, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
      } else {
        // Create new reward
        await axios.post(`${API_URL}/rewards/createReward`, payload, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
      }
  
      alert(editMode ? "Reward updated!" : "Reward generated!");
      setShowModal(false);
      setEditMode(false);
      setEditableReward(null);
    } catch (error) {
      console.error("Error saving reward:", error);
    }
  };
  
  

  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${API_URL}/rewards/deleteReward/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setRewards((prevCustomers) =>
        prevCustomers.filter((reward) => reward.id !== id)
      );
      console.log(`Customer with ID ${id} deleted successfully.`);
    } catch (error) {
      console.error('Error deleting customer:', error);
    }
  };
  const handleUpdate = (reward) => {
    setEditableReward(reward);
    setSelectedTierId(reward.tierId);
    setOffer(reward.offer);
    setNote(reward.notes || '');
    setExpireDate(reward.expireDate?.split('T')[0] || '');
    setEditMode(true);
    setShowModal(true);
  };
  
 
  const closeModal = () => {
    setShowModal(false);
    setEditMode(false);
    setEditableReward(null);
    setSelectedTierId(null);
    setOffer('');
    setNote('');
    setExpireDate('');
  };

  return (
  <>
    <Navbar />
    <div className={style.rewardPage}>
         
        <div className={style.header-rewards}>
         
          <h2>Reward List</h2>
          <button className={style.primaryButton} onClick={() => setShowModal(true)}>
            + Generate Rewards
          </button>
        </div>

        <table className={style.customerTable}>
          <thead>
            <tr>
              <th>Reward ID</th>
              <th>Tier Type</th>
              <th>Reward Name</th>
              <th>Offer</th>
              <th>Generate Date</th>
              <th>Expire Date</th>
              <th>Notes</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {rewards.map((reward) => (
              <tr key={reward.id}>
                <td>{reward.id}</td>
                <td>{reward.tierType}</td>
                <td>{reward.name}</td>
                <td>{reward.offer}</td>
                <td>{reward.generateDate}</td>
                <td>{reward.expireDate}</td>
                <td>{reward.notes || 'N/A'}</td>
                <td>
                  <button onClick={() => handleDelete(reward.id)}>
                    Delete 
                  </button>
                  <button onClick={() => handleUpdate(reward)}>
                    Update 
                  </button>

                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {showModal && (
          <div className={style.modal}>
            <div className={style.modalContent}>
            <span className={style.close} onClick={closeModal}>&times;</span>

              <h2>Generate Rewards</h2>
              <div className={style.form}>
              <div className={style.formItem}>
                <label>Target Tier</label>
                <select
                  value={selectedTierId || ''}
                  onChange={(e) => setSelectedTierId(parseInt(e.target.value))}
                >
                  <option value="">Select Tier</option>
                  {tiers.map((tier) => (
                    <option key={tier.id} value={tier.id}>
                      {tier.name}
                    </option>
                  ))}
                </select>
              </div>
                <div className={style.formItem}>
                  <label>Offer</label>
                  <input type="text" value={offer} onChange={(e) => setOffer(e.target.value)} />
                </div>
                <div className={style.formItem}>
                  <label>Reason</label>
                  <textarea value={note} onChange={(e) => setNote(e.target.value)} />
                </div>
                <div className={style.formItem}>
                  <div className={style.formItem}>
              <label>Expire Date</label>
              <input
                type="date"
                value={expireDate}
                onChange={(e) => {
                  const selected = new Date(e.target.value);
                  const currentDate = new Date();
                  currentDate.setHours(0, 0, 0, 0); // normalize time

                  if (selected < currentDate) {
                    setError('Please select a future date');
                    setExpireDate('');
                  } else {
                    setError('');
                    setExpireDate(e.target.value);
                  }
                }}
              />
              {error && <p className={style.error}>{error}</p>}
              
            </div>
                </div>

                
                <button className={style.primaryButton} onClick={handleGenerateBulk}>Generate</button>
              </div>
            </div>
          </div>
        )}
      </div>
      
      </>
    );
  }

export default RewardListPage;
