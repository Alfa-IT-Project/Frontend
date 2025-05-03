import React, { useState, useEffect, useCallback } from 'react';
import styles from './styles.module.css';
import axios from 'axios';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import Navbar from '../../components/CRM/manager/NavBarAdmin.js'; // Updated Navbar import path
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const API_URL = 'http://localhost:4000';

function GenerateReport() {
  
  
  // State to manage form visibility
  const [showForm, setShowForm] = useState(false);

  // State variables for form inputs
  
  const [reportType, setReportType] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  
  // State to store purchase data for the chart
  const [purchaseData, setPurchaseData] = useState([]);


  // Handle report generation button click
  const onClick = () => {
    setShowForm(true); // Show the form when button is clicked
  };
  
  const fetchPurchaseData = useCallback(async () => {
    try {
      const today = new Date();
      const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1).toISOString().split('T')[0];
      const lastDayOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).toISOString().split('T')[0];
  
      const response = await axios.post(`${API_URL}/purchases/`, {
        params: { start_date: firstDayOfMonth, end_date: lastDayOfMonth },
      });
  
      setPurchaseData(response.data); // Store response data
    } catch (error) {
      console.error("Error fetching purchase data:", error);
    }
  }, []);

  useEffect(() => {
    fetchPurchaseData();
  }, [fetchPurchaseData]);

  // Data for the Bar chart
  const chartData = {
    labels: purchaseData.map((data) => data.order_date), // Assuming each purchase data contains a 'date'
    datasets: [
      {
        label: 'Purchases',
        data: purchaseData.map((data) => data.grand_total), // Assuming each purchase data contains an 'amount'
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1
      }
    ]
  };

  // Options for the chart
  const chartOptions = {
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: 'Purchases Over Time'
      }
    }
  };

  // This function will handle the form submission
  const handleGenerateReport = async (credentials) => {
    const token = localStorage.getItem('token'); // Retrieve token from local storage or any other secure place
    try {
      const response = await axios.post(`${API_URL}/purchases/`, credentials, {
        headers: {
          Authorization: `Bearer ${token}` // Include token in request
        },
        responseType: 'blob', // Assuming the report is a downloadable file
      });

      // Create a link to download the file
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'sales_report.pdf'); // Set the filename for the downloaded report
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error('Error generating report:', error);
    }
  };

  return (
    <div className={styles.contain}>
    <Navbar/>

      {/* Content Section */}
      <div className={styles.content}>
        <h2>Generate Sales Report</h2>

        {/* Button to trigger form display */}
        <div className={styles.buttonContainer}>
          <button onClick={onClick} className={styles.tableButton}>
            Generate Report
          </button>
        </div>

        {/* Conditional rendering to show form */}
        {showForm && (
          <div>
            <h3>Report Form</h3>
            <form onSubmit={(e) => {
              e.preventDefault();
              handleGenerateReport({
                report_type: reportType,
                start_date: startDate,
                end_date: endDate
              });
            }} className={styles.reportForm}>
              
              <div className={styles.formGroup}>
                <label htmlFor="report_type">Report Type:</label>
                <select
                  id="report_type"
                  value={reportType}
                  onChange={(e) => setReportType(e.target.value)}
                  required
                >
                  <option value="">Select Report Type</option>
                  <option value="sales">Sales Report</option>
                  <option value="inventory">Inventory Report</option>
                </select>
              </div>
              <div className={styles.formGroup}>
                <label htmlFor="start_date">Start Date:</label>
                <input
                  type="date"
                  id="start_date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  required
                />
              </div>
              <div className={styles.formGroup}>
                <label htmlFor="end_date">End Date:</label>
                <input
                  type="date"
                  id="end_date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  required
                />
              </div>
              <button type="submit" className={styles.submitButton}>Generate Report</button>
            </form>
          </div>
        )}

        {/* Display the bar chart if data is available */}
        {purchaseData.length > 0 && (
          <div className={styles.chartContainer}>
            <h3>Purchase Data</h3>
            <Bar data={chartData} options={chartOptions} />
          </div>
        )}
      </div>
    </div>
  );
}

export default GenerateReport;
