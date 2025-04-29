import React, { useEffect, useState } from 'react';
import axios from 'axios';

function Driverdashboard() {
    const [dashboardData, setDashboardData] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('http://localhost:8081/');
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

    // Function to send an email
    const sendEmailUpdate = async (data) => {
        try {
            await axios.post('http://localhost:8081/sendemail', {
                email: data.Email,
                trackingID: data.TrackingID,
                description: data.Description,
                expectedDeliveryDate: data.Expected_DeliveryDate
            });
            alert("Email sent successfully!");
        } catch (error) {
            alert("Failed to send email.");
            console.error("Error sending email:", error);
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 p-6 flex justify-center items-center">
            <div className="w-full max-w-6xl bg-white rounded-lg shadow-lg p-4 overflow-x-auto">
                <h1 className="text-3xl font-bold text-gray-800 mb-4">Driver Dashboard</h1>
                <table className="min-w-full border-collapse">
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
                                    <button onClick={() => sendEmailUpdate(data)} className="btn btn-primary">
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