import { useEffect, useState } from 'react';
import axios from 'axios';
import { Table, Card, Typography } from 'antd';
import styles from './styles.module.css';
import apssaraLogo from './apssaraLogo.png'; 
import { useNavigate } from 'react-router-dom';
const { Title } = Typography;

const AdminContactMessages = () => {
  const [messages, setMessages] = useState([]);
  const navigate = useNavigate();
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await axios.get('http://localhost:4000/contact');
        setMessages(response.data);
      } catch (error) {
        console.error('Error fetching messages:', error);
      }
    };

    fetchMessages();
  }, []);

  const columns = [
    { title: 'ID', dataIndex: 'id', key: 'id' },
    { title: 'Name', dataIndex: 'name', key: 'name' },
    { title: 'Email', dataIndex: 'email', key: 'email' },
    { title: 'Subject', dataIndex: 'subject', key: 'subject' },
    { title: 'Message', dataIndex: 'message', key: 'message' },
    { title: 'Date', dataIndex: 'createdAt', key: 'createdAt', render: (date) => new Date(date).toLocaleString() },
  ];

  const handleClick1 = () => {
    navigate('/manager-dashboard');
  };

  const handleClick2 = () => {
    navigate('/customers');
  };
  const handleClick3 = () => {
    navigate('/purchases');
  };
  const handleClick4 = () => {
    navigate('/contactList');
  };
  const handleLogout = () => {
    localStorage.removeItem("token"); 
    navigate("/login"); 
  };
  return (
   <div className={styles.contain}>
         {/* Topmost Section: Navbar within Image Container */}
         <div className={styles.header}>
         <img src={apssaraLogo} alt="Company Logo" className={styles.logo} />
         
           <nav className={styles.navbar}>
   
             <button className={styles.navButton} onClick={handleClick1}>Home</button>
             <button className={styles.navButton} onClick={handleClick2}>Customers</button>
             <button className={styles.navButton} onClick={handleClick3}>Purchases</button>
             <button className={styles.navButton} onClick={handleClick4}>ContactList</button>
             <button onClick={handleLogout} style={styles.button}>
                   Logout
             </button>
           </nav>
         </div> 
         <div>
         <Card style={{ margin: '20px', padding: '20px' }}>
         <Title level={3}>Contact Messages</Title>
            <Title level={3}>Contact Messages</Title>
            <Table dataSource={messages} columns={columns} rowKey="id" />
         </Card>
         </div>
    </div>
    
  );
};

export default AdminContactMessages;
