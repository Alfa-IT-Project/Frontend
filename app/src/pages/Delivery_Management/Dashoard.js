// Dashboard.js
import React, { useEffect, useState } from 'react';
import styles from '../../components/Delivery_management/Dashboard.module.css';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { Trash2, Edit, Plus } from 'lucide-react';
import Navbar from '../../components/Delivery_management/NavBarAdmin.js';

const API_URL = 'http://localhost:4000';

function Dashboard() {
  const [dashboardData, setDashboardData] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${API_URL}/allDeliveries`);
        if (Array.isArray(response.data)) {
          setDashboardData(response.data);
        } else {
          setDashboardData([]);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        setDashboardData([]);
      }
    };
    fetchData();
  }, []);

  const handleDelete = async (trackingID) => {
    try {
      await axios.delete(`${API_URL}/delete/${trackingID}`);
      setDashboardData((prevData) => prevData.filter(item => item.TrackingID !== trackingID));
      console.log(`Tracking ID ${trackingID} deleted successfully.`);
    } catch (error) {
      console.error('Error deleting:', error);
    }
  };

  const handleSelect = (id) => {
    setSelectedIds(prev =>
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const updateStatus = async (status) => {
    try {
      const updates = selectedIds.map(id => axios.put(`${API_URL}/updateStatus/${id}`, { Status: status }));
      await Promise.all(updates);
      setDashboardData(prevData =>
        prevData.map(item =>
          selectedIds.includes(item.TrackingID) ? { ...item, Status: status } : item
        )
      );
      setSelectedIds([]);
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  return (
    <div className={styles.dcontainer}>
      <Navbar />
      <div className={styles.dheader}>
        <Link to="/add" className={styles.daddButton}>
          <Plus size={20} /> Add
        </Link>
      </div>

     
      <div className={styles.dtableContainer}>
        <table className={styles.dtable}>
          <thead>
            <tr>
              <th>Select</th>
              {["Tracking ID", "Description", "Client Name", "Delivery Address", "Contact Number", "Email", "Assigned Date", "Expected Delivery", "Comments", "Actions"].map((header, index) => (
                <th key={index}>{header}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {dashboardData.map((data, index) => (
              <tr key={index}>
                <td>
                  <input
                    type="checkbox"
                    checked={selectedIds.includes(data.TrackingID)}
                    onChange={() => handleSelect(data.TrackingID)}
                  />
                </td>
                <td>{data.TrackingID}</td>
                <td>{data.Description}</td>
                <td>{data.Client_Name}</td>
                <td>{data.Delivery_address}</td>
                <td>{data.Contact_Number}</td>
                <td>{data.Email}</td>
                <td>{data.Assigned_Date}</td>
                <td>{data.Expected_DeliveryDate}</td>

                <td>{data.Comments}</td>
                <td className={styles.dactionButtons}>
                  <Link to={`/update/${data.TrackingID}`} className={styles.deditButton}>
                    <Edit size={16} />
                  </Link>
                  <button onClick={() => handleDelete(data.TrackingID)} className={styles.ddeleteButton}>
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className={styles.dactionsFooter}>
          
          <div className={styles.dtotal}>Total Deliveries: {dashboardData.length}</div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;