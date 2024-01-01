// Login.jsx
import React, { useState } from 'react';
import './Login.css';



export default function Login(){

  const [formData, setFormData] = useState({
    userId: '',
    password: '',
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async () => {
    try {
      const response = await fetch('http://localhost:3001/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success) {
        // Handle successful login, e.g., redirect to another page
        console.log('Login successful:', data.user);
      } else {
        // Handle login failure, e.g., display an error message
        console.error('Login failed:', data.message);
      }
    } catch (error) {
      console.error('Error submitting login form:', error);
      // Handle fetch errors or other unexpected issues
    }
  };

  return (
    <div className="login-container">
      <h2>Login</h2>
      <form>
        <label>
          Username or Email:
          <input
            type="text"
            name="userId"
            value={formData.userID}
            onChange={handleInputChange}
          />
        </label>
        <br />
        <label>
          Password:
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleInputChange}
          />
        </label>
        <br />
        <button type="button" className="btn btn-primary btn-lg" onClick={handleSubmit}>
          Login
        </button>
      </form>
    </div>
  );
};
