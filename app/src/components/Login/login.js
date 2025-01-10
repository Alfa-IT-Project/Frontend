import React from 'react'
//import { Button, Checkbox, Form, Input } from 'antd';
import ReactDOM from 'react-dom';
import 'antd/dist/reset.css';
import './index.css';
import { Form, Input, Button, Checkbox } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import axios from 'axios';

const API_URL = 'http://localhost:4000/users'; // Your backend URL

export const registerUser = async (username, password) => {
    return await axios.post(`${API_URL}/register`, { username, password });
};

export const loginUser = async (username, password) => {
    return await axios.post(`${API_URL}/login`, { username, password });
};

export const getProtectedData = async (token) => {
    return await axios.get(`${API_URL}/protected`, {
        headers: { Authorization: `Bearer ${token}` }
    });
};

export default function Login() {
    const onFinish = (values) => {
        const { username, password } = values
        axios.post(`${API_URL}/login`, { username, password })
    .then(response => {
        console.log('Axios response:', response);
        if (response.data.token) {
            alert('User validated');
        } else {
            alert('Invalid credentials');
        }
    })
    .catch(error => {
        if (error.response) {
            if (error.response.status === 401) {
                alert('Invalid credentials. Please try again.');
            } else if (error.response.status === 404) {
                alert('User not found. Please register.');
            } else {
                alert('An error occurred. Please try again later.');
            }
        } else {
            console.error('Error during Axios request:', error);
            alert('Unable to connect to the server. Please try again later.');
        }
    });


    }
  return (
        <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh'}}>
            <div>
                    <Form
                        name="normal_login"
                        className="login-form"
                        initialValues={{
                            remember: true,
                        }}
                        onFinish={onFinish}
                        >
                        <Form.Item
                            name="username"
                            rules={[
                            {
                                required: true,
                                message: 'Please input your Username!',
                            },
                            ]}
                        >
                            <Input prefix={<UserOutlined className="site-form-item-icon" />} placeholder="Username" />
                        </Form.Item>
                        <Form.Item
                            name="password"
                            rules={[
                            {
                                required: true,
                                message: 'Please input your Password!',
                            },
                            ]}
                        >
                            <Input
                            prefix={<LockOutlined className="site-form-item-icon" />}
                            type="password"
                            placeholder="Password"
                            />
                        </Form.Item>
                        <Form.Item>
                            <Form.Item name="remember" valuePropName="checked" noStyle>
                            <Checkbox>Remember me</Checkbox>
                            </Form.Item>

                            <a className="login-form-forgot" href="">
                            Forgot password
                            </a>
                        </Form.Item>

                        <Form.Item>
                            <Button type="primary" htmlType="submit" className="login-form-button">
                            Log in
                            </Button>
                            Or <a href="">register now!</a>
                        </Form.Item>
                    </Form>
            </div>  
            
         </div>
  )
}


