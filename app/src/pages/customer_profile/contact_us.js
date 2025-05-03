import { useState } from "react";
import axios from "axios";
import NavBar from "../../components/CRM/customer/NavBar.js"; 
const ContactUs = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:4000/contact", formData);
      console.log("Message sent successfully", response.data);
      alert("Message sent!");
      setFormData({ name: "", email: "", subject: "", message: "" }); // Reset form
    } catch (error) {
      console.error("Error sending message:", error.response?.data || error.message);
      alert("Failed to send message");
    }
  };

  return (
    <div>
        <NavBar/>

    <form onSubmit={handleSubmit} style={ {maxWidth: '600px', margin: '0 auto', padding: '20px' }}>
        <h2>Contact Us</h2>
      <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Your Name" required />
      <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Your Email" required />
      <input type="text" name="subject" value={formData.subject} onChange={handleChange} placeholder="Subject" required />
      <textarea name="message" value={formData.message} onChange={handleChange} placeholder="Message" required />
      <button type="submit">Send</button>
    </form>
    </div>
  );
};

export default ContactUs;
