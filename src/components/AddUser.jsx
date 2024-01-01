// AddUser.jsx
import React, { useState } from 'react';
import './Login.css'; // You can create a CSS file for styling
import Footer from './Footer';

const AddUser = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [title, setTitle] = useState('');
  const [clearance, setClearance] = useState('');

  const handleAddUser = async () => {
    try {
      const response = await fetch('http://localhost:3001/new_user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          firstName,
          lastName,
          username,
          password,
          email,
          title,
          clearance,
        }),
      });

      const data = await response.json();

      if (data.success) {
        // User added successfully
        console.log('User added successfully:', data.user);
      } else {
        // User addition failed
        console.error('Failed to add user:', data.message);
      }
    } catch (error) {
      console.error('Error adding user:', error);
    }
  };

  return (
    <div className="add-user-container">
      <h2>Add User</h2>
      <form>
        <label>
          First Name:
          <input type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
        </label>
        <br />
        <label>
          Last Name:
          <input type="text" value={lastName} onChange={(e) => setLastName(e.target.value)} />
        </label>
        <br />
        <label>
          Username:
          <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} />
        </label>
        <br />
        <label>
          Password:
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        </label>
        <br />
        <label>
          Email:
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
        </label>
        <br />
        <label>
          Title:
          <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} />
        </label>
        <br />
        <label>
          Clearance:
          <input type="text" value={clearance} onChange={(e) => setClearance(e.target.value)} />
        </label>
        <br />
        <button type="button" onClick={handleAddUser}>
          Add User
        </button>
      </form>
    </div>
  );
};

export default AddUser;
