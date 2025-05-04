import React from 'react';
import { Form, Input, Button } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const API_URL = 'http://localhost:4000/users';

export default function Login({ setToken , setRole, setUserId}) {
    const navigate = useNavigate(); // For redirection

    const onFinish = async (values) => {
        const { username, password } = values;
    
        try {
            const response = await axios.post(`${API_URL}/login`, { username, password });
    
            if (response.data.token) {
                alert('User validated');
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
                }else if (response.data.role === 'delivery_manager') {
                    navigate('/delivery-manager-dashboard');
                } else if (response.data.role === 'product_manager') {
                    navigate('/product-manager-dashboard');
                }else if(response.data.role === 'driver') {
                    navigate( '/driver');
                }
            } else {
                alert('Invalid credentials');
            }
        } catch (error) {
            if (error.response) {
                if (error.response.status === 401) {
                    alert('Invalid credentials. Please try again.');
                } else if (error.response.status === 400) {
                    alert('User not found. Please register.');
                } else {
                    alert('An error occurred. Please try again later.');
                }
            } else {
                console.error('Error during Axios request:', error);
                alert('Unable to connect to the server. Please try again later.');
            }
        }
    };
   
    return (
        <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh'}}>
            <div>
                <Form name="normal_login" className="login-form" onFinish={onFinish}>
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
                        <Button type="primary" htmlType="submit" className="login-form-button">
                            Log in
                        </Button>
                    </Form.Item>
                </Form>
            </div>  
        </div>
    );
}



// import React from 'react'
// //import { Button, Checkbox, Form, Input } from 'antd';
// //import ReactDOM from 'react-dom';
// import 'antd/dist/reset.css';
// import './index.css';
// import { Form, Input, Button } from 'antd';
// import { UserOutlined, LockOutlined } from '@ant-design/icons';
// import axios from 'axios';

// const API_URL = 'http://localhost:4000/users'; // Your backend URL

// // export const registerUser = async (username, password) => {
// //     return await axios.post(`${API_URL}/register`, { username, password });
// // };

// // export const loginUser = async (username, password) => {
// //     return await axios.post(`${API_URL}/login`, { username, password });
// // };

// // export const getProtectedData = async (token) => {
// //     return await axios.get(`${API_URL}/protected`, {
// //         headers: { Authorization: `Bearer ${token}` }
// //     });
// // };

// export default function Login() {
//     const onFinish = async (values) => {
//         const { username, password } = values;
    
//         try {
//             const response = await axios.post(`${API_URL}/login`, { username, password });
    
//             if (response.data.token) {
//                 alert('User validated');
//                 localStorage.setItem('token', response.data.token); // Store token in localStorage
//                 console.log('Token stored:', response.data.token);
//             } else {
//                 alert('Invalid credentials');
//             }
//         } catch (error) {
//             if (error.response) {
//                 if (error.response.status === 401) {
//                     alert('Invalid credentials. Please try again.');
//                 } else if (error.response.status === 400) {
//                     alert('User not found. Please register.');
//                 } else {
//                     alert('An error occurred. Please try again later.');
//                 }
//             } else {
//                 console.error('Error during Axios request:', error);
//                 alert('Unable to connect to the server. Please try again later.');
//             }
//         }
//     };
   
//   return (
//         <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh'}}>
//             <div>
//                     <Form
//                         name="normal_login"
//                         className="login-form"
//                         initialValues={{
//                             remember: true,
//                         }}
//                         onFinish={onFinish}
//                         >
//                         <Form.Item
//                             name="username"
//                             rules={[
//                             {
//                                 required: true,
//                                 message: 'Please input your Username!',
//                             },
//                             ]}
//                         >
//                             <Input prefix={<UserOutlined className="site-form-item-icon" />} placeholder="Username" />
//                         </Form.Item>
//                         <Form.Item
//                             name="password"
//                             rules={[
//                             {
//                                 required: true,
//                                 message: 'Please input your Password!',
//                             },
//                             ]}
//                         >
//                             <Input
//                             prefix={<LockOutlined className="site-form-item-icon" />}
//                             type="password"
//                             placeholder="Password"
//                             />
//                         </Form.Item>

//                         <Form.Item>
//                             <Button type="primary" htmlType="submit" className="login-form-button">
//                             Log in
//                             </Button>
//                         </Form.Item>
//                     </Form>
//             </div>  
            
//          </div>
//   )
// }


