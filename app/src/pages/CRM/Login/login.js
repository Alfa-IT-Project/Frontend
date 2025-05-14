import React, { useState } from 'react';
import { Form, Input, Button } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import styles from './login.module.css';
import apssaraLogo from './apssaraLogo.png';

const API_URL = 'http://localhost:4000/users';

export default function Login({ setToken, setRole, setUserId }) {
    const navigate = useNavigate();
    const [error, setError] = useState('');

    const onFinish = async (values) => {
        const { username, password } = values;
        setError(''); // Clear any previous errors
    
        try {
            const response = await axios.post(`${API_URL}/login`, { username, password });
    
            if (response.data.token) {
                localStorage.setItem('token', response.data.token);
                localStorage.setItem('role', response.data.role);
                localStorage.setItem('userId', response.data.userId);
                setToken(response.data.token);
                setRole(response.data.role);
                setUserId(parseInt(response.data.userId, 10));

                // Redirect to the appropriate dashboard
                if (response.data.role === 'customer') {
                    navigate('/customer-dashboard');
                } else if (response.data.role === 'general_manager') {
                    navigate('/manager-dashboard');
                } else if (response.data.role === 'delivery_manager') {
                    navigate('/delivery-manager-dashboard');
                } else if (response.data.role === 'product_manager') {
                    navigate('/product-manager-dashboard');
                } else if (response.data.role === 'driver') {
                    navigate('/driver');
                } else if (response.data.role === 'supplier_manager') {
                    navigate('/supplier-manager-dashboard');
                } else if (response.data.role === 'ADMIN') {
                    navigate('/manager');
                } else if (response.data.role === 'STAFF') {
                    navigate('/staff');
                }
            }
        } catch (error) {
            if (error.response) {
                if (error.response.status === 401) {
                    setError('Invalid username or password. Please try again.');
                } else if (error.response.status === 400) {
                    setError('User not found. Please check your username and try again.');
                } else {
                    setError('An error occurred. Please try again later.');
                }
            } else {
                console.error('Error during Axios request:', error);
                setError('Unable to connect to the server. Please try again later.');
            }
        }
    };
   
    return (
        <div className={styles.loginContainer}>
            <div className={styles.loginForm}>
                <img src={apssaraLogo} alt="Apssara Logo" className={styles.logo} />
                <h1 className={styles.formTitle}>Login</h1>
                {error && <div className={styles.errorMessage}>{error}</div>}
                <Form name="normal_login" onFinish={onFinish}>
                    <Form.Item
                        name="username"
                        rules={[{ required: true, message: 'Please input your Username!' }]}
                    >
                        <Input prefix={<UserOutlined />} placeholder="Username" />
                    </Form.Item>
                    <Form.Item
                        name="password"
                        rules={[{ required: true, message: 'Please input your Password!' }]}
                    >
                        <Input prefix={<LockOutlined />} type="password" placeholder="Password" />
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" htmlType="submit" className={styles.loginButton}>
                            Log in
                        </Button>
                    </Form.Item>
                </Form>
            </div>  
        </div>
    );
}




