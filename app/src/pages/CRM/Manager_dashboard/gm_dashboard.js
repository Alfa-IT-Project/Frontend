import React, { useState, useEffect, useCallback } from 'react';
import styles from './styles.module.css';
import axios from 'axios';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import Navbar from '../../../components/CRM/manager/NavBarAdmin.js';
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const API_URL = 'http://localhost:4000';

function GenerateReport() {
  // State to manage form visibility
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState('');

  // State variables for form inputs
  const [reportType, setReportType] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  
  // State to store purchase data for the chart
  const [purchaseData, setPurchaseData] = useState([]);

  // Get today's date in YYYY-MM-DD format
  const today = new Date().toISOString().split('T')[0];

  // Validation function for dates
  const validateDates = (start, end) => {
    const startDateObj = new Date(start);
    const endDateObj = new Date(end);
    const todayObj = new Date(today);

    // Reset error state
    setError('');

    // Check if start date is before today
    if (startDateObj >= todayObj) {
      setError('Start date must be before today');
      return false;
    }

    // Check if end date is not in the future
    if (endDateObj > todayObj) {
      setError('End date cannot be in the future');
      return false;
    }

    // Check if start date is before end date
    if (startDateObj > endDateObj) {
      setError('Start date must be before end date');
      return false;
    }

    return true;
  };

  // Handle report generation button click
  const onClick = () => {
    setShowForm(true);
    setError(''); // Reset error when showing form
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
    // Validate dates before proceeding
    if (!validateDates(credentials.start_date, credentials.end_date)) {
      return;
    }

    const token = localStorage.getItem('token');
    try {
      const response = await axios.post(`${API_URL}/purchases/download`, credentials, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        responseType: 'blob'
      });

      // Create a blob from the PDF Stream
      const file = new Blob([response.data], { type: 'application/pdf' });
      
      // Create a URL for the blob
      const fileURL = window.URL.createObjectURL(file);
      
      // Create a link element
      const link = document.createElement('a');
      link.href = fileURL;
      link.download = `sales_report_${credentials.start_date}_to_${credentials.end_date}.pdf`;
      
      // Append to html link element page
      document.body.appendChild(link);
      
      // Start download
      link.click();
      
      // Clean up and remove the link
      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(fileURL);
    } catch (error) {
      console.error('Error generating report:', error);
      alert('Error generating report. Please try again.');
    }
  };

  return (
    <>
      <Navbar/>


      {/* Content Section */}
      <div className={styles.content}>
        <div className={styles.dashboardGrid}>
          {/* Report Generation Card */}
          <div className={styles.dashboardCard}>
            <h2>Generate Sales Report</h2>
            <div className={styles.buttonContainer}>
              <button onClick={onClick} className={styles.tableButton}>
                Generate Report
              </button>
            </div>

            {showForm && (
              <div className={styles.formContainer}>
                <h3>Report Form</h3>
                {error && <div className={styles.errorMessage}>{error}</div>}
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
                      max={today}
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
                      max={today}
                      required
                    />
                  </div>
                  <button type="submit" className={styles.submitButton}>Generate Report</button>
                </form>
              </div>
            )}
          </div>

          {/* Purchases Data Card */}
          <div className={styles.dashboardCard}>
            <h2>Purchase Analytics</h2>
            {purchaseData.length > 0 ? (
              <div className={styles.chartContainer}>
                <Bar data={chartData} options={chartOptions} />
              </div>
            ) : (
              <div className={styles.noDataMessage}>
                No purchase data available for the current month
              </div>
            )}
          </div>
        </div>
      </div>
    
    </>
  );
}

export default GenerateReport;
