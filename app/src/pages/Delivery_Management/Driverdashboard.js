import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Navbar from '../../components/Delivery_management/NavBarDriver.js';
import styles from '../../components/Delivery_management/Dashboard.module.css';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable'; 

function Driverdashboard() {
    const [dashboardData, setDashboardData] = useState([]);
    const [profileData, setProfileData] = useState({});

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('http://localhost:4000/allDeliveries');
                if (Array.isArray(response.data)) {
                    setDashboardData(response.data);
                } else {
                    setDashboardData([]);
                }
            } catch (error) {
                console.error("Error fetching data:", error);
                setDashboardData([]);
            }
        };
        fetchData();
    }, []);

    const sendEmailUpdate = async (data) => {
        try {
            await axios.post('http://localhost:4000/sendemail', {
                email: data.Email,
                trackingID: data.TrackingID,
                description: data.Description,
                expectedDeliveryDate: data.Expected_DeliveryDate
            });
            alert("Email sent successfully!");
        } catch (error) {
            console.error("Error sending email:", error);
            alert("Failed to send email.");
        }
    };

    // 📄 Export to PDF
    const exportPDF = () => {
        const doc = new jsPDF();
        doc.text("Driver Task Report", 14, 20);

        const tableColumn = [
            "Tracking ID", "Description", "Client Name", "Delivery Address",
            "Contact Number", "Email", "Assigned Date", "Expected Delivery Date", "Comments"
        ];

        const tableRows = dashboardData.map(row => [
            row.TrackingID,
            row.Description,
            row.Client_Name,
            row.Delivery_address,
            row.Contact_Number,
            row.Email,
            row.Assigned_Date,
            row.Expected_DeliveryDate,
            row.Comments
        ]);

        autoTable(doc, {
            startY: 30,
            head: [tableColumn],
            body: tableRows,
            styles: { fontSize: 8 },
            headStyles: { fillColor: [52, 58, 64] },
        });

        doc.save("Driver_Tasks_Report.pdf");
    };

    return (
        <div className={styles.dcontainer}>
            <Navbar />

            {/* Driver Profile Card */}
            <div className={styles.ddriverProfileCard}>
                <div className={styles.davatarWrapper}>
                    <img
                        src="/frontend/src/profile.jpeg"
                        alt="Driver Avatar"
                        className={styles.dprofileAvatar}
                    />
                    <div className={styles.dchangePhoto}>Changer photo</div>
                </div>

                <div className={styles.dprofileInfo}>
                    <div className={styles.dprofileName}>{profileData.name || "Nipun Amarasena"}</div>
                    <div className={styles.dprofileRole}>DELIVERY DRIVER</div>
                    <div className={styles.dprofileLocation}>Periyamulla, Negombo</div>
                    <div className={styles.dprofileJoin}>Member since 13 January 2023</div>

                    <div className={styles.dprofileProgress}>
                        <div className={styles.dprofileProgressBar}></div>
                    </div>
                    <div style={{ marginTop: '0.5rem', fontSize: '0.85rem', color: '#4b5563' }}>
                        12/20 Deliveries Completed
                    </div>
                </div>

                <div className={styles.dprofileButtons}>
                    <div className={styles.dprofileButton} onClick={exportPDF}>Download PDF</div>
                    <div className={styles.dprofileButton}>View Online</div>
                </div>
            </div>

            {/* Task Table */}
            <div className={styles.dtableContainer}>
                <table className={styles.dtable}>
                    <thead>
                        <tr className="bg-gray-200">
                            {["Tracking ID", "Description", "Client Name", "Delivery Address", "Contact Number", "Email", "Assigned Date", "Expected Delivery Date", "Comments", "Actions"].map((header, index) => (
                                <th key={index} className="px-4 py-2 border text-left text-gray-600 font-semibold">{header}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {dashboardData.map((data, index) => (
                            <tr key={index} className="odd:bg-white even:bg-gray-50 hover:bg-gray-100 transition duration-200">
                                <td className="px-4 py-2 border">{data.TrackingID}</td>
                                <td className="px-4 py-2 border">{data.Description}</td>
                                <td className="px-4 py-2 border">{data.Client_Name}</td>
                                <td className="px-4 py-2 border">{data.Delivery_address}</td>
                                <td className="px-4 py-2 border">{data.Contact_Number}</td>
                                <td className="px-4 py-2 border">{data.Email}</td>
                                <td className="px-4 py-2 border">{data.Assigned_Date}</td>
                                <td className="px-4 py-2 border">{data.Expected_DeliveryDate}</td>
                                <td className="px-4 py-2 border">{data.Comments}</td>
                                <td className="px-4 py-2 border">
                                    <button
                                        onClick={() => sendEmailUpdate(data)}
                                        className={styles.dsendEmailButton}
                                        title="Send Email Update"
                                    >
                                        Send Update
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default Driverdashboard;