import React, { useEffect, useState, useRef } from 'react';
import styles from './styles/pmCSS.module.css';
// For PDF download
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import NavBar from './NavBar.jsx';
const Report = () => {
  const [lowStock, setLowStock] = useState([]);
  const [newItems, setNewItems] = useState([]);
  const reportRef = useRef();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch low stock items
    fetch("http://localhost:4000/api/reports/low-stock")
      .then((res) => res.json())
      .then((data) => {
        setLowStock(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching report:", err);
        setLoading(false);
      });
    // Fetch newly added items
    fetch("http://localhost:4000/api/reports/new-items")
      .then((res) => res.json())
      .then((data) => {
        setNewItems(data);
      })
      .catch((err) => {
        console.error("Error fetching new items report:", err);
      });
  }, []);

  const downloadPDF = () => {
    const input = reportRef.current;
    html2canvas(input).then((canvas) => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save('report.pdf');
    });
  };

  if (loading) return <div>Loading...</div>;

  return (
    <>
    
    <NavBar/>
    <div className={styles.reportContainer}>
      <div className={styles.reportHeader}>
        <h2>📋 Reports</h2>
        <button className={styles.reportPdfButton} onClick={downloadPDF}>Download as PDF</button>
      </div>
      <div ref={reportRef} className={styles.reportContent}>
        {/* Low Stock Items */}
        <div className={styles.reportSection}>
          <h3 className={styles.reportSectionTitle}> <span role="img" aria-label="low-stock">📉</span> Low Stock Items</h3>
          <table className={styles.reportTable}>
            <thead>
              <tr>
                <th>Item</th>
                <th>Category</th>
                <th>Quantity</th>
                <th>Supplier</th>
                <th>Restocked</th>
              </tr>
            </thead>
            <tbody>
              {lowStock.map((item, idx) => (
                <tr key={idx}>
                  <td>{item.item}</td>
                  <td>{item.category}</td>
                  <td>{item.quantity}</td>
                  <td>{item.supplier}</td>
                  <td>{item.restocked}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {/* Newly Added Items */}
        <div className={styles.reportSection}>
          <h3 className={styles.reportSectionTitle}><span role="img" aria-label="new">🆕</span> Newly Added Items</h3>
          <table className={styles.reportTable}>
            <thead>
              <tr>
                <th>Item</th>
                <th>Category</th>
                <th>Quantity</th>
                <th>Unit Price</th>
                <th>Date Added</th>
                <th>Added By</th>
              </tr>
            </thead>
            <tbody>
              {newItems.map((row, idx) => (
                <tr key={idx}>
                  <td>{row.item}</td>
                  <td>{row.category}</td>
                  <td>{row.quantity}</td>
                  <td>LKR {row.price}</td>
                  <td>{row.date}</td>
                  <td>{row.addedBy}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
    </>
  );
};

export default Report;