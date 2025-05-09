import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { Trash2, Edit, Plus } from 'lucide-react';
import Navbar from '../../components/Delivery_management/NavBar.js'; // Adjust the import path as necessary

function Dashboard() {
    const [dashboardData, setDashboardData] = useState([]);

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

    const handleDelete = async (trackingID) => {
        try {
            await axios.delete(`http://localhost:4000/delete/${trackingID}`);
            setDashboardData(dashboardData.filter(item => item.TrackingID !== trackingID));
        } catch (error) {
            console.error("Error deleting:", error);
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 p-6">
            <Navbar/>
            <div className="mb-6 flex justify-between items-center">
                <br/>
                <br/>   
                <br/>
                <br/>
                <br/>

                {/* <h1 className="text-4xl font-bold text-gray-800">Delivery Dashboard</h1> */}
                <div className="space-x-4">
                    <Link to="/add">
                        <button className="btn btn-success">
                            <Plus size={26}/> Add
                        </button>
                    </Link>
                    {/* <Link to="/driver">
                        <button className="btn btn-info">
                            <Eye size={16}/> View as Driver
                        </button>
                    </Link> */}
                </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-lg p-4 overflow-x-auto">
                <table className="min-w-full border-collapse">
                    <thead>
                        <tr className="bg-gray-200">
                            {["Tracking ID", "Description", "Client Name", "Delivery Address", "Contact Number", "Email", "Assigned Date", "Expected Delivery", "Comments", "Actions"].map((header, index) => (
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
                                <td className="px-4 py-2 border space-x-2">
                                    <Link to={`/update/${data.TrackingID}`} className="btn btn-primary">
                                        <Edit size={16} />
                                    </Link>
                                    <button onClick={() => handleDelete(data.TrackingID)} className="btn btn-danger">
                                        <Trash2 size={16} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <div className="mt-4 p-4 bg-gray-200 rounded-md text-gray-700 font-semibold text-lg">
                    Total Deliveries: {dashboardData.length}
                </div>
            </div>
        </div>
    );
}

export default Dashboard;